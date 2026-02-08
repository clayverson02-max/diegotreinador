import { useState, useRef, useEffect } from "react";
import { Message, UserProfile, WorkoutDay, DailyMealPlan, RoutineTips } from "@/types/diego";
import { ChatMessage } from "./ChatMessage";
import { WorkoutDayCard } from "./WorkoutDayCard";
import { MealCard } from "./MealCard";
import { DiegoAvatar } from "./DiegoAvatar";
import { Send, Sparkles } from "lucide-react";
import { generatePersonalizedPlan } from "@/lib/diegoEngine";

interface ChatInterfaceProps {
  profile: UserProfile;
}

export const ChatInterface = ({ profile }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [plan, setPlan] = useState<{
    workout: WorkoutDay[];
    meals: DailyMealPlan;
    routine: RoutineTips;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting and plan generation
    const generatePlan = async () => {
      setIsTyping(true);
      
      // Simulate Diego analyzing the profile
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const generatedPlan = generatePersonalizedPlan(profile);
      setPlan(generatedPlan);

      const greetingMessage: Message = {
        id: "1",
        role: "diego",
        content: `Fala! 👋 Sou o **Diego**, seu instrutor digital.

Analisei seu perfil:
📊 ${profile.idade} anos, ${profile.altura}cm, ${profile.peso}kg
🎯 Objetivo: **${profile.objetivo}**
📍 Treino: ${profile.local === "academia" ? "Academia" : "Em casa"}, ${profile.diasSemana}x por semana
💪 Nível: ${profile.nivel === "iniciante" ? "Iniciante" : "Intermediário"}
${profile.limitacoes ? `⚠️ Limitações: ${profile.limitacoes}` : ""}

Montei seu plano completo! Veja abaixo 👇`,
        timestamp: new Date(),
      };

      setMessages([greetingMessage]);
      setIsTyping(false);
      
      // Show plan after message
      setTimeout(() => setShowPlan(true), 500);
    };

    generatePlan();
  }, [profile]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate Diego response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const diegoResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "diego",
      content: getDiegoResponse(input, profile),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, diegoResponse]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Show plan cards */}
        {showPlan && plan && (
          <div className="space-y-8 mt-6">
            {/* Workout Section */}
            <div className="fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-primary" size={24} />
                <h2 className="font-display font-bold text-xl text-foreground">
                  📅 Sua Rotina de Treino
                </h2>
              </div>
              <div className="space-y-6">
                {plan.workout.map((day, index) => (
                  <WorkoutDayCard key={index} day={day} />
                ))}
              </div>
            </div>

            {/* Meals Section */}
            <div className="fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-primary" size={24} />
                <h2 className="font-display font-bold text-xl text-foreground">
                  🍽️ Plano Alimentar
                </h2>
              </div>
              <div className="space-y-4">
                <MealCard meal={plan.meals.cafeDaManha} />
                <MealCard meal={plan.meals.almoco} />
                <MealCard meal={plan.meals.jantar} />
                {plan.meals.lanches.map((lanche, index) => (
                  <MealCard key={index} meal={lanche} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                ⚠️ Orientação educacional. Não substitui acompanhamento com nutricionista.
              </p>
            </div>

            {/* Routine Tips */}
            <div className="fade-in diego-card">
              <h2 className="font-display font-bold text-xl text-foreground mb-4">
                ✨ Dicas de Rotina
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="stat-card">
                  <span className="text-2xl">⏰</span>
                  <p className="text-xs text-muted-foreground mt-1">Horário ideal</p>
                  <p className="font-semibold text-foreground">{plan.routine.horarioTreino}</p>
                </div>
                <div className="stat-card">
                  <span className="text-2xl">💧</span>
                  <p className="text-xs text-muted-foreground mt-1">Água por dia</p>
                  <p className="font-semibold text-foreground">{plan.routine.agua}</p>
                </div>
                <div className="stat-card">
                  <span className="text-2xl">😴</span>
                  <p className="text-xs text-muted-foreground mt-1">Sono</p>
                  <p className="font-semibold text-foreground">{plan.routine.sono}</p>
                </div>
                <div className="stat-card">
                  <span className="text-2xl">📆</span>
                  <p className="text-xs text-muted-foreground mt-1">Frequência</p>
                  <p className="font-semibold text-foreground">{plan.routine.frequencia}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">💪 Dicas para não desistir:</p>
                <ul className="space-y-2">
                  {plan.routine.dicasMotivacao.map((dica, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      {dica}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {isTyping && (
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
            placeholder="Tem alguma dúvida? Pergunte ao Diego..."
            className="diego-input flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="diego-button-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

function getDiegoResponse(input: string, profile: UserProfile): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("dor") || lowerInput.includes("machuc")) {
    return `⚠️ Sobre dores:

Se sentir dor durante algum exercício, **pare imediatamente**.

Dor muscular leve no dia seguinte (aquela "dorzinha boa") é normal para iniciantes.

Mas dor aguda, queimação forte ou desconforto nas articulações não é normal.

👉 Nesse caso, procure um profissional de saúde antes de continuar.

Posso adaptar algum exercício específico para você?`;
  }

  if (lowerInput.includes("troc") || lowerInput.includes("substitu")) {
    return `🔄 Quer trocar algum exercício?

Me fala qual exercício quer substituir que eu te passo uma alternativa.

Por exemplo:
"Diego, quero trocar o supino por outro"

Aí eu te explico um exercício equivalente!`;
  }

  if (lowerInput.includes("result") || lowerInput.includes("quanto tempo")) {
    return `📈 Sobre resultados:

Com consistência, você vai notar:

**2-4 semanas:** Mais disposição e energia
**4-8 semanas:** Roupas começam a caber diferente
**8-12 semanas:** Resultados visíveis no espelho

O segredo? **Consistência > Intensidade**

Treinar 3x por semana certinho é melhor que 6x uma semana e nenhuma na outra.

Bora manter o foco! 💪`;
  }

  return `💬 Entendi sua dúvida!

Posso te ajudar com:

• Trocar exercícios do plano
• Ajustar séries/repetições
• Tirar dúvidas sobre execução
• Adaptar a alimentação

Me conta com mais detalhes o que precisa! 😊`;
}
