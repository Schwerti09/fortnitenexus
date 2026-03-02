import { NextRequest, NextResponse } from "next/server";
import { KNOWN_CVES } from "@/lib/cve-pseo";
import { indexUrls } from "@/lib/google-indexer";

const BASE_URL = "https://clawguru.org";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cveUrls = KNOWN_CVES.map(
    (cveId) => `${BASE_URL}/solutions/fix-${cveId.toLowerCase()}`
  );

  const urls = cveUrls.slice(0, 200);

  try {
    await indexUrls(urls);
    return NextResponse.json({ success: true, indexed: urls.length });
  } catch (error) {
    console.error("Google Indexing error:", error);
    return NextResponse.json({ error: "Indexing failed" }, { status: 500 });
  }
}
