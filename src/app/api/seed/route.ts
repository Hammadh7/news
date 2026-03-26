import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  // Simple protection - use admin password
  if (key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articlesDir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(articlesDir)) {
    return NextResponse.json({ error: "No content/articles directory found" }, { status: 404 });
  }

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));
  const results: string[] = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const content = fs.readFileSync(path.join(articlesDir, file), "utf8");
    const { data, content: body } = matter(content);

    const article = {
      slug,
      title: data.title || "",
      subtitle: data.subtitle || "",
      author: data.author || "Staff Reporter",
      date: data.date || new Date().toISOString(),
      section: data.section || "india",
      tags: data.tags || [],
      image: data.image || "",
      imageCaption: data.imageCaption || "",
      featured: data.featured || false,
      breaking: data.breaking || false,
      content: body,
      excerpt: data.excerpt || body.replace(/[#*_\[\]]/g, "").substring(0, 200) + "...",
    };

    await put(`articles/${slug}.json`, JSON.stringify(article), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    results.push(slug);
  }

  return NextResponse.json({
    success: true,
    message: `Seeded ${results.length} articles`,
    articles: results,
  });
}
