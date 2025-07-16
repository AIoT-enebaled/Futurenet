import React, { useEffect, useRef, useState, useMemo } from "react";
import { MessengerMessage } from "../types";
import MessengerMessageDisplay from "./MessengerMessageDisplay";

interface VirtualizedMessageListProps {
  messages: MessengerMessage[];
  currentUserId: string | null;
  onReply?: (messageId: string) => void;
  className?: string;
}

const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  currentUserId,
  onReply,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const [messageHeights, setMessageHeights] = useState<Map<string, number>>(
    new Map(),
  );
  const [containerHeight, setContainerHeight] = useState(0);

  const ESTIMATED_MESSAGE_HEIGHT = 80; // Estimated height per message
  const BUFFER_SIZE = 5; // Number of messages to render outside visible area

  // Calculate which messages should be visible
  const { visibleMessages, totalHeight, scrollTop } = useMemo(() => {
    const container = containerRef.current;
    if (!container || messages.length === 0) {
      return { visibleMessages: messages, totalHeight: 0, scrollTop: 0 };
    }

    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;

    let currentTop = 0;
    let startIndex = 0;
    let endIndex = messages.length - 1;

    // Find start index
    for (let i = 0; i < messages.length; i++) {
      const messageHeight =
        messageHeights.get(messages[i].id) || ESTIMATED_MESSAGE_HEIGHT;
      if (currentTop + messageHeight > scrollTop) {
        startIndex = Math.max(0, i - BUFFER_SIZE);
        break;
      }
      currentTop += messageHeight;
    }

    // Find end index
    currentTop = 0;
    for (let i = 0; i < messages.length; i++) {
      const messageHeight =
        messageHeights.get(messages[i].id) || ESTIMATED_MESSAGE_HEIGHT;
      currentTop += messageHeight;
      if (currentTop > scrollTop + viewportHeight) {
        endIndex = Math.min(messages.length - 1, i + BUFFER_SIZE);
        break;
      }
    }

    // Calculate total height
    const totalHeight = messages.reduce((sum, message) => {
      return sum + (messageHeights.get(message.id) || ESTIMATED_MESSAGE_HEIGHT);
    }, 0);

    // Calculate offset for visible messages
    let offsetTop = 0;
    for (let i = 0; i < startIndex; i++) {
      offsetTop +=
        messageHeights.get(messages[i].id) || ESTIMATED_MESSAGE_HEIGHT;
    }

    const visibleMessages = messages.slice(startIndex, endIndex + 1);

    return {
      visibleMessages: visibleMessages.map((message, index) => ({
        ...message,
        virtualIndex: startIndex + index,
        offsetTop:
          offsetTop +
          (index > 0
            ? visibleMessages
                .slice(0, index)
                .reduce(
                  (sum, msg) =>
                    sum +
                    (messageHeights.get(msg.id) || ESTIMATED_MESSAGE_HEIGHT),
                  0,
                )
            : 0),
      })),
      totalHeight,
      scrollTop: offsetTop,
    };
  }, [messages, messageHeights, containerHeight]);

  // Handle scroll events
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, clientHeight } = containerRef.current;
      setContainerHeight(clientHeight);

      // Throttle updates to improve performance
      requestAnimationFrame(() => {
        setVisibleRange({
          start: Math.floor(scrollTop / ESTIMATED_MESSAGE_HEIGHT),
          end: Math.ceil((scrollTop + clientHeight) / ESTIMATED_MESSAGE_HEIGHT),
        });
      });
    }
  };

  // Measure message heights after render
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const messageElements = container.querySelectorAll("[data-message-id]");
    const newHeights = new Map(messageHeights);
    let hasChanges = false;

    messageElements.forEach((element) => {
      const messageId = element.getAttribute("data-message-id");
      if (messageId) {
        const height = element.getBoundingClientRect().height;
        if (newHeights.get(messageId) !== height) {
          newHeights.set(messageId, height);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setMessageHeights(newHeights);
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = containerRef.current;
    if (container && messages.length > 0) {
      const isScrolledToBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;

      if (isScrolledToBottom) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 0);
      }
    }
  }, [messages.length]);

  // Initial setup
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setContainerHeight(container.clientHeight);
      container.scrollTop = container.scrollHeight; // Start at bottom
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent ${className}`}
      onScroll={handleScroll}
      style={{ height: "100%" }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-brand-text-muted">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div style={{ height: totalHeight, position: "relative" }}>
          {visibleMessages.map((message) => (
            <div
              key={message.id}
              data-message-id={message.id}
              style={{
                position: "absolute",
                top: (message as any).offsetTop,
                left: 0,
                right: 0,
              }}
            >
              <MessengerMessageDisplay
                message={message}
                currentUserId={currentUserId}
                onReply={onReply}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VirtualizedMessageList;
