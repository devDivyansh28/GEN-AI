import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";

const { text } = await generateText({
  model: "anthropic/claude-sonnet-5",
  stopWhen: stepCountIs(5),
  tools: {
    getWeather: tool({
      description: "Get the current weather for a location",
      inputSchema: z.object({
        location: z.string().describe("City name, e.g. San Francisco"),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72,
        condition: "sunny",
      }),
    }),
  },
  prompt: "What's the weather in Tokyo?",
});

console.log(text);

// Static tools
// import { tool } from "ai";
// import { z } from "zod";

// const weatherTool = tool({
//   description: "Get the weather in a location",
//   inputSchema: z.object({
//     location: z.string().describe("The location to get the weather for"),
//   }),
//   execute: async ({ location }) => {
//     // Your implementation
//     return { temperature: 72, conditions: "sunny" };
//   },
// });

// Dynamic tools

// import { dynamicTool } from "ai";
// import { z } from "zod";

// const runtimeTool = dynamicTool({
//   description: "Execute a tool loaded at runtime",
//   inputSchema: z.object({}),
//   execute: async (input) => {
//     // input is typed as unknown
//     return runRuntimeTool(input);
//   },
// });

// Provider Defined Tools

// import { anthropic } from "@ai-sdk/anthropic";
// import { generateText } from "ai";

// const result = await generateText({
//   model: anthropic("claude-opus-4-5"),
//   tools: {
//     bash: anthropic.tools.bash_20250124({
//       execute: async ({ command }) => {
//         // Your implementation to run the command
//         return runCommand(command);
//       },
//     }),
//   },
//   prompt: "List files in the current directory",
// });

// Provider side execution tools

// import { openai } from "@ai-sdk/openai";
// import { generateText } from "ai";

// const result = await generateText({
//   model: openai("gpt-5.2"),
//   tools: {
//     web_search: openai.tools.webSearch(),
//   },
//   prompt: "What happened in the news today?",
// });



