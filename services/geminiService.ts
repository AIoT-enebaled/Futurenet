
import { GoogleGenAI, GenerateContentResponse, Content, Part, GenerateImageResponse } from "@google/genai";
import { ChatMessage, GroundingMetadata } from '../types';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API Key is not defined. AI features will be disabled.");
}

export const checkApiKey = (): boolean => {
  return !!API_KEY;
};

const GII_T_SYSTEM_INSTRUCTION = `You are a friendly and helpful AI assistant for the Genius Institute of Information Technology (GiiT) community.
Your goal is to assist users with their queries related to GiiT, provide information, help with navigation within the community platform, and engage in general conversation.
If asked about recent events, news, or specific up-to-date information that would benefit from web search, please indicate that you are searching the web.
Keep your responses concise, informative, and maintain a positive and supportive tone.
When providing information from the web, always cite your sources clearly if they are available in the grounding metadata.
Do not make up information about GiiT if you don't know it. Instead, suggest asking a community admin or checking official GiiT resources.
You can use emojis sparingly to make the conversation more engaging. ✨
`;

// Removed buildChatHistory as it was not used and generateContent takes full prompt.

export const generateBotResponse = async (
  prompt: string,
  chatHistory: ChatMessage[]
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. API Key may be missing.");
  }

  const model = ai.models;
  const geminiModel = 'gemini-2.5-flash-preview-04-17';

  const requiresSearch = /\b(who|what|when|where|latest|news|recent|current events)\b.*\?/i.test(prompt) || /\b(olympics|stock price|weather in)\b/i.test(prompt);

  try {
    const fullPrompt = chatHistory.length > 0 
      ? `Previous conversation:\n${chatHistory.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n')}\n\nUser's current message: ${prompt}`
      : prompt;
    
    const requestPayload = {
      model: geminiModel,
      contents: fullPrompt, 
      config: {
        systemInstruction: GII_T_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        ...(requiresSearch && { tools: [{googleSearch: {}}] }),
      }
    };

    const response: GenerateContentResponse = await model.generateContent(requestPayload);
    
    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;

    if (!text && !groundingMetadata?.groundingChunks?.length) { // Check if text is empty AND no grounding chunks provided
      console.warn("Received an empty text response and no grounding chunks from the AI for prompt:", prompt);
      // Decide if this should be an error or a specific message
      // For now, let's return a generic message if text is truly empty and no search results
      if (!text) return { text: "I received a response, but it was empty. Could you try rephrasing?" };
    }
    return { text: text || "No textual answer provided, check sources if available.", groundingMetadata }; // Ensure text is always a string

  } catch (error) {
    console.error("Error calling Gemini API (generateContent):", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key. Please check your configuration.");
        }
         if (error.message.includes("429") || error.message.toLowerCase().includes("resource has been exhausted") || error.message.toLowerCase().includes("rate limit")) { 
            throw new Error("The request was blocked due to safety settings or rate limiting. Please try again later.");
        }
    }
    throw new Error(`Failed to get response from AI: ${ (error as Error).message || 'Unknown error'}`);
  }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized. API Key may be missing for image generation.");
  }

  const imageModelName = 'imagen-3.0-generate-002'; 
  const model = ai.models;

  try {
    const response: GenerateImageResponse = await model.generateImages({
      model: imageModelName,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image data received from the AI.");
    }
  } catch (error) {
    console.error("Error calling Gemini API (generateImages):", error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key for image generation. Please check your configuration.");
      }
      if (error.message.includes("429") || error.message.toLowerCase().includes("resource has been exhausted") || error.message.toLowerCase().includes("rate limit")) {
        throw new Error("Image generation request was blocked due to safety settings or rate limiting. Please try again later.");
      }
       if (error.message.toLowerCase().includes("prompt was blocked")) {
        throw new Error("Your image prompt was blocked due to safety reasons. Please revise your prompt.");
      }
    }
    throw new Error(`Failed to generate image: ${(error as Error).message || 'Unknown error'}`);
  }
};
