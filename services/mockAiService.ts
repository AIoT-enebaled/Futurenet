import { ChatMessage, GroundingMetadata } from "../types";

// Mock AI responses for when the real API is unavailable
const MOCK_RESPONSES = [
  "Hello! I'm GiiT AI Assistant. While I'm currently running in demo mode, I'm here to help you with questions about GiiT, technology, and general assistance. ✨",
  "That's a great question! While I'm currently in demo mode due to API limitations, I'd be happy to help you explore GiiT's features and resources.",
  "I understand you're looking for information. In demo mode, I can provide general guidance about GiiT's platform and help navigate the community features.",
  "Thanks for reaching out! I'm currently running in demo mode, but I can still assist with general questions about technology, programming, and the GiiT community.",
  "Interesting! While my full AI capabilities are temporarily limited, I can help guide you through GiiT's learning platform and community features.",
  "I appreciate your question! Currently running in demo mode, but I'm still here to help with navigation, basic queries, and information about GiiT's offerings.",
  "Great to chat with you! I'm in demo mode right now, but I can still provide guidance on using GiiT's features, finding resources, and connecting with the community.",
  "Hello there! While I'm operating in demo mode due to API limitations, I can still help with basic questions about GiiT and general technology topics.",
];

const CONTEXT_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! Welcome to GiiT! I'm currently in demo mode, but I'm excited to help you explore our community platform. ✨",
    "Hi there! Great to see you on GiiT. While I'm running in demo mode, I can still help you navigate and learn about our features!",
    "Welcome! I'm GiiT AI Assistant. Currently in demo mode, but ready to help you get started with our community and learning platform.",
  ],
  help: [
    "I'd love to help! While I'm in demo mode, I can guide you through GiiT's features: courses, community discussions, projects, and messaging.",
    "Of course! Even in demo mode, I can assist with navigating GiiT's learning platform, finding courses, or connecting with other members.",
    "Happy to help! In demo mode, I can provide guidance on using GiiT's tools, accessing resources, and participating in the community.",
  ],
  courses: [
    "GiiT offers a variety of courses in technology and programming! While I'm in demo mode, you can explore the Learning section to see available courses.",
    "Our courses cover web development, AI, data science, and more! Check out the Learning page to browse all available options.",
    "GiiT's learning platform has courses for all skill levels. Visit the Learning section to find courses that match your interests!",
  ],
  community: [
    "The GiiT community is amazing! You can join discussions, share projects, and connect with fellow learners. Check out the Teams and Projects sections!",
    "Our community features include teams, project sharing, and collaborative discussions. Great place to network and learn together!",
    "GiiT's community is built for collaboration! Join teams, share your work, and participate in discussions with other tech enthusiasts.",
  ],
  projects: [
    "Projects are a great way to showcase your work! You can create, share, and collaborate on projects with other GiiT members.",
    "The Projects section lets you display your coding work, get feedback, and discover what others are building!",
    "Share your projects with the GiiT community! It's a fantastic way to get feedback and inspire others.",
  ],
  default: MOCK_RESPONSES,
};

function getContextualResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  // Check for greeting patterns
  if (
    /\b(hello|hi|hey|greetings|good\s+(morning|afternoon|evening))\b/.test(
      lowerPrompt,
    )
  ) {
    return getRandomResponse(CONTEXT_RESPONSES.greeting);
  }

  // Check for help patterns
  if (/\b(help|assist|support|guide|how)\b/.test(lowerPrompt)) {
    return getRandomResponse(CONTEXT_RESPONSES.help);
  }

  // Check for course-related queries
  if (/\b(course|learn|class|education|tutorial|study)\b/.test(lowerPrompt)) {
    return getRandomResponse(CONTEXT_RESPONSES.courses);
  }

  // Check for community-related queries
  if (/\b(community|team|member|social|network|connect)\b/.test(lowerPrompt)) {
    return getRandomResponse(CONTEXT_RESPONSES.community);
  }

  // Check for project-related queries
  if (/\b(project|work|code|build|create|portfolio)\b/.test(lowerPrompt)) {
    return getRandomResponse(CONTEXT_RESPONSES.projects);
  }

  // Default response
  return getRandomResponse(CONTEXT_RESPONSES.default);
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

export const generateMockResponse = async (
  prompt: string,
  chatHistory: ChatMessage[],
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 1200),
  );

  let response = getContextualResponse(prompt);

  // Add context from chat history if this is a follow-up
  if (chatHistory.length > 0) {
    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage && lastMessage.sender === "user") {
      response = `Building on our conversation... ${response}`;
    }
  }

  // Add demo mode notice occasionally
  if (Math.random() < 0.3) {
    response +=
      "\n\n💡 *Note: I'm currently running in demo mode due to API limitations. Full AI capabilities will return once the service is restored.*";
  }

  return { text: response };
};

export const checkMockApiKey = (): boolean => {
  return true; // Mock service is always "available"
};
