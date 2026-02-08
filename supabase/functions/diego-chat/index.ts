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

INTELIGÊNCIA DE DIVISÃO DE TREINO:
Baseado no número de dias disponíveis, divida o treino de forma INTELIGENTE:
- 1 dia: Full Body (corpo todo)
- 2 dias: Superior/Inferior ou Push/Pull
- 3 dias: ABC (Push/Pull/Legs ou divisão clássica)
- 4 dias: ABCD (Peito+Tríceps / Costas+Bíceps / Ombros+Core / Pernas)
- 5 dias: ABCDE (um grupo muscular principal por dia)
- 6 dias: PPL 2x (Push/Pull/Legs repetido)

IMPORTANTE: Monte o treino APENAS para os dias específicos informados pelo usuário.
Se o usuário selecionou Segunda, Quarta e Sexta, monte treino APENAS para esses dias.
Defina um OBJETIVO CLARO para cada dia baseado na divisão inteligente.

ESTRUTURA OBRIGATÓRIA PARA TREINOS:
Quando entregar treino, você DEVE usar EXATAMENTE este formato:

## 📅 ROTINA DE TREINO DA SEMANA

### Segunda-feira
**Peito e Tríceps** (Objetivo: Força e hipertrofia da parte superior frontal)

🏋️ **Exercício 1: Supino reto com halteres**
📍 Máquina: Banco reto + par de halteres
🧠 Execução:
• Deite no banco com os pés apoiados no chão
• Segure os halteres na altura do peito
• Empurre para cima até estender os braços
• Desça controladamente
🔁 Séries: 3x12
⏱️ Descanso: 60 segundos
⚠️ Erro comum: Arquear demais as costas
🔄 Alternativa: Flexão de braços no chão

(Repita este formato para cada exercício - mínimo 4 exercícios por dia)

---

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
      // Map day codes to full names
      const dayNames: Record<string, string> = {
        segunda: "Segunda-feira",
        terca: "Terça-feira",
        quarta: "Quarta-feira",
        quinta: "Quinta-feira",
        sexta: "Sexta-feira",
        sabado: "Sábado",
        domingo: "Domingo",
      };
      
      const diasEspecificos = profile.diasEspecificos || [];
      const diasFormatados = diasEspecificos.map((d: string) => dayNames[d] || d).join(", ");
      const numDias = diasEspecificos.length || parseInt(profile.diasSemana) || 3;
      
      profileContext = `

PERFIL DO ALUNO:
- Idade: ${profile.idade} anos
- Altura: ${profile.altura}cm
- Peso: ${profile.peso}kg
- Sexo: ${profile.sexo}
- Objetivo principal: ${profile.objetivo}
- Nível: ${profile.nivel === "iniciante" ? "Iniciante total" : "Intermediário"}
- DIAS ESPECÍFICOS SELECIONADOS: ${diasFormatados || profile.diasSemana + "x por semana"}
- Quantidade de dias: ${numDias}
- Local: ${profile.local === "academia" ? "Academia" : "Em casa"}
- Limitações: ${profile.limitacoes || "Nenhuma informada"}
- Alimentação atual: ${profile.alimentacao || "Não informada"}

INSTRUÇÕES ESPECIAIS:
1. Monte treino APENAS para os dias: ${diasFormatados}
2. Use a divisão inteligente baseada em ${numDias} dia(s) disponível(is)
3. Defina um OBJETIVO ESPECÍFICO para cada dia (ex: "Força de pernas", "Hipertrofia de peito")
4. Adapte os exercícios para ${profile.local === "academia" ? "equipamentos de academia" : "exercícios em casa com pouco ou nenhum equipamento"}
${profile.limitacoes ? `5. IMPORTANTE: Evite exercícios que possam agravar: ${profile.limitacoes}` : ""}

${type === "plan" ? "Monte um PLANO COMPLETO personalizado incluindo: 1) Rotina de treino semanal detalhada APENAS para os dias selecionados, com exercícios usando o formato estruturado obrigatório e OBJETIVO claro por dia. 2) Plano alimentar com café, almoço, jantar e lanches. 3) Dicas de rotina e hábitos." : "Responda à pergunta do aluno de forma personalizada."}`
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
