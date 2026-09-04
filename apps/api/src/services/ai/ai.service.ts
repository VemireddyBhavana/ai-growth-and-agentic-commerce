import { randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma.config.js';
import { AppError } from '../../utils/app-error.js';
import { logger } from '../../utils/logger.js';
import { OpenAiProvider } from './ai.provider.js';
import type { AiCatalogProduct, AiProvider, RankedRecommendation, ShoppingRequirements } from './ai.types.js';

const highConfidence = 0.55;
function publicProduct(product: any, recommendation: RankedRecommendation) { return { productId:product.id,name:product.name,description:product.description,brand:product.brand,price:Number(product.price),currency:product.currency,category:product.productCategory?.name ?? product.category,available:product.inventory.some((i:any)=>i.quantity > i.reservedQuantity && i.status !== 'OUT_OF_STOCK'),confidence:recommendation.confidence,reason:recommendation.reason,matchedPreferences:recommendation.matchedPreferences,rank:recommendation.rank }; }
function clarificationFor(requirements: ShoppingRequirements): string { if (!requirements.query && !requirements.category) return 'What are you shopping for, and what is your approximate budget?'; if (requirements.maxPrice) return `I couldn't find a match under ₹${requirements.maxPrice}. Would you like to increase your budget or relax a preference?`; return 'I could not find a matching product. Would you like to adjust your requirements?'; }

export class AiService {
  constructor(private readonly provider: AiProvider = new OpenAiProvider()) {}
  private async candidates(storeId:string, requirements:ShoppingRequirements) {
    const where:any={storeId,status:'ACTIVE',isActive:true};
    if(requirements.maxPrice !== undefined || requirements.minPrice !== undefined) where.price={gte:requirements.minPrice,lte:requirements.maxPrice};
    if(requirements.brand) where.brand={equals:requirements.brand,mode:'insensitive'};
    if(requirements.category) where.OR=[{category:{contains:requirements.category,mode:'insensitive'}},{productCategory:{name:{contains:requirements.category,mode:'insensitive'}}},{productCategory:{slug:{contains:requirements.category.toLowerCase().replace(/\s+/g,'-')}}}];
    const products=await prisma.product.findMany({where,include:{productCategory:true,inventory:true},take:50,orderBy:{createdAt:'desc'}});
    const available=products.filter(p=>!requirements.availabilityRequired || p.inventory.some(i=>i.quantity>i.reservedQuantity&&i.status!=='OUT_OF_STOCK'));
    const q=requirements.query.toLowerCase();
    return available.filter(p=>!q || [p.name,p.description,p.brand,p.category,...p.tags].filter(Boolean).join(' ').toLowerCase().includes(q) || requirements.preferredAttributes.some(x=>[p.name,p.description,...p.tags].filter(Boolean).join(' ').toLowerCase().includes(x.toLowerCase())));
  }
  private async conversation(storeId:string, conversationId?:string) {
    if(conversationId){ const existing=await prisma.aiConversation.findFirst({where:{id:conversationId,storeId}}); if(!existing) throw new AppError({statusCode:404,code:'CONVERSATION_NOT_FOUND',message:'Conversation not found'}); return existing; }
    const sessionId=`ai_${randomUUID()}`; await prisma.session.create({data:{sessionId,storeId}});
    return prisma.aiConversation.create({data:{storeId,sessionId,productIds:[]}});
  }
  async chat(storeId:string, actorId:string, message:string, conversationId?:string) {
    const started=Date.now(); const conversation=await this.conversation(storeId,conversationId);
    await prisma.aiMessage.create({data:{conversationId:conversation.id,role:'USER',content:message}});
    await prisma.analyticsEvent.create({data:{storeId,eventType:'AI_SEARCH_STARTED',metadata:{conversationId:conversation.id}}});
    logger.info({conversationId:conversation.id,storeId},'AI request started');
    let requirements:ShoppingRequirements;
    try { requirements=await this.provider.extractRequirements(message); } catch(error) { await this.failure(storeId,conversation.id,'AI_PROVIDER_FAILURE'); throw error; }
    if(requirements.intent==='CLARIFICATION_REQUIRED' || (!requirements.query && !requirements.category)) return this.clarify(storeId,actorId,conversation.id,requirements,'INSUFFICIENT_REQUIREMENTS');
    const products=await this.candidates(storeId,requirements);
    if(!products.length) return this.clarify(storeId,actorId,conversation.id,requirements,'NO_MATCH');
    const facts:AiCatalogProduct[]=products.map(p=>({id:p.id,name:p.name,description:p.description,brand:p.brand,price:Number(p.price),currency:p.currency,category:p.productCategory?.name??p.category,tags:p.tags,available:p.inventory.some(i=>i.quantity>i.reservedQuantity&&i.status!=='OUT_OF_STOCK')}));
    let rankings:RankedRecommendation[];
    try { rankings=await this.provider.rankProducts(requirements,facts); } catch(error) { await this.failure(storeId,conversation.id,'AI_PROVIDER_FAILURE'); throw error; }
    const allowed=new Set(products.map(p=>p.id));
    if(rankings.some(r=>!allowed.has(r.productId))) { await this.failure(storeId,conversation.id,'AI_HALLUCINATED_PRODUCT_REJECTED'); throw new AppError({statusCode:502,code:'AI_PROVIDER_INVALID_RESPONSE',message:'AI provider returned an invalid product reference'}); }
    const selected=rankings.filter(r=>r.confidence>=highConfidence).sort((a,b)=>a.rank-b.rank).slice(0,5);
    if(!selected.length) return this.clarify(storeId,actorId,conversation.id,requirements,'LOW_CONFIDENCE');
    const productById=new Map(products.map(p=>[p.id,p])); const recommendations=selected.map(r=>publicProduct(productById.get(r.productId),r));
    const response=`Here are the best matches from this store's catalog.`; const requirementsJson = JSON.parse(JSON.stringify(requirements)) as Prisma.InputJsonValue;
    await prisma.$transaction(async tx=>{ await tx.aiMessage.create({data:{conversationId:conversation.id,role:'ASSISTANT',content:response}}); await tx.aiRecommendation.createMany({data:selected.map(r=>({conversationId:conversation.id,productId:r.productId,reason:r.reason,confidenceScore:r.confidence,rank:r.rank}))}); await tx.aiDecision.create({data:{storeId,conversationId:conversation.id,decisionType:'PRODUCT_RECOMMENDATION',inputSummary:message.slice(0,500),decision:`Recommended ${selected.map(r=>r.productId).join(', ')}`,confidenceScore:Math.max(...selected.map(r=>r.confidence)),reason:'Recommendations are constrained to active, available merchant catalog products and customer requirements.',rulesApplied:{requirements:requirementsJson,consideredProductIds:products.map(p=>p.id),recommendedProductIds:selected.map(r=>r.productId)},alternativesConsidered:[]}}); await tx.auditEvent.create({data:{storeId,eventType:'AI_RECOMMENDATION_GENERATED',actorType:'USER',actorId,metadata:{conversationId:conversation.id,requirements:requirementsJson,recommendedProductIds:selected.map(r=>r.productId)}}}); await tx.analyticsEvent.create({data:{storeId,eventType:'AI_RECOMMENDATION_GENERATED',metadata:{conversationId:conversation.id,count:selected.length}}}); await tx.aiConversation.update({where:{id:conversation.id},data:{message:response,productIds:selected.map(r=>r.productId),confidence:Math.max(...selected.map(r=>r.confidence)),metadata:{requirements:requirementsJson}}}); });
    logger.info({conversationId:conversation.id,recommendationCount:selected.length,providerLatencyMs:Date.now()-started},'AI recommendation generated'); return {conversationId:conversation.id,message:response,recommendations,needsClarification:false};
  }
  private async clarify(storeId:string,actorId:string,conversationId:string,requirements:ShoppingRequirements,reason:string) {
    const question=clarificationFor(requirements); const requirementsJson = JSON.parse(JSON.stringify(requirements)) as Prisma.InputJsonValue;
    await prisma.$transaction([
      prisma.aiMessage.create({data:{conversationId,role:'ASSISTANT',content:question}}),
      prisma.aiDecision.create({data:{storeId,conversationId,decisionType:'CLARIFICATION_REQUIRED',inputSummary:requirements.query,decision:reason,confidenceScore:0,reason:question,rulesApplied:{requirements:requirementsJson},alternativesConsidered:[]}}),
      prisma.auditEvent.create({data:{storeId,eventType:'AI_CLARIFICATION_REQUESTED',actorType:'USER',actorId,metadata:{conversationId,reason,requirements:requirementsJson}}}),
      prisma.analyticsEvent.create({data:{storeId,eventType:reason==='NO_MATCH'?'AI_NO_MATCH':'AI_CLARIFICATION_REQUESTED',metadata:{conversationId,reason}}}),
    ]);
    return {conversationId,message:question,recommendations:[],needsClarification:true,clarificationQuestion:question};
  }
  private async failure(storeId:string,conversationId:string,eventType:string) { await prisma.analyticsEvent.create({data:{storeId,eventType,metadata:{conversationId}}}).catch(()=>undefined); }
}
export const aiService=new AiService();
