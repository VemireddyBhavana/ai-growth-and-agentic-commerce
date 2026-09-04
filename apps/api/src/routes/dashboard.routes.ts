import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';

const router: Router = Router();

/**
 * Dashboard Routes
 * /api/v1/dashboard
 */

// Get complete dashboard snapshot
router.get('/', dashboardController.getDashboardSnapshot.bind(dashboardController));

// Get individual dashboard components
router.get('/kpi', dashboardController.getKpiMetrics.bind(dashboardController));
router.get('/revenue', dashboardController.getRevenueData.bind(dashboardController));
router.get('/orders', dashboardController.getRecentOrders.bind(dashboardController));
router.get('/ai-metrics', dashboardController.getAiMetrics.bind(dashboardController));

export { router as dashboardRoutes };