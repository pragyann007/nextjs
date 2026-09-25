import { client } from "../server.js";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

import { getSystemPrompt, getUserPrompt } from "../constants/prompt.js";
import { geminiResponseSchema } from "../constants/gemini.schema.js";
import {
  SearchResponseSchema,
  withSourceIds,
  type SearchResult,
  type AnswerBlock,
  type FinalResponse,
  type Source,
} from "../schema/response.js";
import { createConversation, createMessages, getChatHistory } from "../repiository/app.repiository.js";

export interface AIData {
  url: string;
  title: string;
  content: string;
}

export interface MessageHistory {
    content:string
}

export interface ChatHistory {
  id: string;
  conversationId: string;
  content: string;
  messageBy: string;
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});

export const webSearch = async (query: string): Promise<AIData[]> => {
  const searchresponse = await client.search(query, {
    // searchDepth: "advanced"
  });

  return searchresponse.results.map((elem: any) => ({
    url: elem.url,
    title: elem.title,
    content: elem.content,
  }));
};

/** Collects every citation id used anywhere in the answer (paragraphs + list items). */
const collectUsedCitationIds = (blocks: AnswerBlock[]): Set<number> => {
  const ids = new Set<number>();
  for (const block of blocks) {
    block.citations?.forEach((id) => ids.add(id));
    block.items?.forEach((item) => item.citations?.forEach((id) => ids.add(id)));
  }
  return ids;
};

/** Drops citation ids that fall outside the valid source range (model hallucinated one). */
const sanitizeBlocks = (blocks: AnswerBlock[], validIds: Set<number>): AnswerBlock[] =>
  blocks.map((block) => ({
    ...block,
    citations: block.citations?.filter((id) => validIds.has(id)) ?? block.citations,
    items: block.items?.map((item) => ({
      ...item,
      citations: item.citations?.filter((id) => validIds.has(id)) ?? item.citations,
    })),
  }));

export const llmCalling = async (
  query: string,
  conversationId: string,
  data: AIData[],
  userId:string
): Promise<FinalResponse> => {
  // give each search result a stable numeric id — this is what the model cites by
  const searchResults: SearchResult[] = withSourceIds(data);
  const searchResultsById = new Map(searchResults.map((r) => [r.id, r]));

  const previousMessages: ChatHistory[] =
    (await getChatHistory(conversationId))?.map((message) => ({
      ...message,
      id: message.id.toString(),
    })) || [];

  const newChatHistory = previousMessages.map((elem) => ({
    content: elem.content,
    messageBy: elem.messageBy,
  }));

  const systemPrompt = getSystemPrompt();
  const userPrompt = getUserPrompt(query, searchResults, newChatHistory);

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: geminiResponseSchema,
    },
  });

  const outputText = result.text?.trim() ?? "";

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(outputText);
  } catch (error) {
    console.error("Failed to parse LLM output as JSON:", outputText);
    throw new Error("LLM did not return valid JSON");
  }

  const parsed = SearchResponseSchema.safeParse(parsedJson);
  if (!parsed.success) {
    console.error("LLM output failed schema validation:", parsed.error.flatten());
    throw new Error("LLM output did not match SearchResponseSchema");
  }

  const validIds = new Set(searchResults.map((r) => r.id));
  const usedIds = [...collectUsedCitationIds(parsed.data.blocks)]
    .filter((id) => validIds.has(id))
    .sort((a, b) => a - b);

  // sources are built here, from OUR search results — never from anything the model wrote
  const sources: Source[] = usedIds.map((id) => {
    const r = searchResultsById.get(id)!;
    return { id: r.id, title: r.title, url: r.url };
  });

  const finalResponse: FinalResponse = {
    ...parsed.data,
    blocks: sanitizeBlocks(parsed.data.blocks, validIds),
    sources,
  };


  let conversationIdNew:string  = conversationId; 
  if(Number(conversationId)==0){
     conversationIdNew = await createConversation(userId,finalResponse.title) ;
}

let humanMessage:MessageHistory = {
    content:query,
}

let aiMessage: MessageHistory = {
    content: finalResponse.blocks.map((block) => {
        if (block.type === "paragraph") {
            return block.text; // Extract text from paragraph blocks
        } else if (block.type === "bullet_list" || block.type === "numbered_list") {
            return block.items?.map((item) => item.text).join(", ") || ""; // Extract list items
        } else if (block.type === "table") {
            return "Table data"; // Placeholder for table content
        }
        return ""; // Handle other block types
    }).join(" "), // Combine all extracted content into a single string
};
// push messages
const pushMessage = await createMessages(conversationIdNew,humanMessage,aiMessage)

  return finalResponse;
};