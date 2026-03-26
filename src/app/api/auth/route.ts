import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === siteConfig.adminPassword) {
      const token = crypto.randomBytes(32).toString("hex");

      const response = NextResponse.json({ success: true, token });
      response.cookies.set("admin-token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
