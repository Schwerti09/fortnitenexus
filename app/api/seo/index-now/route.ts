import { NextRequest, NextResponse } from "next/server";
import { indexUrls } from "@/lib/google-indexer";
import { getNextBatch, getDailyOffset, TOTAL_URLS } from "@/lib/url-list";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urls = getNextBatch();
  const offset = getDailyOffset();

  try {
    await indexUrls(urls);
    return NextResponse.json({
      success: true,
      indexed: urls.length,
      offset,
      nextOffset: (offset + urls.length) % TOTAL_URLS,
    });
  } catch (error) {
    console.error("Google Indexing error:", error);
    return NextResponse.json({ error: "Indexing failed" }, { status: 500 });
  }
}
