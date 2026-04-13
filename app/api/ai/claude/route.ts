import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  mode: z.enum(["thread", "comment"]).default("thread"),
  input: z.string().trim().min(12).max(4000),
  context: z.string().trim().max(4000).optional(),
});

const systemPrompt =
  "You are assisting an industrial society. Write practical, concise, respectful drafts with clear structure. Avoid hype and avoid inventing facts.";

function isTextBlock(
  block: Anthropic.Messages.ContentBlock,
): block is Anthropic.Messages.TextBlock {
  return block.type === "text";
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Claude is not configured. Set ANTHROPIC_API_KEY." },
      { status: 500 },
    );
  }

  const parseResult = requestSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { input, context, mode } = parseResult.data;
  const prompt =
    mode === "thread"
      ? `Draft a society thread.\n\nUser input:\n${input}\n\nContext:\n${context ?? "None"}\n\nReturn plain text only.`
      : `Draft a thoughtful comment reply.\n\nUser input:\n${input}\n\nContext:\n${context ?? "None"}\n\nReturn plain text only.`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 450,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content
        .filter(isTextBlock)
        .map((block) => block.text)
        .join("\n")
        .trim() || "";

    if (!text) {
      return NextResponse.json({ error: "Claude returned an empty response." }, { status: 502 });
    }

    return NextResponse.json({ draft: text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Claude request failed." },
      { status: 502 },
    );
  }
}
