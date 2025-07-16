export type MessageReaction = {
  emoji: string;
  users: string[]; // User IDs who reacted
  count: number;
};

export type EnhancedMessengerMessage = {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  docUrl?: string;
  docName?: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  isAIMessage?: boolean;
  replyToMessageId?: string; // For threaded replies
  reactions?: MessageReaction[];
  editedAt?: Date;
  deletedAt?: Date;
};

export type UserPresence = {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
  isTyping: boolean;
  typingInChat?: string;
};

export type RealTimeEvent =
  | { type: "message_sent"; data: EnhancedMessengerMessage }
  | { type: "message_delivered"; data: { messageId: string; chatId: string } }
  | {
      type: "message_read";
      data: { messageId: string; chatId: string; readBy: string };
    }
  | {
      type: "user_typing";
      data: { userId: string; chatId: string; isTyping: boolean };
    }
  | { type: "user_presence"; data: UserPresence }
  | {
      type: "message_reaction";
      data: {
        messageId: string;
        chatId: string;
        emoji: string;
        userId: string;
        action: "add" | "remove";
      };
    }
  | {
      type: "message_edited";
      data: { messageId: string; newText: string; editedAt: Date };
    }
  | {
      type: "message_deleted";
      data: { messageId: string; chatId: string; deletedAt: Date };
    };

export class RealtimeMessagingService {
  private eventListeners: Map<string, ((event: RealTimeEvent) => void)[]> =
    new Map();
  private userPresences: Map<string, UserPresence> = new Map();
  private messageStatuses: Map<string, EnhancedMessengerMessage["status"]> =
    new Map();
  private typingTimers: Map<string, NodeJS.Timeout> = new Map();
  private connectionId: string = Math.random().toString(36).substring(7);

  constructor() {
    this.initializeSimulatedWebSocket();
  }

  // Initialize simulated WebSocket connection
  private initializeSimulatedWebSocket() {
    console.log(`[RealtimeMessaging] Connected with ID: ${this.connectionId}`);

    // Simulate random presence updates
    setInterval(() => {
      this.simulateRandomPresenceUpdates();
    }, 30000); // Every 30 seconds
  }

  // Subscribe to real-time events
  subscribe(eventType: string, callback: (event: RealTimeEvent) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);

    return () => {
      const callbacks = this.eventListeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Emit event to subscribers
  private emit(event: RealTimeEvent) {
    const callbacks = this.eventListeners.get(event.type) || [];
    const allCallbacks = this.eventListeners.get("*") || [];

    [...callbacks, ...allCallbacks].forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error("[RealtimeMessaging] Error in event callback:", error);
      }
    });
  }

  // Send message with real-time delivery simulation
  async sendMessage(
    message: Omit<EnhancedMessengerMessage, "status" | "timestamp" | "id">,
  ): Promise<EnhancedMessengerMessage> {
    const fullMessage: EnhancedMessengerMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      status: "sending",
      reactions: [],
    };

    // Immediately emit sending status
    this.emit({ type: "message_sent", data: fullMessage });

    // Simulate network delay and delivery
    setTimeout(
      () => {
        fullMessage.status = "sent";
        this.messageStatuses.set(fullMessage.id, "sent");
        this.emit({ type: "message_sent", data: fullMessage });

        // Simulate delivery after a short delay
        setTimeout(
          () => {
            fullMessage.status = "delivered";
            this.messageStatuses.set(fullMessage.id, "delivered");
            this.emit({
              type: "message_delivered",
              data: { messageId: fullMessage.id, chatId: fullMessage.chatId },
            });

            // Simulate read receipt (randomly after 2-10 seconds)
            setTimeout(
              () => {
                fullMessage.status = "read";
                this.messageStatuses.set(fullMessage.id, "read");
                this.emit({
                  type: "message_read",
                  data: {
                    messageId: fullMessage.id,
                    chatId: fullMessage.chatId,
                    readBy: "other-user",
                  },
                });
              },
              Math.random() * 8000 + 2000,
            );
          },
          Math.random() * 2000 + 500,
        );
      },
      Math.random() * 1000 + 200,
    );

    return fullMessage;
  }

  // Handle typing indicators
  setTyping(userId: string, chatId: string, isTyping: boolean) {
    const key = `${userId}-${chatId}`;

    if (isTyping) {
      // Clear existing timer
      if (this.typingTimers.has(key)) {
        clearTimeout(this.typingTimers.get(key)!);
      }

      // Set new timer to auto-stop typing after 3 seconds
      const timer = setTimeout(() => {
        this.setTyping(userId, chatId, false);
      }, 3000);

      this.typingTimers.set(key, timer);
    } else {
      // Clear timer
      if (this.typingTimers.has(key)) {
        clearTimeout(this.typingTimers.get(key)!);
        this.typingTimers.delete(key);
      }
    }

    // Update presence
    const presence = this.userPresences.get(userId) || {
      userId,
      isOnline: true,
      lastSeen: new Date(),
      isTyping: false,
    };

    presence.isTyping = isTyping;
    presence.typingInChat = isTyping ? chatId : undefined;
    this.userPresences.set(userId, presence);

    this.emit({
      type: "user_typing",
      data: { userId, chatId, isTyping },
    });
  }

  // Update user presence
  updatePresence(userId: string, isOnline: boolean) {
    const presence: UserPresence = {
      userId,
      isOnline,
      lastSeen: new Date(),
      isTyping: false,
    };

    this.userPresences.set(userId, presence);
    this.emit({ type: "user_presence", data: presence });
  }

  // Get user presence
  getUserPresence(userId: string): UserPresence | null {
    return this.userPresences.get(userId) || null;
  }

  // Add message reaction
  addReaction(
    messageId: string,
    chatId: string,
    emoji: string,
    userId: string,
  ) {
    this.emit({
      type: "message_reaction",
      data: { messageId, chatId, emoji, userId, action: "add" },
    });
  }

  // Remove message reaction
  removeReaction(
    messageId: string,
    chatId: string,
    emoji: string,
    userId: string,
  ) {
    this.emit({
      type: "message_reaction",
      data: { messageId, chatId, emoji, userId, action: "remove" },
    });
  }

  // Edit message
  editMessage(messageId: string, newText: string) {
    const editedAt = new Date();
    this.emit({
      type: "message_edited",
      data: { messageId, newText, editedAt },
    });
  }

  // Delete message
  deleteMessage(messageId: string, chatId: string) {
    const deletedAt = new Date();
    this.emit({
      type: "message_deleted",
      data: { messageId, chatId, deletedAt },
    });
  }

  // Simulate random presence updates for demo
  private simulateRandomPresenceUpdates() {
    const mockUsers = ["user-2", "user-3", "user-4", "user-5"];

    mockUsers.forEach((userId) => {
      const isOnline = Math.random() > 0.3; // 70% chance to be online
      this.updatePresence(userId, isOnline);
    });
  }

  // Get message status
  getMessageStatus(
    messageId: string,
  ): EnhancedMessengerMessage["status"] | null {
    return this.messageStatuses.get(messageId) || null;
  }

  // Cleanup
  disconnect() {
    this.eventListeners.clear();
    this.typingTimers.forEach((timer) => clearTimeout(timer));
    this.typingTimers.clear();
    console.log(`[RealtimeMessaging] Disconnected ${this.connectionId}`);
  }
}

// Singleton instance
export const realtimeMessaging = new RealtimeMessagingService();
