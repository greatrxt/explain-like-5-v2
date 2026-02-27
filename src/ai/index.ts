import { openai } from "@ai-sdk/openai";

export const getModel = (modelId: string = "gpt-4o-mini") => {
  return openai(modelId);
};
