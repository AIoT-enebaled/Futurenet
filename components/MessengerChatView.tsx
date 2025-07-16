import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MessengerChat,
  MessengerMessage,
  User,
  MessengerUser,
  TypingIndicator,
  ChatMessage as BotChatMessage,
} from "../types";
import MessengerMessageDisplay from "./MessengerMessageDisplay";
import MessengerInput from "./MessengerInput";
import VirtualizedMessageList from "./VirtualizedMessageList";
import MessageSearchModal from "./MessageSearchModal";
import {
  PhoneIcon,
  VideoIcon as VideoCallIcon,
  MessageSquareIcon,
  UsersIcon,
  DotIcon,
  ChevronLeftIcon,
  CircleIcon,
  SearchIcon,
  MoreVerticalIcon,
  XIcon,
} from "./icons";
import { MOCK_MESSENGER_USERS, BOT_AVATAR_URL } from "../constants";
import { generateBotResponse } from "../services/geminiService";
import { useNavigate } from "react-router-dom";
import {
  realtimeMessaging,
  type RealTimeEvent,
  type UserPresence,
} from "../services/realtimeMessagingService";

interface MessengerChatViewProps {
  chat: MessengerChat | null;
  currentUser: User | null;
  onSendMessage: (
    chatId: string,
    messageText: string,
    type: "text" | "image" | "voice" | "doc",
  ) => void;
  isLoading: boolean;
  isMobileView: boolean;
  allMessages: MessengerMessage[];
}

