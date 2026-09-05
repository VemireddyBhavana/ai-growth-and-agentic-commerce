-- Fix: sessions.customer_id previously had TWO foreign key constraints
-- (one to "customers", one to "users" via the stray Session.user relation).
-- A column cannot legally satisfy both at once for real customer sessions,
-- so every insert with a non-null customer_id was failing with:
--   insert or update on table "sessions" violates foreign key constraint "session_user_fkey"
--
-- This migration drops the incorrect "users" foreign key and keeps the
-- correct "customers" foreign key.

ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "session_user_fkey";
