-- Phase 7.3: non-destructive product lifecycle addition.
ALTER TYPE "ProductStatus" ADD VALUE IF NOT EXISTS 'INACTIVE';
