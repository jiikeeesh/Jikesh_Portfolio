import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "messages.json");

function checkSecret(url: string) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  const provided = new URL(url).searchParams.get("secret");
  return provided === secret;
}

export async function POST(request: Request) {
  if (!checkSecret(request.url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

    // read existing
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const messages: any[] = JSON.parse(file);
    messages.push(entry);
    await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));

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
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const messages = JSON.parse(file);
    return NextResponse.json(messages);
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
    const file = await fs.readFile(DATA_PATH, "utf-8");
    let messages: any[] = JSON.parse(file);
    messages = messages.filter(m => m.timestamp !== timestamp);
    await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting message", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
