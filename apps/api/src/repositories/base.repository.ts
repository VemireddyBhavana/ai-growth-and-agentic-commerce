import type { PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma.config.js';

/**
 * Base Repository Layer Foundation
 * Provides standard abstraction over Prisma ORM persistence.
 */
export abstract class BaseRepository {
  protected readonly db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  public async pingDatabase(): Promise<boolean> {
    try {
      await this.db.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
