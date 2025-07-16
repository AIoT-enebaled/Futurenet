import React, { useState } from "react";
import { MessengerMessage, MessengerUser } from "../types";
import { MOCK_MESSENGER_USERS } from "../constants";
import {
  CheckCheckIcon,
  FileIcon,
  PlayCircleIcon,
  HeartIcon,
  ThumbsUpIcon,
  SmileIcon,
  ReplyIcon,
} from "./icons";
import {
  realtimeMessaging,
  type MessageReaction,
} from "../services/realtimeMessagingService";

interface MessengerMessageDisplayProps {
  message: MessengerMessage & {
    reactions?: MessageReaction[];
    replyToMessageId?: string;
  };
  currentUserId: string | null;
  onReply?: (messageId: string) => void;
}

const MessengerMessageDisplay: React.FC<MessengerMessageDisplayProps> = ({
  message,
  currentUserId,
  onReply,
}) => {
  const isCurrentUserSender = message.senderId === currentUserId;
  const [showReactions, setShowReactions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sender = MOCK_MESSENGER_USERS.find(
    (u) => u.id === message.senderId,
  ) || {
    name: "Unknown User",
    avatarUrl: `https://ui-avatars.com/api/?name=Unknown&background=random&color=fff&size=40`,
    id: message.senderId,
    isOnline: false,
  };

  const alignment = isCurrentUserSender ? "items-end" : "items-start";

  let bubbleColor;
  if (isCurrentUserSender) {
    bubbleColor =
      "bg-gradient-to-br from-brand-purple to-brand-pink text-white";
  } else if (message.isAIMessage) {
    bubbleColor =
      "bg-gradient-to-br from-brand-cyan to-brand-purple text-white";
  } else {
    bubbleColor = "bg-brand-surface-alt text-brand-text";
  }

  const bubbleRounded = isCurrentUserSender
    ? "rounded-tr-none"
    : "rounded-tl-none";

  const handleReaction = (emoji: string) => {
    if (currentUserId && message.chatId) {
      const existingReaction = message.reactions?.find(
        (r) => r.emoji === emoji,
      );
      const userHasReacted = existingReaction?.users.includes(currentUserId);

      if (userHasReacted) {
        realtimeMessaging.removeReaction(
          message.id,
          message.chatId,
          emoji,
          currentUserId,
        );
      } else {
        realtimeMessaging.addReaction(
          message.id,
          message.chatId,
          emoji,
          currentUserId,
        );
      }
    }
    setShowReactions(false);
  };

  const getReactionDisplay = () => {
    if (!message.reactions?.length) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {message.reactions.map((reaction, index) => (
          <button
            key={index}
            onClick={() => handleReaction(reaction.emoji)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              reaction.users.includes(currentUserId || "")
                ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30"
                : "bg-brand-surface-alt text-brand-text-muted hover:bg-brand-surface border border-brand-border/30"
            }`}
            title={`${reaction.users.length} reaction${reaction.users.length !== 1 ? "s" : ""}`}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderMessageContent = () => {
    if (message.imageUrl) {
      return (
        <img
          src={message.imageUrl}
          alt="Sent image"
          className="max-w-[200px] sm:max-w-xs rounded-md my-1 max-h-60 object-contain border border-black/10"
        />
      );
    }
    if (message.videoUrl) {
      return (
        <p className="text-xs italic">[Mock Video: A cool tech demo.mp4]</p>
      );
    }
    if (message.audioUrl) {
      return (
        <div
          className={`flex items-center space-x-2 p-2 ${isCurrentUserSender ? "bg-white/10" : "bg-brand-bg/50"} rounded-md`}
        >
          <PlayCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-current opacity-80" />
          <span className="text-xs">Voice Note (0:15)</span>
        </div>
      );
    }
    if (message.docUrl) {
      return (
        <a
          href={message.docUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center space-x-2 p-2 ${isCurrentUserSender ? "bg-white/10" : "bg-brand-bg/50"} rounded-md hover:brightness-110 transition-all`}
        >
          <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-current opacity-80" />
          <span className="text-xs underline">
            {message.docName || "Shared_Document.pdf"}
          </span>
        </a>
      );
    }
    return (
      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
    );
  };

  return (
    <div
      className={`flex flex-col w-full mb-3 ${alignment} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowReactions(false);
      }}
    >
      <div
        className={`flex items-end gap-2 ${isCurrentUserSender ? "flex-row-reverse" : "flex-row"} max-w-[75%] sm:max-w-[70%] relative`}
      >
        {(!isCurrentUserSender || message.isAIMessage) && (
          <img
            src={sender.avatarUrl}
            alt={sender.name}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover self-end flex-shrink-0 border-2 border-brand-surface"
          />
        )}
        <div
          className={`px-3.5 py-2 rounded-xl shadow-md ${bubbleColor} ${bubbleRounded} relative`}
        >
          {!isCurrentUserSender && !message.isAIMessage && (
            <p className="text-xs font-semibold mb-0.5 text-brand-cyan">
              {sender.name}
            </p>
          )}
          {renderMessageContent()}

          {/* Reaction button overlay */}
          {isHovered && (
            <div
              className={`absolute ${isCurrentUserSender ? "-left-8" : "-right-8"} top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1 bg-brand-surface border border-brand-border rounded-full shadow-lg hover:bg-brand-surface-alt transition-colors"
                title="Add reaction"
              >
                <SmileIcon className="w-4 h-4 text-brand-text-muted" />
              </button>
              {onReply && (
                <button
                  onClick={() => onReply(message.id)}
                  className="p-1 bg-brand-surface border border-brand-border rounded-full shadow-lg hover:bg-brand-surface-alt transition-colors"
                  title="Reply"
                >
                  <ReplyIcon className="w-4 h-4 text-brand-text-muted" />
                </button>
              )}
            </div>
          )}

          {/* Quick reaction picker */}
          {showReactions && (
            <div
              className={`absolute ${isCurrentUserSender ? "-left-16" : "-right-16"} -top-2 bg-brand-surface border border-brand-border rounded-lg p-2 shadow-xl z-10`}
            >
              <div className="flex gap-1">
                {["❤️", "👍", "😂", "😮", "😢", "🔥"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="p-1 hover:bg-brand-surface-alt rounded transition-colors text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reactions display */}
      {getReactionDisplay()}

      {/* Timestamp and status */}
      <div
        className={`mt-1 text-xs flex items-center ${isCurrentUserSender ? "justify-end pr-1" : `justify-start ${message.isAIMessage ? "ml-8 sm:ml-9" : "ml-8 sm:ml-9"}`}`}
      >
        <span
          className={`${isCurrentUserSender ? "text-white/70" : "text-brand-text-darker"}`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isCurrentUserSender && message.status && (
          <div
            className="flex items-center ml-1"
            title={`Message ${message.status}`}
          >
            <CheckCheckIcon
              className={`w-4 h-4 ${
                message.status === "read"
                  ? "text-brand-cyan"
                  : message.status === "delivered"
                    ? "text-white/60"
                    : message.status === "sent"
                      ? "text-white/40"
                      : "text-white/20"
              }`}
            />
            {message.status === "sending" && (
              <div className="w-2 h-2 ml-1 bg-white/40 rounded-full animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessengerMessageDisplay;
