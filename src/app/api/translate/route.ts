import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Google Translate free endpoint
async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "auto"
): Promise<string> {
  // Split into chunks of ~4000 chars to stay within limits
  const chunks: string[] = [];
  const maxLen = 4000;
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }
    // Find a good break point (newline or period)
    let breakPoint = remaining.lastIndexOf("\n", maxLen);
    if (breakPoint < maxLen / 2) breakPoint = remaining.lastIndexOf(". ", maxLen);
    if (breakPoint < maxLen / 2) breakPoint = maxLen;
    chunks.push(remaining.substring(0, breakPoint + 1));
    remaining = remaining.substring(breakPoint + 1);
  }

  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) {
      throw new Error(`Translation failed: ${res.status}`);
    }

    const data = await res.json();
    // Response format: [[["translated text","original text",null,null,null],...]]
    const translated = data[0]
      ?.map((segment: [string]) => segment[0])
      .join("") || chunk;
    translatedChunks.push(translated);
  }

  return translatedChunks.join("");
}

export async function POST(request: NextRequest) {
  try {
    const { text, title, subtitle, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing text or targetLang" },
        { status: 400 }
      );
    }

    if (targetLang === "en") {
      return NextResponse.json({ title, subtitle, text });
    }

    // Language code mapping for Google Translate
    const langMap: Record<string, string> = {
      hi: "hi",
      ta: "ta",
      te: "te",
      bn: "bn",
      mr: "mr",
      gu: "gu",
      kn: "kn",
      ml: "ml",
      pa: "pa",
      or: "or",
      ur: "ur",
    };

    const gtLang = langMap[targetLang];
    if (!gtLang) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    const [translatedText, translatedTitle, translatedSubtitle] =
      await Promise.all([
        translateText(text, gtLang),
        title ? translateText(title, gtLang) : Promise.resolve(""),
        subtitle ? translateText(subtitle, gtLang) : Promise.resolve(""),
      ]);

    return NextResponse.json({
      title: translatedTitle,
      subtitle: translatedSubtitle,
      text: translatedText,
    });
  } catch (err) {
    console.error("Translation error:", err);
    return NextResponse.json(
      { error: "Translation failed. Please try again." },
      { status: 500 }
    );
  }
}
