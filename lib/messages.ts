import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";

export interface Message {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

const DATA_PATH = path.join(process.cwd(), "data", "messages.json");

/**
 * Get the database connection URL, checking both common env var names.
 */
function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

/**
 * Check if we should use Postgres.
 * If DATABASE_URL or POSTGRES_URL is set, we use Neon Postgres.
 */
function usePostgres(): boolean {
  return !!getDatabaseUrl();
}

function getSQL() {
  return neon(getDatabaseUrl()!);
}

/**
 * Ensure the messages table exists in the database.
 */
async function ensureTable() {
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
}

// ─── Neon Postgres helpers ──────────────────────────────────────────────────

async function getMessagesPostgres(): Promise<Message[]> {
  try {
    await ensureTable();
    const sql = getSQL();
    const rows = await sql`
      SELECT name, email, message, timestamp
      FROM messages
      ORDER BY timestamp DESC
    `;
    return rows as Message[];
  } catch (e) {
    console.error("Postgres getMessages error:", e);
    return [];
  }
}

async function saveMessagePostgres(entry: Message): Promise<void> {
  await ensureTable();
  const sql = getSQL();
  await sql`
    INSERT INTO messages (name, email, message, timestamp)
    VALUES (${entry.name}, ${entry.email}, ${entry.message}, ${entry.timestamp})
  `;
}

async function deleteMessagePostgres(timestamp: string): Promise<void> {
  await ensureTable();
  const sql = getSQL();
  await sql`
    DELETE FROM messages WHERE timestamp = ${timestamp}
  `;
}

// ─── Local filesystem helpers ───────────────────────────────────────────────

async function getMessagesLocal(): Promise<Message[]> {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const messages: Message[] = JSON.parse(file);
    return messages.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch {
    return [];
  }
}

async function saveMessageLocal(entry: Message): Promise<void> {
  let messages: Message[] = [];
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    messages = JSON.parse(file);
  } catch {
    messages = [];
  }
  messages.push(entry);

  const dir = path.dirname(DATA_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));
}

async function deleteMessageLocal(timestamp: string): Promise<void> {
  const file = await fs.readFile(DATA_PATH, "utf-8");
  let messages: Message[] = JSON.parse(file);
  messages = messages.filter((m) => m.timestamp !== timestamp);
  await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getMessages(): Promise<Message[]> {
  return usePostgres() ? getMessagesPostgres() : getMessagesLocal();
}

export async function saveMessage(entry: Message): Promise<void> {
  return usePostgres() ? saveMessagePostgres(entry) : saveMessageLocal(entry);
}

export async function deleteMessage(timestamp: string): Promise<void> {
  return usePostgres() ? deleteMessagePostgres(timestamp) : deleteMessageLocal(timestamp);
}
