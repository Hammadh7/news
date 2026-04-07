import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDb();

    const rows = await sql`SELECT data, content_type FROM images WHERE id = ${id}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const { data, content_type } = rows[0];

    // neon returns BYTEA as a hex string prefixed with \x
    const hexStr = (data as string).slice(2); // remove \x prefix
    const buffer = Buffer.from(hexStr, "hex");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": content_type as string,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Image fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
