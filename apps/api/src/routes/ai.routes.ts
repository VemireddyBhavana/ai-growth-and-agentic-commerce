import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import { resolveMerchant } from '../middleware/merchant.middleware.js';
import { aiRateLimiter } from '../middleware/ai-rate-limit.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { aiService } from '../services/ai/ai.service.js';
import { BaseController } from '../controllers/base.controller.js';

const router: Router = Router();
const controller = new (class extends BaseController {})();
const chatSchema = z.object({ conversationId: z.string().cuid().optional(), message: z.string().trim().min(1).max(4000) });

router.post('/chat', authenticate, requireRoles('MERCHANT', 'ADMIN'), resolveMerchant, aiRateLimiter, validateRequest({ body: chatSchema }), async (req, res, next) => {
  try { controller['sendSuccess'](res, await aiService.chat(req.merchantId!, req.user!.userId, req.body.message, req.body.conversationId)); }
  catch (error) { next(error); }
});

export const aiRoutes = router;
