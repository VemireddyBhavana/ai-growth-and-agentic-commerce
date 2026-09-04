import { createApp } from './app.js';
import { env } from './config/env.config.js';
import { logger } from './utils/logger.js';
import { prisma } from './config/prisma.config.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(
    `🚀 AI Sales Assistant API Server running in [${env.NODE_ENV}] mode on http://localhost:${env.PORT}`
  );
  logger.info(`🔍 Healthcheck available at http://localhost:${env.PORT}/health`);
  logger.info(`🔗 API v1 prefix mounted at http://localhost:${env.PORT}/api/v1`);
});

// Graceful Shutdown Handlers
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma database client disconnected.');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during graceful shutdown');
      process.exit(1);
    }
  });

  // Force close after 10s if connections linger
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled Promise Rejection detected');
});

process.on('uncaughtException', (error: Error) => {
  logger.fatal({ error }, 'Uncaught Exception detected');
  process.exit(1);
});
