import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "messages.json");

// Helper to check if we are on Netlify or have Netlify Blobs configured
function isNetlify() {
  return !!process.env.NETLIFY || (!!process.env.SITE_ID && !!process.env.NETLIFY_AUTH_TOKEN);
}

// Helper to get the messages store and all messages
async function getMessages() {
  try {
    if (isNetlify()) {
      const store = getStore("messages");
      const { blobs } = await store.list();
      const messages = await Promise.all(
        blobs.map(async (blob) => {
          const data = await store.get(blob.key, { type: "json" });
          return data;
        })
      );
      return messages
        .filter(Boolean)
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      // Local development fallback to filesystem
      try {
        const file = await fs.readFile(DATA_PATH, "utf-8");
        const messages: any[] = JSON.parse(file);
        return messages.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } catch (e) {
        return [];
      }
    }
  } catch (e) {
    console.error("Error reading messages:", e);
    return [];
  }
}

// POST: Public endpoint — no authentication required so visitors can submit the form
export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const entry = {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    if (isNetlify()) {
      const store = getStore("messages");
      await store.setJSON(entry.timestamp, entry);
    } else {
      // Local development fallback to filesystem
      let messages: any[] = [];
      try {
        const file = await fs.readFile(DATA_PATH, "utf-8");
        messages = JSON.parse(file);
      } catch (e) {
        messages = [];
      }
      messages.push(entry);
      await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error saving message:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET: Admin-only endpoint protected by the admin session cookie
export async function GET(request: Request) {
  // Protect this endpoint — only accessible to logged-in admins
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("admin_token=authenticated")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await getMessages();
  return NextResponse.json(messages);
}

// DELETE: Admin-only endpoint to delete a specific message by timestamp
export async function DELETE(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  if (!cookie.includes("admin_token=authenticated")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { timestamp } = await request.json();
    if (!timestamp) {
      return NextResponse.json({ error: "Timestamp required" }, { status: 400 });
    }

    if (isNetlify()) {
      const store = getStore("messages");
      await store.delete(timestamp);
    } else {
      // Local development fallback
      try {
        const file = await fs.readFile(DATA_PATH, "utf-8");
        let messages: any[] = JSON.parse(file);
        messages = messages.filter(m => m.timestamp !== timestamp);
        await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));
      } catch (e) {
        console.error("Local delete error", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting message:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
