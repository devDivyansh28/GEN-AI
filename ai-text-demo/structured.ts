import { generateObject } from "ai";
import { z } from "zod";

const { object } = await generateObject({
  model: "anthropic/claude-sonnet-5",
  schema: z.object({
    name: z.string(),
    age: z.number(),
    city: z.string(),
  }),
  prompt: "Extract: John is 30 years old and lives in NYC.",
});

console.log(object); // { name: 'John', age: 30, city: 'NYC' }
