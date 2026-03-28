import { NextResponse } from "next/server";
import { getMessages, saveMessage, deleteMessage } from "../../../lib/messages";

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

    await saveMessage(entry);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Error saving message:", e);
    return NextResponse.json({ error: "Internal error", details: e.message }, { status: 500 });
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

    await deleteMessage(timestamp);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Error deleting message:", e);
    return NextResponse.json({ error: "Internal error", details: e.message }, { status: 500 });
  }
}
