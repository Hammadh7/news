import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get("admin-token")?.value;
  return !!token && token.length > 0;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();
    const fileName = `images/${safeName}-${timestamp}.${ext}`;

    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
