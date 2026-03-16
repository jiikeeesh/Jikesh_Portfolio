import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

// Helper to get the messages store and all messages
async function getMessages() {
  try {
    const store = getStore("messages");
    const { blobs } = await store.list();
    const messages = await Promise.all(
      blobs.map(async (blob) => {
        const data = await store.get(blob.key, { type: "json" });
        return data;
      })
    );
    // Sort by timestamp descending (newest first)
    return messages
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (e) {
    console.error("Error reading messages from Blobs:", e);
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

    const store = getStore("messages");
    // Use the timestamp as a unique key
    await store.setJSON(entry.timestamp, entry);

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

    const store = getStore("messages");
    await store.delete(timestamp);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting message:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
