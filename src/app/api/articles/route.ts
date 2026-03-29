import { NextRequest, NextResponse } from "next/server";
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesBySection,
  saveArticle,
  deleteArticle,
  generateSlug,
} from "@/lib/articles";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get("admin-token")?.value;
  return !!token && token.length > 0;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");
  const slug = searchParams.get("slug");

  if (slug) {
    const article = await getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  }

  const articles = section
    ? await getArticlesBySection(section)
    : await getAllArticles();
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const slug = data.slug || generateSlug(data.title, data.section);

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
      content: data.content || "",
      excerpt:
        data.excerpt ||
        (data.content || "").replace(/[#*_\[\]]/g, "").substring(0, 200) + "...",
    };

    await saveArticle(article);
    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error("Failed to save article:", err);
    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const existing = await getArticleBySlug(data.slug);
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const article = {
      ...existing,
      ...data,
      excerpt:
        data.excerpt ||
        (data.content || existing.content).replace(/[#*_\[\]]/g, "").substring(0, 200) + "...",
    };

    await saveArticle(article);
    return NextResponse.json({ success: true, slug: data.slug });
  } catch (err) {
    console.error("Failed to update article:", err);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const deleted = await deleteArticle(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
