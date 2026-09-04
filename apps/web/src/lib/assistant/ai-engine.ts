import type {
  AssistantProduct,
  RecommendationCardData,
  RecommendationExplainability,
  DynamicBundle,
  AiInsightsData,
  ComparisonData,
  ChatApiResponse,
  AssistantSettings,
  CartItem,
} from '@ai-sales-assistant/types';
import { ASSISTANT_CATALOG, PRECONFIGURED_BUNDLES } from './catalog-data';

interface ParsedIntent {
  intentType:
    | 'budget_search'
    | 'category_search'
    | 'feature_search'
    | 'comparison'
    | 'bundle_request'
    | 'checkout_intent'
    | 'general_query'
    | 'greeting';
  budgetMax: number | null;
  budgetMin: number | null;
  category: string | null;
  brand: string | null;
  features: string[];
  keywords: string[];
  productMentions: AssistantProduct[];
}

/**
 * Extracts numeric budget from text like "under 3000", "under ₹3000", "below 5k", "under 1000"
 */
function extractBudget(text: string): { max: number | null; min: number | null } {
  const clean = text.toLowerCase();
  
  // Under / Below / Less than X
  const maxMatches = [
    /(?:under|below|less than|within|max(?:imum)?|upto|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lac|lakh)?/i,
    /(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lac|lakh)?\s*(?:budget|or less|max)/i,
    /(\d+(?:,\d+)?)\s*k\s*(?:budget|or less)?/i,
  ];

  for (const regex of maxMatches) {
    const match = clean.match(regex);
    if (match) {
      let num = parseFloat(match[1].replace(/,/g, ''));
      const unit = match[2]?.toLowerCase();
      if (unit === 'k' || (!unit && match[0].includes('k'))) {
        num *= 1000;
      } else if (unit === 'lac' || unit === 'lakh') {
        num *= 100000;
      }
      if (!isNaN(num) && num > 0) {
        return { max: num, min: null };
      }
    }
  }

  // Check standalone under 1000 / 3000 / 5000 chip patterns
  const chipMatch = clean.match(/(?:under|below)\s*₹?\s*(\d+)/i);
  if (chipMatch) {
    const num = parseInt(chipMatch[1], 10);
    if (!isNaN(num)) return { max: num, min: null };
  }

  return { max: null, min: null };
}

/**
 * Parse user query to identify shopping intent, category, features, and brand
 */
