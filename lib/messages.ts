import { put, list, del, head } from "@vercel/blob";
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
 * Check if we're running on Vercel (production/preview).
 * VERCEL env var is automatically set to "1" on Vercel deployments.
 */
function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

/**
 * Build a unique blob pathname for a message based on its timestamp.
 */
function messageBlobPath(timestamp: string): string {
  const sanitized = timestamp.replace(/:/g, "-").replace(/\./g, "_");
  return `messages/${sanitized}.json`;
}

// ─── Vercel Blob helpers ────────────────────────────────────────────────────

async function getMessagesVercel(): Promise<Message[]> {
  try {
    const { blobs } = await list({ prefix: "messages/" });
    const messages = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await fetch(blob.url);
          return (await res.json()) as Message;
        } catch (e) {
          console.error(`Error fetching blob ${blob.pathname}:`, e);
          return null;
        }
      })
    );
    return messages
      .filter((m): m is Message => m !== null)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  } catch (e) {
    console.error("Vercel Blob list error:", e);
    return [];
  }
}

async function saveMessageVercel(entry: Message): Promise<void> {
  const blobPath = messageBlobPath(entry.timestamp);
  await put(blobPath, JSON.stringify(entry), {
    contentType: "application/json",
    access: "public",
    addRandomSuffix: false,
  });
}

async function deleteMessageVercel(timestamp: string): Promise<void> {
  // We need to find the blob URL to delete it
  const { blobs } = await list({ prefix: "messages/" });
  const target = blobs.find((b) =>
    b.pathname === messageBlobPath(timestamp)
  );
  if (target) {
    await del(target.url);
  }
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
  return isVercel() ? getMessagesVercel() : getMessagesLocal();
}

export async function saveMessage(entry: Message): Promise<void> {
  return isVercel() ? saveMessageVercel(entry) : saveMessageLocal(entry);
}

export async function deleteMessage(timestamp: string): Promise<void> {
  return isVercel() ? deleteMessageVercel(timestamp) : deleteMessageLocal(timestamp);
}
