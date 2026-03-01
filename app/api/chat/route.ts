import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
  });

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system:
      "You are FortNexus Oracle, an expert Fortnite AI assistant. You help players with strategies, skin recommendations, weapon loadouts, and game tips. Keep answers concise, hype, and use Fortnite lingo. Use emojis. Never break character.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
