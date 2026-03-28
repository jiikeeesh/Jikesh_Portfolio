import { getStore } from "@netlify/blobs";
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
 * Robust check for Netlify environment.
 * process.env.NETLIFY is usually "true" on Netlify.
 */
export function isNetlify(): boolean {
  return process.env.NETLIFY === "true" || !!process.env.SITE_ID;
}

/**
 * Sanitize keys for Netlify Blobs to ensure compatibility.
 * Replaces characters like ":" with "-" which can be problematic in some storage contexts.
 */
function sanitizeKey(key: string): string {
  return key.replace(/:/g, "-").replace(/\./g, "_");
}

export async function getMessages(): Promise<Message[]> {
  try {
    if (isNetlify()) {
      const store = getStore("messages");
      const { blobs } = await store.list();
      const messages = await Promise.all(
        blobs.map(async (blob) => {
          try {
            return await store.get(blob.key, { type: "json" }) as Message;
          } catch (e) {
            console.error(`Error fetching blob ${blob.key}:`, e);
            return null;
          }
        })
      );
      return messages
        .filter((m): m is Message => m !== null)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      // Local development fallback
      try {
        const file = await fs.readFile(DATA_PATH, "utf-8");
        const messages: Message[] = JSON.parse(file);
        return messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } catch (e) {
        return [];
      }
    }
  } catch (e) {
    console.error("Error reading messages:", e);
    return [];
  }
}

export async function saveMessage(entry: Message): Promise<void> {
  if (isNetlify()) {
    try {
      const store = getStore("messages");
      const key = sanitizeKey(entry.timestamp);
      await store.setJSON(key, entry);
    } catch (e) {
      console.error("Netlify Blobs save error:", e);
      throw e; // Re-throw to be caught by the API route
    }
  } else {
    // Local development fallback
    let messages: Message[] = [];
    try {
      const file = await fs.readFile(DATA_PATH, "utf-8");
      messages = JSON.parse(file);
    } catch (e) {
      messages = [];
    }
    messages.push(entry);
    
    // Ensure data directory exists
    const dir = path.dirname(DATA_PATH);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
    
    await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));
  }
}

export async function deleteMessage(timestamp: string): Promise<void> {
  if (isNetlify()) {
    const store = getStore("messages");
    const key = sanitizeKey(timestamp);
    await store.delete(key);
  } else {
    // Local development fallback
    try {
      const file = await fs.readFile(DATA_PATH, "utf-8");
      let messages: Message[] = JSON.parse(file);
      messages = messages.filter(m => m.timestamp !== timestamp);
      await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));
    } catch (e) {
      console.error("Local delete error:", e);
      throw e;
    }
  }
}
