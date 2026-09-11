import fs from "node:fs";
import { generateText  , streamText} from "ai";
import { z } from "zod";
import 'dotenv/config'

export async function main(){
const result = streamText({
  model: "amazon/nova-lite",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "You are an Invoice Analyzer. Convert this invoice into a structured format.",
        },
        {
          type: "file",
          data: fs.readFileSync("./invoicetest.webp"),
          mediaType: "image/png",
        },
      ],
    },
  ],
});

for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}

console.log();
console.log("Token Usage:", await result.usage);
console.log("Finish Reason", await result.finishReason);


}

main().catch(console.error);




