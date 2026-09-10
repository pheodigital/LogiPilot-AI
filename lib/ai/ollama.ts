import { createOllama } from "ai-sdk-ollama";

export const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/api",
});

export const chatModel = ollama(process.env.OLLAMA_MODEL ?? "qwen3:4b");