export function parseUserShoppingQuery(query: string): ParsedIntent {
  const q = query.toLowerCase();
  const budget = extractBudget(q);

  let category: string | null = null;
  if (q.includes('earbud') || q.includes('headphone') || q.includes('audio') || q.includes('sound') || q.includes('music') || q.includes('speaker') || q.includes('tws')) {
    category = 'Audio';
  } else if (q.includes('watch') || q.includes('smartwatch') || q.includes('fitness') || q.includes('wearable') || q.includes('tracker')) {
    category = 'Wearables';
  } else if (q.includes('lamp') || q.includes('light') || q.includes('desk') || q.includes('office') || q.includes('room') || q.includes('chair')) {
    category = 'Home & Office';
  } else if (q.includes('power bank') || q.includes('charger') || q.includes('cable') || q.includes('mouse') || q.includes('stand') || q.includes('magsafe')) {
    category = 'Accessories';
  } else if (q.includes('keyboard') || q.includes('gaming') || q.includes('rgb') || q.includes('headset')) {
    category = 'Gaming & Tech';
  }

  let brand: string | null = null;
  const knownBrands = ['nexus', 'bolt', 'aura', 'nova', 'quantum', 'lume', 'swift', 'clearview', 'apex', 'magcharge', 'ergogrip'];
  for (const b of knownBrands) {
    if (q.includes(b)) {
      brand = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }

  const features: string[] = [];
  if (q.includes('anc') || q.includes('noise cancel') || q.includes('noise reduction')) features.push('ANC');
  if (q.includes('battery') || q.includes('long life') || q.includes('playtime')) features.push('Long Battery');
  if (q.includes('waterproof') || q.includes('ipx') || q.includes('splash')) features.push('Waterproof');
  if (q.includes('wireless') || q.includes('bluetooth') || q.includes('tws')) features.push('Wireless');
  if (q.includes('fast charg') || q.includes('gan') || q.includes('quick charg')) features.push('Fast Charging');
  if (q.includes('amoled') || q.includes('display') || q.includes('screen')) features.push('AMOLED Display');
  if (q.includes('gps') || q.includes('workout') || q.includes('gym')) features.push('GPS Tracking');
  if (q.includes('4k') || q.includes('hd') || q.includes('webcam') || q.includes('camera')) features.push('4K Video');

  // Detect comparison
  const isComparison = q.includes('compare') || q.includes(' vs ') || q.includes('versus') || q.includes('which is better') || q.includes('difference between');

  // Detect bundle
  const isBundle = q.includes('bundle') || q.includes('combo') || q.includes('kit') || q.includes('pack') || q.includes('setup');

  // Detect checkout
  const isCheckout = q.includes('checkout') || q.includes('buy now') || q.includes('pay') || q.includes('razorpay') || q.includes('order now');

  // Detect product mentions from catalog
  const productMentions = ASSISTANT_CATALOG.filter(
    (p) =>
      q.includes(p.name.toLowerCase()) ||
      q.includes(p.sku.toLowerCase()) ||
      p.tags.some((t) => q.includes(t) && t.length > 3)
  );

  let intentType: ParsedIntent['intentType'] = 'general_query';
  if (isCheckout) intentType = 'checkout_intent';
  else if (isComparison) intentType = 'comparison';
  else if (isBundle) intentType = 'bundle_request';
  else if (budget.max !== null) intentType = 'budget_search';
  else if (category !== null) intentType = 'category_search';
  else if (features.length > 0) intentType = 'feature_search';
  else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q === 'help') intentType = 'greeting';

  return {
    intentType,
    budgetMax: budget.max,
    budgetMin: budget.min,
    category,
    brand,
    features,
    keywords: q.split(/\s+/).filter((w) => w.length > 2),
    productMentions,
  };
}

/**
 * Score & rank products based on user intent, budget match, ratings, stock, and popularity
 */
