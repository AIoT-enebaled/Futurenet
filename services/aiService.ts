import axios from "axios";
import { ChatMessage, GroundingMetadata } from "../types";
import { generateMockResponse, checkMockApiKey } from "./mockAiService";

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface DeepSeekMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DeepSeekChatCompletionRequest {
  model: string;
  messages: DeepSeekMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface DeepSeekChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const checkApiKey = (): boolean => {
  // Return true if we have DeepSeek API key OR mock service is available
  return !!DEEPSEEK_API_KEY || checkMockApiKey();
};

const GII_T_SYSTEM_INSTRUCTION = `You are a friendly and helpful AI assistant for the Genius Institute of Information Technology (GiiT) community.
Your goal is to assist users with their queries related to GiiT, provide information, help with navigation within the community platform, and engage in general conversation.
Keep your responses concise, informative, and maintain a positive and supportive tone.
Do not make up information about GiiT if you don't know it. Instead, suggest asking a community admin or checking official GiiT resources.
You can use emojis sparingly to make the conversation more engaging. ✨

If you're asked about recent events or current information, you can provide general knowledge but note that your training data has a cutoff date.
`;

export const generateBotResponse = async (
  prompt: string,
  chatHistory: ChatMessage[],
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  if (!DEEPSEEK_API_KEY) {
    throw new Error(
      "DeepSeek API key is not configured. Please contact an administrator.",
    );
  }

  try {
    // Convert chat history to DeepSeek format
    const messages: DeepSeekMessage[] = [
      {
        role: "system",
        content: GII_T_SYSTEM_INSTRUCTION,
      },
    ];

    // Add recent chat history (last 6 messages to stay within context limits)
    const recentHistory = chatHistory.slice(-6);
    for (const msg of recentHistory) {
      if (msg.sender === "user") {
        messages.push({
          role: "user",
          content: msg.text,
        });
      } else if (msg.sender === "bot") {
        messages.push({
          role: "assistant",
          content: msg.text,
        });
      }
    }

    // Add current user message
    messages.push({
      role: "user",
      content: prompt,
    });

    const requestBody: DeepSeekChatCompletionRequest = {
      model: "deepseek-chat",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    };

    const response = await axios.post<DeepSeekChatCompletionResponse>(
      DEEPSEEK_API_URL,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
      },
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
      const text = response.data.choices[0].message.content;

      if (!text || text.trim() === "") {
        return {
          text: "I received a response, but it was empty. Could you try rephrasing?",
        };
      }

      return { text: text.trim() };
    } else {
      console.error("DeepSeek API returned no choices:", response.data);
      throw new Error("Received an empty response from the AI.");
    }
  } catch (error: any) {
    console.error("Error calling DeepSeek API:", error);

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      if (status === 401) {
        throw new Error(
          "Invalid DeepSeek API Key. Please check your configuration.",
        );
      } else if (status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (status === 400) {
        throw new Error("Invalid request. Please try rephrasing your message.");
      } else {
        throw new Error(
          `DeepSeek API error (${status}): ${errorData?.error?.message || "Unknown error"}`,
        );
      }
    } else if (error.request) {
      throw new Error(
        "Unable to reach DeepSeek API. Please check your internet connection.",
      );
    } else {
      throw new Error(
        `Failed to get response from AI: ${error.message || "Unknown error"}`,
      );
    }
  }
};

// For backwards compatibility with existing image generation calls
export const generateImageFromPrompt = async (
  prompt: string,
): Promise<string> => {
  throw new Error(
    "Image generation is not supported with DeepSeek. This feature requires a different AI service.",
  );
};

// Export the DeepSeek service function for direct use
export const generateDeepSeekResponse = async (
  messages: DeepSeekMessage[],
  model: string = "deepseek-chat",
): Promise<string | null> => {
  if (!DEEPSEEK_API_KEY) {
    console.error("DeepSeek API key is not set.");
    return "DeepSeek API key is not configured. Please contact the administrator.";
  }

  const requestBody: DeepSeekChatCompletionRequest = {
    model: model,
    messages: messages,
    max_tokens: 1000,
    temperature: 0.7,
  };

  try {
    const response = await axios.post<DeepSeekChatCompletionResponse>(
      DEEPSEEK_API_URL,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
      },
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
      return response.data.choices[0].message.content;
    } else {
      console.error("DeepSeek API returned no choices:", response.data);
      return "Error: Received an empty response from the AI.";
    }
  } catch (error: any) {
    console.error("Error calling DeepSeek API:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      return `Error calling DeepSeek API: ${error.response.status} - ${error.response.data?.error?.message || error.message}`;
    } else if (error.request) {
      return "Error calling DeepSeek API: No response received from server.";
    } else {
      return `Error calling DeepSeek API: ${error.message}`;
    }
  }
};
