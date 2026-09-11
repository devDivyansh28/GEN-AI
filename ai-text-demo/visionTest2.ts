import fs from "node:fs";
import { generateObject } from "ai";
import { z } from "zod";
import "dotenv/config";

const invoiceSchema = z.object({
  seller: z.object({
    name: z.string().nullable(),
    panNumber: z.string().nullable(),
    phoneNumbers: z.array(z.string()),
    address: z.string().nullable(),
    businessDescription: z.string().nullable(),
  }),

  buyer: z.object({
    name: z.string().nullable(),
    address: z.string().nullable(),
  }),

  invoiceNumber: z.string().nullable(),

  invoiceDate: z
    .string()
    .nullable()
    .describe("Invoice date in YYYY-MM-DD format if it can be determined."),

  items: z.array(
    z.object({
      serialNumber: z.number().nullable(),

      description: z
        .string()
        .nullable()
        .describe("The handwritten description of the item/service."),

      quantity: z.number().nullable(),

      unit: z.string().nullable(),

      rate: z.number().nullable(),

      amount: z.number().nullable(),
    }),
  ),

  total: z.number().nullable(),

  totalInWords: z.string().nullable(),

  currency: z.string().nullable(),

  additionalNotes: z.string().nullable(),
});

export async function main() {
  const result = await generateObject({
    model: "zai/glm-4.6v-flash",

    schema: invoiceSchema,

    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
You are an invoice extraction system.

Analyze the attached handwritten invoice and extract the information
into the provided structured schema.

Important instructions:
- Carefully read the handwritten text.
- Do not invent information.
- If a field cannot be confidently read, return null.
- Preserve item descriptions as accurately as possible.
- Convert numeric quantities, rates and amounts into numbers.
- Extract the invoice date.
- Extract the invoice/bill number.
- Extract the total amount.
- If the date is recognizable, return it in YYYY-MM-DD format.
- For ambiguous handwriting, prefer null rather than guessing.
`,
          },
          {
            type: "file",
            data: fs.readFileSync("./invoicetest.webp"),
            mediaType: "image/webp",
          },
        ],
      },
    ],
  });

  console.log(JSON.stringify(result.object, null, 2));

  console.log("\nToken Usage:");
  console.log(await result.usage);

  console.log("\nFinish Reason:");
  console.log(await result.finishReason);
}

main().catch(console.error);
