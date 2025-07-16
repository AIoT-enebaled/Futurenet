import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SendIcon,
  MicIcon,
  PaperclipIcon,
  SmileIcon,
  ImageIcon,
} from "./icons";
import { User } from "../types";
import { realtimeMessaging } from "../services/realtimeMessagingService";

interface MessengerInputProps {
  onSendMessage: (
    messageText: string,
    type: "text" | "image" | "voice" | "doc",
  ) => void;
  isLoading: boolean;
  currentUser: User | null;
  isChatActive: boolean;
  chatId?: string;
  onTyping?: (isTyping: boolean) => void;
}

const MessengerInput: React.FC<MessengerInputProps> = ({
  onSendMessage,
  isLoading,
  currentUser,
  isChatActive,
  chatId,
  onTyping,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canInteract = !!currentUser && isChatActive;

  // Handle typing indicators
  const handleTyping = useCallback(() => {
    if (!currentUser?.id || !chatId) return;

    realtimeMessaging.setTyping(currentUser.id, chatId, true);
    onTyping?.(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      realtimeMessaging.setTyping(currentUser.id, chatId, false);
      onTyping?.(false);
    }, 2000);
  }, [currentUser?.id, chatId, onTyping]);

  // Stop typing on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (currentUser?.id && chatId) {
        realtimeMessaging.setTyping(currentUser.id, chatId, false);
      }
    };
  }, [currentUser?.id, chatId]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (inputValue.trim() && !isLoading && canInteract) {
        onSendMessage(inputValue.trim(), "text");
        setInputValue("");

        // Stop typing indicator
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        if (currentUser?.id && chatId) {
          realtimeMessaging.setTyping(currentUser.id, chatId, false);
          onTyping?.(false);
        }
      }
    },
    [
      inputValue,
      isLoading,
      onSendMessage,
      canInteract,
      currentUser?.id,
      chatId,
      onTyping,
    ],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Trigger typing indicator if user is typing
    if (value.trim() && canInteract) {
      handleTyping();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canInteract || isLoading) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (file.type.startsWith("image/")) {
        onSendMessage(reader.result as string, "image");
      } else {
        // For documents, we'd upload to a server and get a URL
        onSendMessage(`[File: ${file.name}]`, "doc");
      }
    };

    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }

    // Reset input
    e.target.value = "";
  };

  const handleVoiceRecord = () => {
    if (!canInteract || isLoading) return;

    if (!isRecording) {
      setIsRecording(true);
      // Mock voice recording - in real app, you'd use MediaRecorder API
      setTimeout(() => {
        setIsRecording(false);
        onSendMessage("[Voice message]", "voice");
      }, 2000);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
    handleTyping();
  };

  const commonEmojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "👎",
    "😢",
    "😮",
    "😡",
    "🎉",
    "🔥",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-brand-surface border-t border-brand-border/50"
    >
      <div className="flex items-end bg-brand-bg rounded-xl p-1.5 shadow-lg border border-brand-border/50 focus-within:ring-2 focus-within:ring-brand-purple transition-all">
        <div className="relative">
          <button
            type="button"
            title="Add emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 rounded-full text-brand-text-muted hover:text-brand-cyan hover:bg-brand-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!canInteract || isLoading}
            aria-label="Add emoji"
          >
            <SmileIcon className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 bg-brand-surface border border-brand-border rounded-lg p-2 shadow-lg z-10">
              <div className="grid grid-cols-5 gap-1">
                {commonEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className="p-1 hover:bg-brand-surface-alt rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          title="Attach file"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-full text-brand-text-muted hover:text-brand-cyan hover:bg-brand-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!canInteract || isLoading}
          aria-label="Attach file"
        >
          <PaperclipIcon className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // Stop typing when focus is lost
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            if (currentUser?.id && chatId) {
              realtimeMessaging.setTyping(currentUser.id, chatId, false);
              onTyping?.(false);
            }
          }}
          placeholder={
            !isChatActive
              ? "Select a chat to start messaging"
              : canInteract
                ? "Type a message..."
                : "Please log in to send messages."
          }
          className="flex-grow p-2.5 bg-transparent text-brand-text placeholder-brand-text-muted focus:outline-none resize-none max-h-24 text-sm scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent"
          rows={1}
          disabled={!canInteract || isLoading}
          style={{ caretColor: "var(--tw-color-brand-purple)" }}
          aria-label="Message input"
        />
        {inputValue.trim() ? (
          <button
            type="submit"
            disabled={!canInteract || isLoading || !inputValue.trim()}
            className="p-2.5 rounded-full text-brand-purple hover:text-brand-pink disabled:text-brand-text-darker disabled:cursor-not-allowed transition-colors duration-200 transform hover:scale-110 active:scale-100"
            title="Send message"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            title={isRecording ? "Recording..." : "Record voice note"}
            onClick={handleVoiceRecord}
            className={`p-2.5 rounded-full transition-colors duration-200 transform hover:scale-110 active:scale-100 ${
              isRecording
                ? "text-red-500 bg-red-100 animate-pulse"
                : "text-brand-purple hover:text-brand-pink disabled:text-brand-text-darker disabled:cursor-not-allowed"
            }`}
            disabled={!canInteract || isLoading}
            aria-label={
              isRecording ? "Recording voice note" : "Record voice note"
            }
          >
            <MicIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default MessengerInput;
