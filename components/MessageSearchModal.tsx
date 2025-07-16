import React, { useState, useEffect, useMemo } from "react";
import { MessengerMessage, MessengerChat } from "../types";
import { SearchIcon, XIcon, ClockIcon, UserIcon } from "./icons";
import { MOCK_MESSENGER_USERS } from "../constants";

interface MessageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allMessages: MessengerMessage[];
  chats: MessengerChat[];
  onSelectMessage: (chatId: string, messageId: string) => void;
  currentUserId: string | null;
}

interface SearchResult {
  message: MessengerMessage;
  chat: MessengerChat;
  matchedText: string;
}

const MessageSearchModal: React.FC<MessageSearchModalProps> = ({
  isOpen,
  onClose,
  allMessages,
  chats,
  onSelectMessage,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMessages = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    allMessages.forEach((message) => {
      if (message.text && message.text.toLowerCase().includes(query)) {
        const chat = chats.find((c) => c.id === message.chatId);
        if (chat) {
          // Highlight matched text
          const text = message.text;
          const startIndex = text.toLowerCase().indexOf(query);
          const endIndex = startIndex + query.length;
          const beforeMatch = text.substring(0, startIndex);
          const match = text.substring(startIndex, endIndex);
          const afterMatch = text.substring(endIndex);

          results.push({
            message,
            chat,
            matchedText: `${beforeMatch}<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">${match}</mark>${afterMatch}`,
          });
        }
      }
    });

    // Sort by timestamp (newest first)
    return results.sort(
      (a, b) => b.message.timestamp.getTime() - a.message.timestamp.getTime(),
    );
  }, [searchQuery, allMessages, chats]);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchResults(searchMessages);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchMessages]);

  const getSenderName = (senderId: string) => {
    const user = MOCK_MESSENGER_USERS.find((u) => u.id === senderId);
    return user?.name || "Unknown User";
  };

  const getChatName = (chat: MessengerChat) => {
    if (chat.type === "group" || chat.type === "ai") {
      return chat.name || "Unnamed Chat";
    }
    const otherParticipant = chat.participants.find(
      (p) => p.id !== currentUserId,
    );
    return otherParticipant?.name || "Unknown Chat";
  };

  const handleSelectMessage = (result: SearchResult) => {
    onSelectMessage(result.chat.id, result.message.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-border">
          <h2 className="text-lg font-semibold text-brand-text">
            Search Messages
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-brand-text-muted hover:text-brand-text rounded-full hover:bg-brand-surface-alt transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-brand-border">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text placeholder-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
            </div>
          ) : searchQuery.trim() === "" ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <SearchIcon className="w-12 h-12 text-brand-text-muted mb-4" />
              <h3 className="text-lg font-medium text-brand-text mb-2">
                Search Messages
              </h3>
              <p className="text-brand-text-muted">
                Start typing to search through your message history
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <SearchIcon className="w-12 h-12 text-brand-text-muted mb-4" />
              <h3 className="text-lg font-medium text-brand-text mb-2">
                No Results Found
              </h3>
              <p className="text-brand-text-muted">
                No messages match your search query
              </p>
            </div>
          ) : (
            <div className="p-2">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.message.id}-${index}`}
                  onClick={() => handleSelectMessage(result)}
                  className="w-full p-3 rounded-lg hover:bg-brand-surface-alt transition-colors text-left border border-transparent hover:border-brand-border/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <UserIcon className="w-8 h-8 text-brand-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-brand-text text-sm">
                          {getSenderName(result.message.senderId)}
                        </span>
                        <span className="text-brand-text-muted text-xs">
                          in
                        </span>
                        <span className="font-medium text-brand-cyan text-sm">
                          {getChatName(result.chat)}
                        </span>
                      </div>
                      <div
                        className="text-sm text-brand-text-muted line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: result.matchedText }}
                      />
                      <div className="flex items-center gap-1 mt-2 text-xs text-brand-text-darker">
                        <ClockIcon className="w-3 h-3" />
                        <span>
                          {result.message.timestamp.toLocaleDateString()} at{" "}
                          {result.message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="p-4 border-t border-brand-border">
            <p className="text-sm text-brand-text-muted text-center">
              Found {searchResults.length} message
              {searchResults.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSearchModal;
