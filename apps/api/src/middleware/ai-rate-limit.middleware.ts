import rateLimit from 'express-rate-limit'; import { AppError } from '../utils/app-error.js';
export const aiRateLimiter=rateLimit({windowMs:60_000,max:10,standardHeaders:true,legacyHeaders:false,handler:(_req,_res,next)=>next(new AppError({statusCode:429,code:'AI_RATE_LIMIT_EXCEEDED',message:'Too many AI requests. Please wait a moment and try again.'}))});
