import { useState, useRef, useEffect } from "react";
import { Message, UserProfile } from "@/types/diego";
import { ChatMessage } from "./ChatMessage";
import { DiegoAvatar } from "./DiegoAvatar";
import { Send } from "lucide-react";
import { streamDiegoChat } from "@/lib/diegoAI";
import { toast } from "sonner";

interface ChatInterfaceProps {
  profile: UserProfile;
}

export const ChatInterface = ({ profile }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate personalized plan on first load
    const generatePlan = async () => {
      setIsTyping(true);
      
      const greetingMessage: Message = {
        id: "1",
        role: "diego",
        content: "",
        timestamp: new Date(),
      };
      setMessages([greetingMessage]);

      let fullContent = "";

      await streamDiegoChat({
        messages: [{ role: "user", content: "Gere meu plano completo personalizado de treino, alimentação e rotina." }],
        profile,
        type: "plan",
        onDelta: (chunk) => {
          fullContent += chunk;
          setMessages([{
            ...greetingMessage,
            content: fullContent,
          }]);
        },
        onDone: () => {
          setIsTyping(false);
          setPlanGenerated(true);
        },
        onError: (error) => {
          setIsTyping(false);
          toast.error(error);
          setMessages([{
            ...greetingMessage,
            content: "Desculpe, tive um problema ao gerar seu plano. Tente novamente em alguns instantes.",
          }]);
        },
      });
    };

    generatePlan();
  }, [profile]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "diego",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    let fullContent = "";

    // Build conversation history
    const conversationHistory = messages.map(m => ({
      role: m.role === "diego" ? "assistant" : "user",
      content: m.content,
    }));
    conversationHistory.push({ role: "user", content: input });

    await streamDiegoChat({
      messages: conversationHistory,
      profile,
      type: "chat",
      onDelta: (chunk) => {
        fullContent += chunk;
        setMessages((prev) => 
          prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: fullContent } : m
          )
        );
      },
      onDone: () => {
        setIsTyping(false);
      },
      onError: (error) => {
        setIsTyping(false);
        toast.error(error);
        setMessages((prev) => 
          prev.map((m, i) => 
            i === prev.length - 1 
              ? { ...m, content: "Desculpe, tive um problema. Tente novamente." } 
              : m
          )
        );
      },
    });
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && messages[messages.length - 1]?.content === "" && (
          <div className="flex items-center gap-3">
            <DiegoAvatar size="sm" />
            <div className="diego-message-diego flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full pulse-animation" />
              <span className="w-2 h-2 bg-primary rounded-full pulse-animation" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-primary rounded-full pulse-animation" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={planGenerated ? "Tem alguma dúvida? Pergunte ao Diego..." : "Aguarde o plano ser gerado..."}
            disabled={!planGenerated || isTyping}
            className="diego-input flex-1 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !planGenerated}
            className="diego-button-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
