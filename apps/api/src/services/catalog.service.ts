import type { Prisma } from '@prisma/client';
import { InventoryStatus, ProductStatus } from '@prisma/client';
import { prisma } from '../config/prisma.config.js';
import { AppError } from '../utils/app-error.js';

const productInclude = { productCategory: true, variants: { include: { inventory: true } }, inventory: true } satisfies Prisma.ProductInclude;
type ProductQuery = { search?: string; category?: string; brand?: string; minPrice?: number; maxPrice?: number; availability?: boolean; discount?: boolean; isFeatured?: boolean; isBestSeller?: boolean; page: number; limit: number; sort: 'createdAt'|'price'|'name'; order: 'asc'|'desc' };
const statusFor = (quantity: number, reserved: number): InventoryStatus => quantity - reserved <= 0 ? 'OUT_OF_STOCK' : reserved > 0 ? 'RESERVED' : 'AVAILABLE';

export class CatalogService {
  private async audit(storeId: string, actorId: string, eventType: string, metadata: Prisma.InputJsonValue) {
    await prisma.auditEvent.create({ data: { storeId, actorId, actorType: 'USER', eventType, metadata } });
  }
  async listProducts(storeId: string, q: ProductQuery) {
    const where: Prisma.ProductWhereInput = { storeId };
    if (q.search) where.OR = [{ name: { contains: q.search, mode: 'insensitive' } }, { brand: { contains: q.search, mode: 'insensitive' } }, { sku: { contains: q.search, mode: 'insensitive' } }, { description: { contains: q.search, mode: 'insensitive' } }, { productCategory: { name: { contains: q.search, mode: 'insensitive' } } }];
    if (q.category) where.AND = [{ OR: [{ categoryId: q.category }, { productCategory: { slug: q.category } }, { category: { equals: q.category, mode: 'insensitive' } }] }];
    if (q.brand) where.brand = { equals: q.brand, mode: 'insensitive' };
    if (q.minPrice !== undefined || q.maxPrice !== undefined) where.price = { gte: q.minPrice, lte: q.maxPrice };
    if (q.discount) where.compareAtPrice = { not: null };
    if (q.isFeatured !== undefined) where.isFeatured = q.isFeatured;
    if (q.isBestSeller !== undefined) where.isBestSeller = q.isBestSeller;
    if (q.availability) where.inventory = { some: { quantity: { gt: 0 }, status: { not: 'OUT_OF_STOCK' } } };
    const [products, total] = await prisma.$transaction([prisma.product.findMany({ where, include: productInclude, orderBy: { [q.sort]: q.order }, skip: (q.page - 1) * q.limit, take: q.limit }), prisma.product.count({ where })]);
    if (q.search) await prisma.analyticsEvent.create({ data: { storeId, eventType: 'PRODUCT_SEARCHED', metadata: { search: q.search } } });
    return { products, pagination: { page: q.page, limit: q.limit, total, totalPages: Math.ceil(total / q.limit) } };
  }
  async getProduct(storeId: string, id: string) {
    const product = await prisma.product.findFirst({ where: { id, storeId }, include: { ...productInclude, store: { select: { id: true, name: true, slug: true, logoUrl: true } } } });
    if (!product) throw new AppError({ statusCode: 404, code: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
    await prisma.analyticsEvent.create({ data: { storeId, eventType: 'PRODUCT_VIEWED', productId: product.id } });
    return product;
  }
  async createProduct(storeId: string, actorId: string, input: any) {
    if (input.categoryId && !await prisma.productCategory.findFirst({ where: { id: input.categoryId, storeId } })) throw new AppError({ statusCode: 422, code: 'INVALID_CATEGORY', message: 'Category does not belong to this merchant' });
    try {
      const product = await prisma.product.create({ data: { storeId, name: input.name, sku: input.sku, price: input.price, currency: input.currency, description: input.description, brand: input.brand, categoryId: input.categoryId, category: input.category, slug: input.slug, images: input.images ?? [], tags: input.tags ?? [], compareAtPrice: input.compareAtPrice, variants: input.variants?.length ? { create: input.variants } : undefined, inventory: { create: { quantity: input.inventory.quantity, lowStockThreshold: input.inventory.lowStockThreshold ?? 10, status: statusFor(input.inventory.quantity, 0) } } }, include: productInclude });
      await this.audit(storeId, actorId, 'PRODUCT_CREATED', { productId: product.id }); return product;
    } catch (error: any) { if (error.code === 'P2002') throw new AppError({ statusCode: 409, code: 'DUPLICATE_SKU', message: 'SKU already exists for this merchant' }); throw error; }
  }
  async updateProduct(storeId: string, actorId: string, id: string, input: any) {
    await this.getProduct(storeId, id);
    if (input.categoryId && !await prisma.productCategory.findFirst({ where: { id: input.categoryId, storeId } })) throw new AppError({ statusCode: 422, code: 'INVALID_CATEGORY', message: 'Category does not belong to this merchant' });
    const product = await prisma.product.update({ where: { id }, data: input, include: productInclude }); await this.audit(storeId, actorId, 'PRODUCT_UPDATED', { productId: id }); return product;
  }
  async setStatus(storeId: string, actorId: string, id: string, status: ProductStatus) { await this.getProduct(storeId, id); const product = await prisma.product.update({ where: { id }, data: { status, isActive: status === 'ACTIVE' } }); await this.audit(storeId, actorId, status === 'ARCHIVED' ? 'PRODUCT_ARCHIVED' : 'PRODUCT_UPDATED', { productId: id, status }); return product; }
  async listCategories(storeId: string) { return prisma.productCategory.findMany({ where: { storeId }, include: { children: true, _count: { select: { products: true } } }, orderBy: { name: 'asc' } }); }
  async category(storeId: string, id: string) { const value = await prisma.productCategory.findFirst({ where: { id, storeId }, include: { parent: true, children: true, _count: { select: { products: true } } } }); if (!value) throw new AppError({ statusCode: 404, code: 'CATEGORY_NOT_FOUND', message: 'Category not found' }); return value; }
  async createCategory(storeId: string, actorId: string, input: any) { if (input.parentId) await this.category(storeId, input.parentId); const category = await prisma.productCategory.create({ data: { ...input, storeId } }); await this.audit(storeId, actorId, 'CATEGORY_CREATED', { categoryId: category.id }); return category; }
  async updateCategory(storeId: string, actorId: string, id: string, input: any) { await this.category(storeId, id); if (input.parentId) { if (input.parentId === id) throw AppError.badRequest('A category cannot be its own parent'); await this.category(storeId, input.parentId); } const category = await prisma.productCategory.update({ where: { id }, data: input }); await this.audit(storeId, actorId, 'CATEGORY_UPDATED', { categoryId: id }); return category; }
  async variants(storeId: string, productId: string) { await this.getProduct(storeId, productId); return prisma.productVariant.findMany({ where: { productId }, include: { inventory: true } }); }
  async createVariant(storeId: string, actorId: string, productId: string, input: any) { await this.getProduct(storeId, productId); const result = await prisma.productVariant.create({ data: { ...input, productId }, include: { inventory: true } }); await this.audit(storeId, actorId, 'PRODUCT_VARIANT_CREATED', { productId, variantId: result.id }); return result; }
  async updateVariant(storeId: string, actorId: string, productId: string, variantId: string, input: any) { await this.getProduct(storeId, productId); const variant = await prisma.productVariant.findFirst({ where: { id: variantId, productId } }); if (!variant) throw new AppError({ statusCode: 404, code: 'VARIANT_NOT_FOUND', message: 'Product variant not found' }); const result = await prisma.productVariant.update({ where: { id: variantId }, data: input, include: { inventory: true } }); await this.audit(storeId, actorId, 'PRODUCT_VARIANT_UPDATED', { productId, variantId }); return result; }
  async inventory(storeId: string, productId?: string) { const where: Prisma.InventoryWhereInput = { product: { storeId } }; if (productId) where.productId = productId; return prisma.inventory.findMany({ where, include: { product: { select: { id: true, name: true, sku: true } }, variant: true } }); }
  async updateInventory(storeId: string, actorId: string, productId: string, input: any) { await this.getProduct(storeId, productId); const existing = await prisma.inventory.findFirst({ where: { productId } }); if (!existing) { const value = await prisma.inventory.create({ data: { productId, quantity: input.quantity, lowStockThreshold: input.lowStockThreshold ?? 10, status: statusFor(input.quantity, 0) } }); await this.audit(storeId, actorId, 'INVENTORY_UPDATED', { productId }); return value; } const quantity = input.quantity ?? existing.quantity; const reservedQuantity = input.reservedQuantity ?? existing.reservedQuantity; if (reservedQuantity > quantity) throw AppError.badRequest('Reserved quantity cannot exceed quantity'); const value = await prisma.inventory.update({ where: { id: existing.id }, data: { quantity: input.quantity, lowStockThreshold: input.lowStockThreshold, status: input.availability ?? statusFor(quantity, reservedQuantity) } }); await this.audit(storeId, actorId, 'INVENTORY_UPDATED', { productId }); return value; }
  async listCustomers(storeId: string, q: { search?: string; page: number; limit: number }) { const where: Prisma.CustomerWhereInput = { storeId }; if (q.search) where.OR = ['name','email','phone','externalId'].map(field => ({ [field]: { contains: q.search, mode: 'insensitive' } })); const [customers,total] = await prisma.$transaction([prisma.customer.findMany({ where, select: { id:true,name:true,firstName:true,lastName:true,email:true,phone:true,tags:true,totalSpent:true,orderCount:true,lastOrderAt:true,createdAt:true,updatedAt:true }, skip:(q.page-1)*q.limit,take:q.limit,orderBy:{createdAt:'desc'} }), prisma.customer.count({where})]); return { customers, pagination:{page:q.page,limit:q.limit,total,totalPages:Math.ceil(total/q.limit)} }; }
  async customer(storeId: string, id: string) { const value = await prisma.customer.findFirst({ where:{id,storeId}, include:{orders:{take:20,orderBy:{createdAt:'desc'},select:{id:true,orderNumber:true,total:true,status:true,createdAt:true}}} }); if(!value) throw new AppError({statusCode:404,code:'CUSTOMER_NOT_FOUND',message:'Customer not found'}); return value; }
  async updateCustomer(storeId: string, actorId: string, id: string, input: any) { await this.customer(storeId,id); const value=await prisma.customer.update({where:{id},data:input}); await this.audit(storeId,actorId,'CUSTOMER_UPDATED',{customerId:id}); return value; }
}
export const catalogService = new CatalogService();
