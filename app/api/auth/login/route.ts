import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set the token cookie
      const cookieStore = await cookies();
      cookieStore.set("admin_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
