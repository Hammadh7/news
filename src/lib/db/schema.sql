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
);

CREATE INDEX IF NOT EXISTS idx_articles_section ON articles (section);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles (date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles (featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_breaking ON articles (breaking) WHERE breaking = TRUE;

CREATE TABLE IF NOT EXISTS images (
  id           TEXT PRIMARY KEY,
  data         BYTEA NOT NULL,
  content_type TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
