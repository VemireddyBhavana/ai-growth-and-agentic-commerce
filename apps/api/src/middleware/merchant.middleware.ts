import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma.config.js';
import { AppError } from '../utils/app-error.js';

// Express request augmentation requires its ambient namespace.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request { merchantId?: string; }
  }
}

/** Resolves the store exclusively from the signed-in identity, never request input. */
export async function resolveMerchant(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) return next(AppError.unauthorized());
    if (req.user.role !== 'MERCHANT' && req.user.role !== 'ADMIN') {
      return next(AppError.forbidden('Merchant access is required'));
    }
    const store = req.user.merchantId
      ? await prisma.store.findFirst({ where: { id: req.user.merchantId, ownerId: req.user.userId, isActive: true }, select: { id: true } })
      : await prisma.store.findFirst({ where: { ownerId: req.user.userId, isActive: true }, select: { id: true } });
    if (!store) return next(AppError.forbidden('No active merchant store is associated with this account'));
    req.merchantId = store.id;
    next();
  } catch (error) { next(error); }
}
