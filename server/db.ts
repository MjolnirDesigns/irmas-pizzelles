import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

/**
 * Postgres is optional at boot so the front end and design variants can run
 * on a laptop without a provisioned database. When DATABASE_URL is absent,
 * server/storage.ts uses an in-memory store seeded with the legacy catalog.
 * Replit still sets DATABASE_URL, so production behavior is unchanged.
 */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

export const pool = isDatabaseConfigured
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool ? drizzle(pool, { schema }) : null;

if (!isDatabaseConfigured) {
  console.warn(
    "[db] DATABASE_URL is not set. Using in-memory storage. Orders will not survive a restart.",
  );
}
