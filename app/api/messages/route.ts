import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "contact-messages";
const MESSAGES_KEY = "all-messages";

function checkSecret(url: string) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const provided = new URL(url).searchParams.get("secret");
  return provided === secret;
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing field" }, { status: 400 });
    }

    const entry = {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    const store = getStore({ name: STORE_NAME, consistency: "strong" });

    // Read existing messages
    const existing = await store.get(MESSAGES_KEY, { type: "json" });
    const messages: any[] = Array.isArray(existing) ? existing : [];
    messages.push(entry);

    // Write updated messages
    await store.setJSON(MESSAGES_KEY, messages);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error writing message", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!checkSecret(request.url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });
    const messages = await store.get(MESSAGES_KEY, { type: "json" });
    return NextResponse.json(Array.isArray(messages) ? messages : []);
  } catch (e) {
    console.error("Error reading messages", e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function DELETE(request: Request) {
  if (!checkSecret(request.url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { timestamp } = await request.json();
    const store = getStore({ name: STORE_NAME, consistency: "strong" });

    const existing = await store.get(MESSAGES_KEY, { type: "json" });
    let messages: any[] = Array.isArray(existing) ? existing : [];
    messages = messages.filter((m) => m.timestamp !== timestamp);

    await store.setJSON(MESSAGES_KEY, messages);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting message", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
