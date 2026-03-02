import { schedule } from "@netlify/functions";

const handler = schedule("0 4 * * *", async () => {
  const baseUrl = process.env.URL ?? "http://localhost:3000";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET is not set");
    return { statusCode: 500 };
  }

  const response = await fetch(`${baseUrl}/api/seo/index-now`, {
    method: "POST",
    headers: {
      "x-cron-secret": cronSecret,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Indexing endpoint returned ${response.status}: ${body}`);
    return { statusCode: response.status };
  }

  const data = (await response.json()) as unknown;
  console.log(`Daily indexing complete:`, data);
  return { statusCode: 200 };
});

export { handler };
