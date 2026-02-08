import { Message } from "@/types/diego";
import { DiegoAvatar } from "./DiegoAvatar";
import ReactMarkdown from "react-markdown";

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
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold text-foreground mt-4 mb-2 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold text-foreground mt-3 mb-1">{children}</h3>,
                p: ({ children }) => <p className="text-sm text-foreground/90 mb-2 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-none space-y-1 mb-3">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-sm">{children}</ol>,
                li: ({ children }) => (
                  <li className="text-sm text-foreground/90 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                em: ({ children }) => <em className="text-primary">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary pl-3 my-2 text-muted-foreground italic">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                ),
                hr: () => <hr className="border-border my-4" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
