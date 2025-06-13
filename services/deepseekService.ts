import axios from 'axios';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // Replace with the actual DeepSeek chat completion endpoint if different

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekChatCompletionRequest {
  model: string; // e.g., 'deepseek-chat'
  messages: DeepSeekMessage[];
  max_tokens?: number;
  temperature?: number;
  // Add other parameters as needed
}

interface DeepSeekChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: DeepSeekMessage;
    logprobs: any | null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const generateDeepSeekResponse = async (messages: DeepSeekMessage[], model: string = 'deepseek-chat'): Promise<string | null> => {
  if (!DEEPSEEK_API_KEY) {
    console.error('DeepSeek API key is not set.');
    return "DeepSeek API key is not configured. Please contact the administrator.";
  }

  const requestBody: DeepSeekChatCompletionRequest = {
    model: model,
    messages: messages,
    // Add other parameters like max_tokens, temperature if needed
  };

  try {
    const response = await axios.post<DeepSeekChatCompletionResponse>(
      DEEPSEEK_API_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      console.error('DeepSeek API returned no choices:', response.data);
      return 'Error: Received an empty response from the AI.';
    }
  } catch (error: any) {
    console.error('Error calling DeepSeek API:', error);
    // More detailed error handling based on error.response
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      return `Error calling DeepSeek API: ${error.response.status} - ${error.response.data?.message || error.message}`;
    } else if (error.request) {
      console.error('Error request:', error.request);
      return 'Error calling DeepSeek API: No response received from server.';
    } else {
      console.error('Error message:', error.message);
      return `Error calling DeepSeek API: ${error.message}`;
    }
  }
};