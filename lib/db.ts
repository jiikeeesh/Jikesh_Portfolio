import { neon } from "@neondatabase/serverless";

/**
 * Get the database connection URL, checking both common env var names.
 */
function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

/**
 * Check if we should use Postgres (true on Vercel where DATABASE_URL is set).
 */
export function usePostgres(): boolean {
  return !!getDatabaseUrl();
}

/**
 * Get a Neon SQL tagged-template function.
 */
export function getSQL() {
  const url = getDatabaseUrl();
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

/**
 * Initialize all required database tables.
 * Safe to call multiple times (uses IF NOT EXISTS).
 */
export async function ensureTables() {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tech TEXT[] DEFAULT '{}',
      link TEXT DEFAULT '#',
      github TEXT DEFAULT '#'
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price NUMERIC DEFAULT 0,
      image TEXT DEFAULT ''
    )
  `;
}
