import { list } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log("Creating tables...");

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

  await sql`CREATE INDEX IF NOT EXISTS idx_articles_section ON articles (section)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_date ON articles (date DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles (featured) WHERE featured = TRUE`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_breaking ON articles (breaking) WHERE breaking = TRUE`;

  await sql`
    CREATE TABLE IF NOT EXISTS images (
      id           TEXT PRIMARY KEY,
      data         BYTEA NOT NULL,
      content_type TEXT NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log("Tables created.");

  // Migrate articles
  console.log("\nMigrating articles...");
  const { blobs: articleBlobs } = await list({ prefix: "articles/" });
  console.log(`Found ${articleBlobs.length} articles in Blob storage`);

  // Collect image URLs that need remapping
  const imageUrlMap = new Map<string, string>();

  for (const blob of articleBlobs) {
    try {
      const res = await fetch(blob.url);
      const article = await res.json();

      // Track old image URL for remapping later
      if (article.image && article.image.startsWith("http")) {
        // We'll remap after images are migrated
        const oldUrl = article.image;
        // Extract image filename from blob URL
        const urlParts = oldUrl.split("/");
        const imageName = urlParts[urlParts.length - 1];
        imageUrlMap.set(article.slug, imageName);
      }

      await sql`
        INSERT INTO articles (slug, title, subtitle, author, date, section, tags,
                              image, image_caption, featured, breaking, content, excerpt)
        VALUES (${article.slug}, ${article.title}, ${article.subtitle || ""},
                ${article.author}, ${article.date}, ${article.section},
                ${article.tags || []}, ${article.image || ""},
                ${article.imageCaption || ""}, ${article.featured || false},
                ${article.breaking || false}, ${article.content}, ${article.excerpt || ""})
        ON CONFLICT (slug) DO NOTHING
      `;
      console.log(`  Article: ${article.slug}`);
    } catch (err) {
      console.error(`  Failed: ${blob.pathname}`, err);
    }
  }

  // Migrate images
  console.log("\nMigrating images...");
  const { blobs: imageBlobs } = await list({ prefix: "images/" });
  console.log(`Found ${imageBlobs.length} images in Blob storage`);

  const migratedImages = new Map<string, string>(); // old filename -> new API path

  for (const blob of imageBlobs) {
    try {
      const res = await fetch(blob.url);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const hexData = "\\x" + buffer.toString("hex");

      // Extract filename from pathname (e.g. "images/photo-123.jpg" -> "photo-123.jpg")
      const id = blob.pathname.replace("images/", "");
      const contentType =
        blob.pathname.endsWith(".png") ? "image/png" :
        blob.pathname.endsWith(".webp") ? "image/webp" :
        blob.pathname.endsWith(".gif") ? "image/gif" :
        "image/jpeg";

      await sql`
        INSERT INTO images (id, data, content_type)
        VALUES (${id}, ${hexData}::bytea, ${contentType})
        ON CONFLICT (id) DO NOTHING
      `;

      migratedImages.set(id, `/api/images/${id}`);
      console.log(`  Image: ${id} (${(buffer.length / 1024).toFixed(1)}KB)`);
    } catch (err) {
      console.error(`  Failed: ${blob.pathname}`, err);
    }
  }

  // Update article image URLs from blob URLs to /api/images/<id>
  console.log("\nUpdating article image URLs...");
  for (const [slug, imageName] of imageUrlMap.entries()) {
    const newPath = migratedImages.get(imageName);
    if (newPath) {
      await sql`UPDATE articles SET image = ${newPath} WHERE slug = ${slug}`;
      console.log(`  ${slug}: -> ${newPath}`);
    }
  }

  console.log("\nMigration complete!");
  console.log(`  Articles: ${articleBlobs.length}`);
  console.log(`  Images: ${imageBlobs.length}`);
}

migrate().catch(console.error);