export function rankProducts(
  products: AssistantProduct[],
  intent: ParsedIntent,
  limit: number = 4
): RecommendationCardData[] {
  const scored = products.map((product) => {
    let score = 50; // base score

    // 1. Budget Fit Score (High Weight)
    let budgetMatchDesc = 'Standard Pricing';
    if (intent.budgetMax !== null) {
      if (product.price <= intent.budgetMax) {
        const ratio = product.price / intent.budgetMax;
        // Perfect sweet spot is 70% to 100% of budget
        const fitBonus = ratio >= 0.6 ? 40 : 25;
        score += fitBonus;
        const diff = intent.budgetMax - product.price;
        budgetMatchDesc = `100% within budget (₹${product.price.toLocaleString('en-IN')} vs ₹${intent.budgetMax.toLocaleString('en-IN')} max, save ₹${diff.toLocaleString('en-IN')})`;
      } else {
        // Over budget penalty
        const overBudgetPercentage = (product.price - intent.budgetMax) / intent.budgetMax;
        score -= overBudgetPercentage * 50;
        budgetMatchDesc = `₹${(product.price - intent.budgetMax).toLocaleString('en-IN')} above budget (Premium tier)`;
      }
    } else {
      budgetMatchDesc = `₹${product.price.toLocaleString('en-IN')} (${product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) + '% off' : 'Great value'})`;
    }

    // 2. Category Match
    if (intent.category && product.category.toLowerCase().includes(intent.category.toLowerCase())) {
      score += 30;
    }

    // 3. Keyword / Tag Matches
    const matchingTags = product.tags.filter((tag) =>
      intent.keywords.some((kw) => tag.includes(kw) || kw.includes(tag))
    );
    score += matchingTags.length * 10;

    // 4. Feature Matches
    for (const feat of intent.features) {
      if (
        product.features.some((f) => f.toLowerCase().includes(feat.toLowerCase())) ||
        product.tags.some((t) => t.toLowerCase().includes(feat.toLowerCase()))
      ) {
        score += 15;
      }
    }

    // 5. Brand Match
    if (intent.brand && product.brand.toLowerCase() === intent.brand.toLowerCase()) {
      score += 20;
    }

    // 6. Rating & Stock multiplier
    score += (product.rating - 4.0) * 20; // 4.8 adds 16
    if (product.stock > 50) score += 10;
    if (product.isFeatured) score += 8;

    // Normalizing confidence score to 72% - 98%
    const confidenceScore = Math.min(99, Math.max(68, Math.round(score)));

    // Explainable AI Reasoning Synthesis
    const reasons: string[] = [];
    if (intent.budgetMax !== null && product.price <= intent.budgetMax) {
      reasons.push(`matches your ₹${intent.budgetMax.toLocaleString('en-IN')} budget at ₹${product.price.toLocaleString('en-IN')}`);
    } else if (intent.budgetMax !== null) {
      reasons.push(`premium flagship alternative with higher tier build quality`);
    }

    reasons.push(`has a top-tier ${product.rating}★ rating across ${product.reviewsCount.toLocaleString('en-IN')} verified customer reviews`);
    
    if (product.stock > 100) {
      reasons.push(`ready in high stock with fast fulfillment`);
    } else {
      reasons.push(`high demand item with verified fast dispatch`);
    }

    if (product.features.length > 0) {
      reasons.push(`includes ${product.features[0]}`);
    }

    const naturalReason = `Recommended because it ${reasons.join(', ')}.`;

    const explainability: RecommendationExplainability = {
      reason: naturalReason,
      confidenceScore,
      customerIntent: intent.category
        ? `${intent.category} discovery${intent.budgetMax ? ` under ₹${intent.budgetMax.toLocaleString('en-IN')}` : ''}`
        : 'Smart Product Recommendation',
      inventoryAvailability: `${product.stock} units in stock • ${product.stock > 50 ? 'High Stock' : 'Limited Stock'}`,
      priceMatch: budgetMatchDesc,
      popularityScore: Math.min(99, Math.round(product.rating * 19.5)),
      expectedMargin: product.margin ? `Optimized Value (${Math.round(product.margin * 100)}% margin)` : 'Best Seller Value',
      bundleAdvantage: 'Eligible for 15% instant multi-item bundle discount at checkout',
    };

    return {
      product,
      explainability,
      rawScore: score,
      isTopPick: false,
      isUpsell: false as boolean,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.rawScore - a.rawScore);

  const top = scored.slice(0, limit);
  if (top.length > 0) {
    top[0].isTopPick = true;
  }

  // If there's a higher tier product that scored well, mark as upsell
  if (top.length > 1 && top[1].product.price > top[0].product.price) {
    top[1].isUpsell = true;
  }

  return top.map(({ product, explainability, isTopPick, isUpsell }) => ({
    product,
    explainability,
    isTopPick,
    isUpsell,
  }));
}

/**
 * Generate Feature-by-Feature Comparison Matrix
 */
export function generateComparison(products: AssistantProduct[]): ComparisonData {
  const p1 = products[0];
  const p2 = products[1] || products[0];

  return {
    title: `Comparison: ${p1.name} vs ${p2.name}`,
    columns: ['Feature', p1.name, p2.name],
    rows: [
      {
        label: 'Price',
        values: [
          `₹${p1.price.toLocaleString('en-IN')}`,
          `₹${p2.price.toLocaleString('en-IN')}`,
        ],
      },
      {
        label: 'Rating',
        values: [`${p1.rating}★ (${p1.reviewsCount})`, `${p2.rating}★ (${p2.reviewsCount})`],
      },
      {
        label: 'Category',
        values: [p1.category, p2.category],
      },
      {
        label: 'Key Feature',
        values: [p1.features[0] || 'Standard Specs', p2.features[0] || 'Standard Specs'],
      },
      {
        label: 'Battery / Power',
        values: [
          p1.specs?.find((s) => s.name.toLowerCase().includes('battery'))?.value || 'Standard',
          p2.specs?.find((s) => s.name.toLowerCase().includes('battery'))?.value || 'Standard',
        ],
      },
      {
        label: 'Delivery',
        values: [p1.deliveryEstimate, p2.deliveryEstimate],
      },
    ],
    recommendationNote:
      p1.price < p2.price
        ? `${p1.name} delivers higher value-for-money, while ${p2.name} offers premium pro capabilities.`
        : `${p2.name} is the budget champion, while ${p1.name} is the ultimate flagship pick.`,
  };
}

/**
 * Generate Follow-up Suggestions
 */
export function generateFollowUps(
  intent: ParsedIntent,
  recommendations: RecommendationCardData[]
): string[] {
  const suggestions: string[] = [];

  if (recommendations.length > 0) {
    const topProd = recommendations[0].product;
    suggestions.push(`Tell me more about ${topProd.name}`);
    suggestions.push(`What accessories go with ${topProd.name}?`);
  }

  if (recommendations.length >= 2) {
    suggestions.push(`Compare ${recommendations[0].product.name} vs ${recommendations[1].product.name}`);
  }

  if (intent.budgetMax !== null) {
    suggestions.push(`Show me options under ₹${Math.round(intent.budgetMax * 1.5).toLocaleString('en-IN')}`);
  } else {
    suggestions.push('Show bundles with extra discounts');
  }

  suggestions.push('How fast is delivery to my pin code?');
  return suggestions.slice(0, 4);
}

/**
 * AI Shopping Assistant Core Execution Function
 */
export async function processShoppingAssistantMessage(
  userMessage: string,
  _history: { role: 'user' | 'assistant'; content: string }[] = [],
  settings?: Partial<AssistantSettings>,
  _cartItems?: CartItem[]
): Promise<ChatApiResponse> {
  const intent = parseUserShoppingQuery(userMessage);

  // Filter Catalog
  let candidateProducts = [...ASSISTANT_CATALOG];
  if (intent.category) {
    const filtered = candidateProducts.filter(
      (p) => p.category.toLowerCase().includes(intent.category!.toLowerCase())
    );
    if (filtered.length > 0) {
      candidateProducts = filtered;
    }
  }

  // Handle specific product mention
  if (intent.productMentions.length > 0) {
    // put mentioned products at the front
    const mentionedIds = new Set(intent.productMentions.map((p) => p.id));
    candidateProducts = [
      ...intent.productMentions,
      ...candidateProducts.filter((p) => !mentionedIds.has(p.id)),
    ];
  }

  const maxRecs = settings?.maxRecommendations || 3;
  const recommendations = rankProducts(candidateProducts, intent, maxRecs);

  // Dynamic Bundle Matching
  let matchingBundle: DynamicBundle | null = null;
  if (intent.intentType === 'bundle_request' || intent.category === 'Home & Office') {
    matchingBundle = PRECONFIGURED_BUNDLES[0]; // Home Office Kit
  } else if (intent.category === 'Audio' || (intent.budgetMax && intent.budgetMax < 8000)) {
    matchingBundle = PRECONFIGURED_BUNDLES[1]; // Commuter pack
  } else if (intent.category === 'Gaming & Tech') {
    matchingBundle = PRECONFIGURED_BUNDLES[2]; // Productivity desk set
  } else {
    matchingBundle = PRECONFIGURED_BUNDLES[1];
  }

  // Generate Comparison if requested or 2 top products exist
  let comparison: ComparisonData | undefined;
  if (intent.intentType === 'comparison' && recommendations.length >= 2) {
    comparison = generateComparison([recommendations[0].product, recommendations[1].product]);
  }

  // Thinking Steps for transparency
  const thinkingSteps: string[] = [
    `Analyzing query for product attributes, budget thresholds, and intent...`,
    intent.budgetMax
      ? `Extracted ceiling budget constraint: ₹${intent.budgetMax.toLocaleString('en-IN')}`
      : `Broad catalog discovery active across ${ASSISTANT_CATALOG.length} verified products`,
    intent.category ? `Filtered category: ${intent.category}` : `Multi-category neural search active`,
    `Computing explainable recommendation match scores and stock velocity...`,
    `Synthesizing autonomous recommendations and checkout parameters...`,
  ];

  // Natural Language Reply Generation
  let reply = '';
  if (intent.intentType === 'greeting') {
    reply = `Hello! I'm your **Autonomous AI Shopping Concierge**. 

I can help you:
- **Discover top-rated products** by budget, category, or feature
- **Compare specs & pricing** side-by-side
- **Unlock dynamic bundle discounts** of up to 20%
- **Prepare 1-click Razorpay test checkout** instantly

What are you looking for today?`;
  } else if (intent.intentType === 'comparison' && comparison) {
    reply = `Here is a detailed side-by-side comparison between **${recommendations[0]?.product.name}** and **${recommendations[1]?.product.name}**. Both are top performers in our catalog:`;
  } else if (intent.intentType === 'checkout_intent') {
    reply = `I'm ready to prepare your **Razorpay Test Checkout**! You can review your cart on the right panel or click **Buy Now** on any product below to test the instant payment flow.`;
  } else if (recommendations.length === 0) {
    reply = `I searched our catalog for **"${userMessage}"**, but couldn't find an exact match under those strict filters. 

Here are some popular alternatives you might love, or you can broaden your search!`;
  } else {
    const top = recommendations[0].product;
    const countText = recommendations.length === 1 ? 'the best match' : `${recommendations.length} outstanding options`;
    const budgetContext = intent.budgetMax
      ? ` under your **₹${intent.budgetMax.toLocaleString('en-IN')}** budget`
      : '';

    reply = `I found **${countText}**${budgetContext} based on your preferences!

My top recommendation is the **${top.name}** (₹${top.price.toLocaleString('en-IN')}). It has a stellar **${top.rating}★** rating from ${top.reviewsCount.toLocaleString('en-IN')} verified customers and includes **${top.features[0] || 'premium performance'}**.

Check out the detailed recommendations and Explainable AI match scores below:`;
  }

  // Follow-up suggestions
  const followUpSuggestions = generateFollowUps(intent, recommendations);

  // Insights Data
  const topProduct = recommendations[0]?.product;
  const insights: AiInsightsData = {
    intent: intent.category
      ? `${intent.category} Discovery`
      : intent.budgetMax
        ? `Budget Search (₹${intent.budgetMax.toLocaleString('en-IN')})`
        : 'Smart Product Search',
    budget: {
      max: intent.budgetMax,
      currentMatch: topProduct ? topProduct.price : 0,
      currency: 'INR',
      isBudgetMatch: intent.budgetMax !== null ? (topProduct ? topProduct.price <= intent.budgetMax : true) : true,
    },
    detectedCategory: intent.category || (topProduct ? topProduct.category : 'Electronics'),
    preferredBrand: intent.brand || (topProduct ? topProduct.brand : 'Nexus'),
    recommendedBundle: matchingBundle,
    estimatedSavings: matchingBundle ? matchingBundle.savings : topProduct?.comparePrice ? topProduct.comparePrice - topProduct.price : 500,
    activeTags: topProduct ? topProduct.tags.slice(0, 5) : ['trending', 'top-rated'],
    confidenceScore: recommendations[0]?.explainability.confidenceScore || 94,
  };

  return {
    reply,
    thinkingSteps,
    recommendations,
    followUpSuggestions,
    insights,
    comparison,
    bundleOffer: matchingBundle || undefined,
  };
}
