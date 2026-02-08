import { Message } from "@/types/diego";
import { DiegoAvatar } from "./DiegoAvatar";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 fade-in ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && <DiegoAvatar size="sm" />}
      
      <div
        className={`max-w-[85%] ${
          isUser ? "diego-message-user" : "diego-message-diego"
        }`}
      >
        <div 
          className="text-sm leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
        />
      </div>
    </div>
  );
};

function formatMessage(content: string): string {
  // Convert markdown-like formatting
  let formatted = content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Emoji headers
    .replace(/^(📅|🏋️|🍽️|💪|⏱️|🔁|📍|🧠|⚠️|🔄|👉|✅|💧|😴|🎯)/gm, '<span class="text-lg">$1</span>')
    // Line breaks
    .replace(/\n/g, '<br />');
  
  return formatted;
}
