import { generateText } from "ai";

const result = await generateText({
  model: "anthropic/claude-sonnet-5",
  prompt:
    "A bat and ball cost $1.10. The bat costs $1 more than the ball. How much is the ball?",
  reasoning: "high",
});

console.log(result.reasoningText);
console.log(result.text);

//on ai ask v 6 you need to provide provideroptions to proceed further

// Provider options for reasioning

// import {
//   openai,
//   type OpenAILanguageModelResponsesOptions,
// } from "@ai-sdk/openai";
// import { streamText } from "ai";

// const result = streamText({
//   model: openai("gpt-5.2"),
//   prompt: "Tell me about the Mission burrito debate in San Francisco.",
//   providerOptions: {
//     openai: {
//       reasoningSummary: "detailed", // 'auto' | 'detailed'
//     } satisfies OpenAILanguageModelResponsesOptions,
//   },
// });

// for await (const part of result.stream) {
//   if (part.type === "reasoning") {
//     console.log(`Reasoning: ${part.textDelta}`);
//   } else if (part.type === "text-delta") {
//     process.stdout.write(part.textDelta);
//   }
// }