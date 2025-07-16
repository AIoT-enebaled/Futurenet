import { generateDeepSeekResponse } from "./deepseekService";
import {
  generateBotResponse as generateGeminiResponse,
  checkApiKey as checkGeminiApiKey,
} from "./geminiService";
import { ChatMessage, GroundingMetadata } from "../types";

interface DeepSeekMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

// Check if any AI service is available (prioritize Gemini)
export const checkApiKey = (): boolean => {
  return checkGeminiApiKey() || !!DEEPSEEK_API_KEY;
};

// Convert ChatMessage history to DeepSeek format
const convertChatHistoryToDeepSeek = (
  chatHistory: ChatMessage[],
): DeepSeekMessage[] => {
  const systemMessage: DeepSeekMessage = {
    role: "system",
    content: `You are a friendly and helpful AI assistant for the Genius Institute of Information Technology (GiiT) community.
Your goal is to assist users with their queries related to GiiT, provide information, help with navigation within the community platform, and engage in general conversation.
Keep your responses concise, informative, and maintain a positive and supportive tone.
Do not make up information about GiiT if you don't know it. Instead, suggest asking a community admin or checking official GiiT resources.
You can use emojis sparingly to make the conversation more engaging. ✨`,
  };

  const messages: DeepSeekMessage[] = [systemMessage];

  // Add chat history (last 8 messages to keep context manageable)
  const recentHistory = chatHistory.slice(-8);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    });
  }

  return messages;
};

// Main AI response function that prioritizes Gemini over Deepseek
export const generateBotResponse = async (
  prompt: string,
  chatHistory: ChatMessage[],
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  // Try Gemini first
  if (checkGeminiApiKey()) {
    try {
      return await generateGeminiResponse(prompt, chatHistory);
    } catch (error) {
      console.warn("Gemini failed, trying fallback to Deepseek:", error);
    }
  }

  // Fallback to Deepseek if Gemini fails or is not available
  if (DEEPSEEK_API_KEY) {
    try {
      const messages = convertChatHistoryToDeepSeek(chatHistory);
      // Add the current user prompt
      messages.push({
        role: "user",
        content: prompt,
      });

      const response = await generateDeepSeekResponse(messages);
      if (
        response &&
        response !==
          "DeepSeek API key is not configured. Please contact the administrator."
      ) {
        return { text: response };
      }
    } catch (error) {
      console.error("Both AI services failed:", error);
      throw new Error(
        "AI services are currently unavailable. Please try again later.",
      );
    }
  }

  // If no AI service is available
  throw new Error(
    "AI services are not configured. Please contact an administrator.",
  );
};

// Image generation (currently only supported by Gemini)
export const generateImageFromPrompt = async (
  prompt: string,
): Promise<string> => {
  if (checkGeminiApiKey()) {
    const { generateImageFromPrompt } = await import("./geminiService");
    return generateImageFromPrompt(prompt);
  }
  throw new Error("Image generation is currently unavailable.");
};
