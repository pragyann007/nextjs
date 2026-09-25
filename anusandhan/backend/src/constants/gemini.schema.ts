// constants/gemini.schema.ts
import { Type } from "@google/genai";

/**
 * Same shape as SearchResponseSchema in schema.ts, written in the
 * OpenAPI-subset format @google/genai's responseSchema expects.
 * Keep these two in sync if you change one.
 *
 * NOTE: `sources` is intentionally NOT part of this schema — the model
 * never generates it. It's built server-side in llmCalling from the
 * citation ids the model actually used, mapped back to the real search
 * results (never trust the model to reproduce a URL/title correctly).
 */
export const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: [
        "direct",
        "explanatory",
        "comparative",
        "list",
        "how_to",
        "definition",
        "opinion_summary",
        "clarification_needed",
      ],
    },
    title: { type: Type.STRING },
    blocks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ["paragraph", "heading", "bullet_list", "numbered_list", "code", "table"],
          },
          text: { type: Type.STRING, nullable: true },
          citations: {
            type: Type.ARRAY,
            items: { type: Type.INTEGER },
            nullable: true,
            description: "paragraph only — numeric source ids",
          },
          level: { type: Type.INTEGER, nullable: true },
          items: {
            type: Type.ARRAY,
            nullable: true,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                citations: { type: Type.ARRAY, items: { type: Type.INTEGER }, nullable: true },
              },
              required: ["text"],
              propertyOrdering: ["text", "citations"],
            },
          },
          language: { type: Type.STRING, nullable: true },
          code: { type: Type.STRING, nullable: true },
          headers: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
          rows: {
            type: Type.ARRAY,
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
            nullable: true,
          },
        },
        required: ["type"],
        propertyOrdering: ["type", "text", "citations", "level", "items", "language", "code", "headers", "rows"],
      },
    },
    relatedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    clarificationQuestion: { type: Type.STRING, nullable: true },
  },
  required: ["type", "title", "blocks", "relatedQuestions"],
  propertyOrdering: ["type", "title", "blocks", "relatedQuestions", "clarificationQuestion"],
};