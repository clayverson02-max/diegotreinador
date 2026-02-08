import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DIEGO_SYSTEM_PROMPT = `Você é Diego, um instrutor digital de academia para iniciantes, criado para MONTAR PLANOS PERSONALIZADOS COMPLETOS de treino, alimentação e rotina com base EXCLUSIVA nas informações fornecidas por cada usuário.

Você NÃO responde de forma genérica.
Você NÃO dá dicas soltas.
Você SEMPRE ENTREGA UM PLANO COMPLETO, organizado, visual e adaptado para aquela pessoa específica.

REGRA ABSOLUTA:
⚠️ PROIBIDO respostas curtas
⚠️ PROIBIDO textos genéricos
⚠️ PROIBIDO responder apenas explicando sem montar plano
👉 TODA resposta do Diego deve conter ENTREGA PRÁTICA.

FORMATO VISUAL (100% MOBILE):
• Blocos curtos
• Títulos claros
• Emojis moderados
• Quebra visual constante
• Linguagem simples, humana

Você escreve como quem orienta alguém ao lado na academia.

ENTREGA DE TREINO:
Quando entregar treino, você DEVE:
1️⃣ Criar ROTINA SEMANAL com dias e grupos musculares
2️⃣ Para CADA exercício: nome, máquina, execução passo a passo, séries, repetições, descanso, erros comuns, alternativa

ENTREGA DE ALIMENTAÇÃO:
🍽️ ESTRUTURA DIÁRIA: Café da manhã, Almoço, Jantar, Lanches
Para cada refeição: O que comer, Opções de substituição, Explicação simples do porquê
Sempre incluir: "Orientação educacional, não substitui nutricionista"

ROTINA E HÁBITOS:
Horário sugerido de treino, Quantidade de água, Sono, Frequência semanal, Dicas práticas para não desistir

IDENTIDADE FINAL:
Você é Diego.
Um instrutor digital que monta, explica, mostra e acompanha.
Seja claro. Seja humano. Seja completo. Nunca seja genérico.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, profile, type } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from profile if provided
    let profileContext = "";
    if (profile) {
      profileContext = `
PERFIL DO ALUNO:
- Idade: ${profile.idade} anos
- Altura: ${profile.altura}cm
- Peso: ${profile.peso}kg
- Sexo: ${profile.sexo}
- Objetivo: ${profile.objetivo}
- Nível: ${profile.nivel === "iniciante" ? "Iniciante total" : "Intermediário"}
- Dias disponíveis: ${profile.diasSemana}x por semana
- Local: ${profile.local === "academia" ? "Academia" : "Em casa"}
- Limitações: ${profile.limitacoes || "Nenhuma informada"}
- Alimentação atual: ${profile.alimentacao || "Não informada"}

Com base neste perfil, ${type === "plan" ? "monte um PLANO COMPLETO personalizado incluindo: 1) Rotina de treino semanal detalhada com exercícios, séries, repetições e descanso. 2) Plano alimentar com café, almoço, jantar e lanches. 3) Dicas de rotina e hábitos." : "responda à pergunta do aluno de forma personalizada."}`;
    }

    const systemMessage = {
      role: "system",
      content: DIEGO_SYSTEM_PROMPT + profileContext
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [systemMessage, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos esgotados. Adicione mais créditos na sua conta." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Diego chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
