import { Router } from 'express';
import { healthRoutes } from './health.routes.js';
import { dashboardRoutes } from './dashboard.routes.js';
import { productsRoutes } from './products.routes.js';
import { customersRoutes } from './customers.routes.js';
import { categoriesRoutes } from './categories.routes.js';
import { inventoryRoutes } from './inventory.routes.js';
import { cartRoutes } from './cart.routes.js';
import { ordersRoutes } from './orders.routes.js';
import { paymentsRoutes } from './payments.routes.js';
import { aiRoutes } from './ai.routes.js';
import { auditRoutes } from './audit.routes.js';
import { analyticsRoutes } from './analytics.routes.js';
import { growthRoutes } from './growth.routes.js';

const apiRouter: Router = Router();

// Standard Health and Diagnostic Endpoints
apiRouter.use('/health', healthRoutes);

// Dashboard Analytics Endpoints
apiRouter.use('/dashboard', dashboardRoutes);

// Foundational API Namespaces (Phase 7.1)
apiRouter.use('/products', productsRoutes);
apiRouter.use('/customers', customersRoutes);
apiRouter.use('/categories', categoriesRoutes);
apiRouter.use('/inventory', inventoryRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/orders', ordersRoutes);
apiRouter.use('/payments', paymentsRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/audit', auditRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/growth', growthRoutes);

export { apiRouter };
