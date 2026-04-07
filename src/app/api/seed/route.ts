import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();

  // Ensure tables exist
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      slug        TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      subtitle    TEXT NOT NULL DEFAULT '',
      author      TEXT NOT NULL DEFAULT 'Staff Reporter',
      date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      section     TEXT NOT NULL,
      tags        TEXT[] NOT NULL DEFAULT '{}',
      image       TEXT NOT NULL DEFAULT '',
      image_caption TEXT NOT NULL DEFAULT '',
      featured    BOOLEAN NOT NULL DEFAULT FALSE,
      breaking    BOOLEAN NOT NULL DEFAULT FALSE,
      content     TEXT NOT NULL DEFAULT '',
      excerpt     TEXT NOT NULL DEFAULT ''
    )
  `;

  const articlesDir = path.join(process.cwd(), "content/articles");
  if (!fs.existsSync(articlesDir)) {
    return NextResponse.json(
      { error: "No content/articles directory found" },
      { status: 404 }
    );
  }

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));
  const results: string[] = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const content = fs.readFileSync(path.join(articlesDir, file), "utf8");
    const { data, content: body } = matter(content);

    const excerpt =
      data.excerpt ||
      body.replace(/[#*_\[\]]/g, "").substring(0, 200) + "...";

    await sql`
      INSERT INTO articles (slug, title, subtitle, author, date, section, tags,
                            image, image_caption, featured, breaking, content, excerpt)
      VALUES (${slug}, ${data.title || ""}, ${data.subtitle || ""},
              ${data.author || "Staff Reporter"}, ${data.date || new Date().toISOString()},
              ${data.section || "india"}, ${data.tags || []},
              ${data.image || ""}, ${data.imageCaption || ""},
              ${data.featured || false}, ${data.breaking || false},
              ${body}, ${excerpt})
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        author = EXCLUDED.author,
        section = EXCLUDED.section,
        tags = EXCLUDED.tags,
        image = EXCLUDED.image,
        image_caption = EXCLUDED.image_caption,
        featured = EXCLUDED.featured,
        breaking = EXCLUDED.breaking,
        content = EXCLUDED.content,
        excerpt = EXCLUDED.excerpt
    `;
    results.push(slug);
  }

  return NextResponse.json({
    success: true,
    message: `Seeded ${results.length} articles`,
    articles: results,
  });
}
