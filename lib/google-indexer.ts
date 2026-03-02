import { google } from "googleapis";

export async function indexUrls(urls: string[]): Promise<void> {
  const keyJson = process.env.GOOGLE_INDEXER_KEY;
  if (!keyJson) {
    throw new Error("GOOGLE_INDEXER_KEY environment variable is not set");
  }

  let credentials: object;
  try {
    credentials = JSON.parse(keyJson);
  } catch {
    throw new Error("GOOGLE_INDEXER_KEY contains invalid JSON");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const indexing = google.indexing({ version: "v3", auth });

  await Promise.all(
    urls.map((url) =>
      indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: "URL_UPDATED",
        },
      })
    )
  );
}
