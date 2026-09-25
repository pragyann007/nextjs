// schema/response.ts
import { z } from "zod";

/**
 * Text that can carry its own citations — used for paragraph text and for
 * each item inside a bullet/numbered list, since a list often mixes claims
 * from different sources per line.
 */
const CitableText = z.object({
  text: z.string().min(1),
  citations: z
    .array(z.number().int().min(1))
    .nullable()
    .optional()
    .describe("Numeric source ids (matching `sources[].id`) that support this text"),
});

/**
 * A single content block. The answer is built out of these instead of one
 * markdown blob, so the frontend can render headings/lists/tables/code the
 * same way Perplexity does, instead of parsing markdown on the client.
 *
 * Citations are structured data (a `citations: number[]` field), not
 * inline "[1]" tokens inside the text. This is safer than inline markers:
 * the model can't produce a citation that doesn't parse, and the frontend
 * doesn't need to scan text for bracket patterns.
 *
 * NOTE: this is intentionally a flat object with all fields optional,
 * NOT a discriminated union. Gemini's structured-output `responseSchema`
 * does not reliably support oneOf/discriminated unions, so the shape the
 * model is asked for and the shape used to validate its output must be
 * the same flat shape (see gemini.schema.ts).
 */
export const AnswerBlockSchema = z
  .object({
    type: z.enum(["paragraph", "heading", "bullet_list", "numbered_list", "code", "table"]),
    text: z.string().nullable().optional().describe("paragraph/heading only"),
    citations: z
      .array(z.number().int().min(1))
      .nullable()
      .optional()
      .describe("paragraph only — numeric source ids that support this paragraph"),
    level: z.union([z.literal(2), z.literal(3)]).nullable().optional().describe("heading only"),
    items: z.array(CitableText).nullable().optional().describe("bullet_list/numbered_list only"),
    language: z.string().nullable().optional().describe("code only"),
    code: z.string().nullable().optional().describe("code only"),
    headers: z.array(z.string()).nullable().optional().describe("table only"),
    rows: z.array(z.array(z.string())).nullable().optional().describe("table only"),
  })
  .superRefine((block, ctx) => {
    const fail = (msg: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg });
    switch (block.type) {
      case "paragraph":
        if (!block.text?.trim()) fail("paragraph block is missing non-empty \"text\"");
        break;
      case "heading":
        if (!block.text?.trim()) fail("heading block is missing non-empty \"text\"");
        break;
      case "bullet_list":
      case "numbered_list":
        if (!block.items?.length) fail(`${block.type} block is missing non-empty "items"`);
        break;
      case "code":
        if (!block.code?.trim()) fail("code block is missing non-empty \"code\"");
        break;
      case "table":
        if (!block.headers?.length || !block.rows?.length) fail("table block is missing \"headers\"/\"rows\"");
        break;
    }
  })
  .describe("Fields other than `type` are populated based on which type this block is");

export const SearchResponseSchema = z.object({
  type: z.enum([
    "direct", // short factual answer
    "explanatory", // needs paragraphs/sections
    "comparative", // "X vs Y" style, usually wants a table
    "list", // "top 10 ...", "ways to ..."
    "how_to", // step-by-step
    "definition",
    "opinion_summary", // aggregating differing viewpoints/opinions
    "clarification_needed", // query too ambiguous to answer
  ]),

  title: z.string().min(1).describe("Short (<10 word) title summarizing the answer, shown above it"),

  blocks: z
    .array(AnswerBlockSchema)
    .min(1)
    .describe("The full answer, broken into ordered renderable blocks"),

  relatedQuestions: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("Specific follow-ups that continue this exact research thread"),

  clarificationQuestion: z
    .string()
    .nullable()
    .optional()
    .describe("Only set when type = 'clarification_needed'"),
});

/**
 * NOT produced by the model — built server-side in llmCalling from the
 * citation ids actually used in `blocks`, mapped back to the real search
 * results. Never let the model invent titles/urls itself.
 */
export const SourceSchema = z.object({
  id: z.number().int().min(1),
  title: z.string(),
  url: z.string(),
});

/** The final shape returned to the client (model output + server-built sources). */
export const FinalResponseSchema = SearchResponseSchema.omit({}).and(
  z.object({ sources: z.array(SourceSchema) })
);

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type FinalResponse = z.infer<typeof FinalResponseSchema>;
export type AnswerBlock = z.infer<typeof AnswerBlockSchema>;
export type Source = z.infer<typeof SourceSchema>;

/**
 * What you pass INTO the prompt as web search results.
 * `id` is a stable 1-based numeric index — this is what the model cites by
 * in `citations` arrays, never a URL or title.
 */
export const SearchResultSchema = z.object({
  id: z.number().int().min(1),
  title: z.string(),
  url: z.string(),
  snippet: z.string(),
  publishedDate: z.string().optional(),
});
export type SearchResult = z.infer<typeof SearchResultSchema>;

/** Convenience: turn raw web search results into numbered SearchResults. */
export const withSourceIds = (
  results: { url: string; title: string; content: string }[]
): SearchResult[] =>
  results.map((r, i) => ({
    id: i + 1,
    title: r.title,
    url: r.url,
    snippet: r.content,
  }));