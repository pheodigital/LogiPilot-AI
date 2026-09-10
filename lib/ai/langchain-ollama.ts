import { ChatOllama } from "@langchain/ollama";

// Separate from lib/ai/ollama.ts on purpose: that file's chatModel is
// shaped for the Vercel AI SDK (ai-sdk-ollama). LangChain has its own
// model abstraction (ChatOllama) with a different interface, so it
// needs its own client — even though both hit the same local Ollama server.
export const langchainModel = new ChatOllama({
  baseUrl: process.env.LANGCHAIN_OLLAMA_BASE_URL ?? "http://localhost:11434",
  model: process.env.OLLAMA_MODEL ?? "qwen3:4b", // reuse the same model name env var — no need to duplicate this one
});
