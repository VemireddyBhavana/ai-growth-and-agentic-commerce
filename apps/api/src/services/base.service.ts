import { logger } from '../utils/logger.js';

/**
 * Base Service Layer Foundation
 * Implements common service abstractions and logging.
 */
export abstract class BaseService {
  protected readonly logger = logger;
}