const getLastSeenDisplay = (lastSeenValue?: string | Date): string => {
  if (typeof lastSeenValue === "string") {
    return lastSeenValue; // "Online" or "2 hours ago"
  }
  if (lastSeenValue instanceof Date) {
    const now = new Date();
    const diffMs = now.getTime() - lastSeenValue.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return "Last seen just now";
    if (diffMins < 60) return `Last seen ${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `Last seen ${diffHours}h ago`;
    return `Last seen ${lastSeenValue.toLocaleDateString([], { month: "short", day: "numeric" })}`;
  }
  return "Offline";
};

export const MessengerChatView: React.FC<MessengerChatViewProps> = ({
  chat,
  currentUser,
  onSendMessage,
  isLoading,
  isMobileView,
  allMessages,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessengerMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [userPresences, setUserPresences] = useState<Map<string, UserPresence>>(
    new Map(),
  );
  const [lastSeenStatus, setLastSeenStatus] = useState<string>("Offline");

  // Subscribe to real-time events
  useEffect(() => {
    const unsubscribeTyping = realtimeMessaging.subscribe(
      "user_typing",
      (event: RealTimeEvent) => {
        if (event.type === "user_typing" && chat?.id === event.data.chatId) {
          const user = MOCK_MESSENGER_USERS.find(
            (u) => u.id === event.data.userId,
          );
          if (user && event.data.userId !== currentUser?.id) {
            setTypingUsers((prev) => {
              const filtered = prev.filter(
                (t) => t.userId !== event.data.userId,
              );
              if (event.data.isTyping) {
                return [
                  ...filtered,
                  { userId: event.data.userId, userName: user.name },
                ];
              }
              return filtered;
            });
          }
        }
      },
    );

    const unsubscribePresence = realtimeMessaging.subscribe(
      "user_presence",
      (event: RealTimeEvent) => {
        if (event.type === "user_presence") {
          setUserPresences((prev) => {
            const newMap = new Map(prev);
            newMap.set(event.data.userId, event.data);
            return newMap;
          });
        }
      },
    );

    return () => {
      unsubscribeTyping();
      unsubscribePresence();
    };
  }, [chat?.id, currentUser?.id]);

  useEffect(() => {
    if (chat) {
      // Filter messages for the current chat from the passed 'allMessages' prop
      const chatMessages = allMessages
        .filter((m) => m.chatId === chat.id)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(chatMessages);
    } else {
      setMessages([]);
    }
  }, [chat, allMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update online status based on real-time presence
  useEffect(() => {
    if (chat?.type === "private") {
      const otherParticipant = chat.participants.find(
        (p) => p.id !== currentUser?.id,
      );
      if (otherParticipant) {
        const presence = userPresences.get(otherParticipant.id);
        if (presence) {
          if (presence.isOnline) {
            setLastSeenStatus("Online");
          } else {
            setLastSeenStatus(getLastSeenDisplay(presence.lastSeen));
          }
        } else {
          // Fallback to participant's initial status
          setLastSeenStatus(
            otherParticipant.isOnline
              ? "Online"
              : getLastSeenDisplay(otherParticipant.lastSeen),
          );
        }
      }
    } else if (chat?.type === "ai") {
      setLastSeenStatus("Online");
    } else if (chat?.type === "group") {
      const onlineCount = chat.participants.filter((p) => {
        const presence = userPresences.get(p.id);
        return presence ? presence.isOnline : p.isOnline;
      }).length;
      setLastSeenStatus(`${onlineCount} of ${chat.participants.length} online`);
    }
  }, [chat, currentUser?.id, userPresences]);

  // AI response generation
  const handleAIMessage = async (chatId: string, userMessageText: string) => {
    if (!currentUser || !chat || chat.type !== "ai") return;

    const aiLogicUser = MOCK_MESSENGER_USERS.find((u) => u.id === "giit-ai");
    if (!aiLogicUser) return;

    const historyForGemini: BotChatMessage[] = messages
      .filter(
        (m) => m.senderId === currentUser.id || m.senderId === aiLogicUser.id,
      )
      .map((m) => ({
        id: m.id,
        text: m.text || "",
        sender: m.senderId === currentUser.id ? "user" : "bot",
        timestamp: m.timestamp,
      }));

    try {
      const { text: botText } = await generateBotResponse(
        userMessageText,
        historyForGemini,
      );
      onSendMessage(chatId, botText, "text");
    } catch (error) {
      console.error("AI response error:", error);
      onSendMessage(
        chatId,
        "Sorry, I couldn't process that. Please try again.",
        "text",
      );
    }
  };

  const navigate = useNavigate();

  if (!chat && isMobileView) {
    return null;
  }

  const otherParticipant =
    chat?.type === "private"
      ? chat.participants.find((p) => p.id !== currentUser?.id)
      : null;
  const chatName =
    chat?.type === "group"
      ? chat.name
      : chat?.type === "ai"
        ? chat.name
        : otherParticipant?.name;
  const chatAvatar =
    chat?.avatarUrl || otherParticipant?.avatarUrl || BOT_AVATAR_URL;

  // Enhanced presence indicator
  const getPresenceIndicator = () => {
    if (chat?.type === "ai") {
      return <CircleIcon className="w-3 h-3 text-green-500 fill-green-500" />;
    }
    if (chat?.type === "private" && otherParticipant) {
      const presence = userPresences.get(otherParticipant.id);
      const isOnline = presence ? presence.isOnline : otherParticipant.isOnline;
      return (
        <CircleIcon
          className={`w-3 h-3 ${isOnline ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400"}`}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      {chat ? (
        <>
          <header className="p-3.5 border-b border-brand-border/50 flex items-center justify-between bg-brand-surface shadow-sm">
            <div className="flex items-center">
              {isMobileView && (
                <button
                  onClick={() => navigate("/messenger")}
                  className="mr-2 p-1.5 text-brand-text-muted hover:text-brand-text rounded-full hover:bg-brand-surface-alt transition-colors"
                  aria-label="Back to chat list"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              )}
              <img
                src={chatAvatar}
                alt={chatName}
                className="w-9 h-9 rounded-full object-cover border-2 border-brand-border/40"
              />
              <div className="ml-2.5">
                <div className="flex items-center gap-1.5">
                  <h2
                    className="text-sm sm:text-md font-semibold text-brand-text truncate"
                    title={chatName}
                  >
                    {chatName}
                  </h2>
                  {getPresenceIndicator()}
                </div>
                <div className="flex items-center gap-1 text-xs text-brand-text-muted">
                  {typingUsers.length > 0 && chat?.type !== "ai" ? (
                    <span className="text-brand-cyan animate-pulse">
                      {typingUsers.length === 1
                        ? `${typingUsers[0].userName} is typing...`
                        : `${typingUsers.length} people are typing...`}
                    </span>
                  ) : (
                    <span>{lastSeenStatus}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                title="Voice Call (TBD)"
                className="p-2 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-surface-alt transition-colors"
                aria-label="Start voice call"
              >
                <PhoneIcon className="w-5 h-5" />
              </button>
              <button
                title="Video Call (TBD)"
                className="p-2 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-surface-alt transition-colors"
                aria-label="Start video call"
              >
                <VideoCallIcon className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            {messages.map((msg) => (
              <MessengerMessageDisplay
                key={msg.id}
                message={msg}
                currentUserId={currentUser?.id || null}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="flex items-end gap-2">
                  <img
                    src={BOT_AVATAR_URL}
                    alt="bot avatar"
                    className="w-6 h-6 rounded-full border-2 border-brand-surface object-cover"
                  />
                  <div className="px-3 py-1.5 rounded-xl shadow-lg bg-brand-surface-alt">
                    <DotIcon className="w-5 h-5 text-brand-text-muted animate-pulse" />
                  </div>
                </div>
              </div>
            )}
            {typingUsers.map((typingUser) => (
              <div key={typingUser.userId} className="flex justify-start mb-3">
                <div className="flex items-end gap-2">
                  <img
                    src={
                      MOCK_MESSENGER_USERS.find(
                        (u) => u.id === typingUser.userId,
                      )?.avatarUrl || BOT_AVATAR_URL
                    }
                    alt="typing user avatar"
                    className="w-6 h-6 rounded-full border-2 border-brand-surface object-cover"
                  />
                  <div className="px-3 py-2 rounded-xl shadow-lg bg-brand-surface-alt">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-brand-text-muted">
                        {typingUser.userName} is typing
                      </span>
                      <div className="flex gap-0.5">
                        <div
                          className="w-1 h-1 bg-brand-text-muted rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-brand-text-muted rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-brand-text-muted rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <MessengerInput
            onSendMessage={(messageText, type) => {
              onSendMessage(chat.id, messageText, type);
              if (chat.type === "ai") {
                setTimeout(
                  async () => {
                    await handleAIMessage(chat.id, messageText);
                  },
                  500 + Math.random() * 1000,
                );
              }
            }}
            isLoading={isLoading}
            currentUser={currentUser}
            isChatActive={!!chat}
            chatId={chat?.id}
            onTyping={(isTyping) => {
              // This is handled internally by MessengerInput
            }}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <MessageSquareIcon className="w-16 h-16 text-brand-text-darker mb-4" />
          <p className="text-xl font-semibold text-brand-text">Select a chat</p>
          <p className="text-brand-text-muted">
            Or start a new conversation to begin messaging.
          </p>
        </div>
      )}
    </div>
  );
};
