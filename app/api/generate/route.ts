import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai"

import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { match } from "ts-pattern";

// Create an OpenAI API client (that's edge friendly!)

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  });
  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    return new Response(
      "Missing OPENAI_API_KEY - make sure to add it to your .env file.",
      {
        status: 400,
      }
    );
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `novel_ratelimit_${ip}`
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  const { prompt, option, command } = await req.json();
  const messages = match(option)
    .with("continue", () => {
      const { context, selected } = JSON.parse(prompt);
      return [
        {
          role: "system",
          content:
            "You are an AI writing assistant that continues existing text based on context. " +
            "You will receive previous context and a selected portion of text. " +
            "Use the context to understand the overall narrative, but continue directly from the selected text. " +
            "Keep the response similar in length to the original text, with a maximum of one paragraph extra. " +
            "Maintain the same style, tone, and voice as the existing text. " +
            "Return only the generated continuation without any explanations, comments, or metadata. " +
            "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: `Previous context: ${context}\n\nSelected text to continue from: ${selected}\n\nPlease continue the text from where the selection ends, maintaining consistency with both the selection and the previous context.`,
        },
      ];
    })
    .with("improve", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that improves existing text. " +
          "Return only the improved version without any explanations or comments. " +
          "Keep the response similar in length to the original text, with a maximum of one paragraph extra. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("shorter", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that shortens existing text. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("longer", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that lengthens existing text. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("fix", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("zap", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for manipulating the text. " +
          "Return only the modified text without any explanations or comments. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to respect the command: ${command}`,
      },
    ])
    .with("emotion_increase", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that enhances emotional content. " +
          "Make the text more emotionally charged and impactful, adding more emotional depth and resonance. " +
          "Focus on character feelings, emotional reactions, and sensory details that evoke emotions. " +
          "Keep the response similar in length to the original text, with a maximum of one paragraph extra. " +
          "Return only the modified text without any explanations or comments. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("emotion_decrease", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that moderates emotional content. " +
          "Make the text more emotionally neutral and objective, focusing on facts and events rather than feelings. " +
          "Maintain the story but reduce emotional language and dramatic elements. " +
          "Keep the response similar in length to the original text, with a maximum of one paragraph extra. " +
          "Return only the modified text without any explanations or comments. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("conflict_increase", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that enhances conflict and tension. " +
          "Add or amplify elements of conflict, whether internal, interpersonal, or situational. " +
          "Introduce or heighten obstacles, disagreements, or challenges. " +
          "Keep the response similar in length to the original text, with a maximum of one paragraph extra. " +
          "Return only the modified text without any explanations or comments. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("conflict_decrease", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that reduces conflict and tension. " +
          "Soften or resolve elements of conflict while maintaining the story's progression. " +
          "Focus on understanding, resolution, or peaceful development of the narrative. " +
          "Keep the response similar in length to the original text, with a maximum of one paragraph extra. " +
          "Return only the modified text without any explanations or comments. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("plot_twist", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that adds unexpected plot developments. " +
          "Create a surprising but logical twist that fits within the existing narrative context. " +
          "The twist should be unexpected but believable, adding intrigue without breaking story coherence. " +
          "Keep the response similar in length to the original text, with a maximum of one paragraph extra. " +
          "Return only the modified text without any explanations or comments. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("foreshadowing", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that adds subtle foreshadowing. " +
          "Insert delicate hints or clues about future events or developments. " +
          "The foreshadowing should be subtle enough to not be obvious on first reading, but clear in retrospect. " +
          "Keep the response similar in length to the original text, with a maximum of one paragraph extra. " +
          "Return only the modified text without any explanations or comments. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .run() as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
