export interface ParsedWorkoutDay {
  dayName: string;
  muscleGroup: string;
  exercises: {
    name: string;
    equipment: string;
    steps: string[];
    sets: string;
    reps: string;
    rest: string;
    commonError: string;
    alternative: string;
  }[];
}

export function parseWorkoutPlan(content: string): ParsedWorkoutDay[] | null {
  const days: ParsedWorkoutDay[] = [];
  
  // Try to find day patterns like "Segunda-feira", "Terça-feira", "Dia 1", etc.
  const dayPatterns = [
    /(?:📅\s*)?(?:ROTINA DE TREINO[^\n]*\n+)?((?:Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)(?:-feira)?)\s*[:\n]/gi,
    /(?:📅\s*)?(Dia\s*\d+)[:\n]/gi,
    /\*\*\s*((?:Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)(?:-feira)?)\s*\*\*/gi,
  ];
  
  // Split by day headers
  const sections = content.split(/(?=(?:📅|##|\*\*)\s*(?:Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo|Dia\s*\d))/i);
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    // Extract day name
    const dayMatch = section.match(/(?:📅\s*)?(?:\*\*\s*)?((?:Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)(?:-feira)?|Dia\s*\d+)/i);
    if (!dayMatch) continue;
    
    const dayName = dayMatch[1].trim();
    
    // Extract muscle group (usually after day name)
    const muscleMatch = section.match(/(?:📅[^\n]*\n)?\*?\*?\s*(?:Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo|Dia\s*\d+)[^\n]*\n+\s*(?:\*\*)?([^\n*]+?)(?:\*\*)?(?:\n|$)/i);
    const muscleGroup = muscleMatch?.[1]?.trim() || "Treino";
    
    // Find exercises in section
    const exerciseMatches = section.matchAll(/(?:🏋️|Exercício\s*\d+|\d+\.\s*)?\s*(?:\*\*)?\s*([^*\n:]+?)(?:\*\*)?\s*(?:\n|:)/gi);
    const exercises: ParsedWorkoutDay["exercises"] = [];
    
    // Look for exercise blocks
    const exerciseBlocks = section.split(/(?=(?:🏋️|Exercício\s*\d+|\*\*\s*Exercício))/i);
    
    for (const block of exerciseBlocks) {
      if (!block.trim()) continue;
      
      // Extract exercise name
      const nameMatch = block.match(/(?:🏋️|Exercício\s*\d+[:\s]*|\*\*\s*)?([^*\n📍🧠⚠️🔁⏱️🔄]+?)(?:\*\*)?(?:\n|$)/i);
      if (!nameMatch) continue;
      
      const name = nameMatch[1].trim();
      if (!name || name.length < 3) continue;
      
      // Extract equipment/machine
      const equipMatch = block.match(/(?:📍\s*Máquina[:\s]*|Equipamento[:\s]*)([^\n]+)/i);
      const equipment = equipMatch?.[1]?.trim() || "Peso corporal";
      
      // Extract execution steps
      const execMatch = block.match(/(?:🧠\s*Execução[:\s]*|Como executar[:\s]*)([^📍⚠️🔁⏱️🔄]+)/is);
      const stepsText = execMatch?.[1] || "";
      const steps = stepsText.split(/\n/).filter(s => s.trim()).map(s => s.replace(/^[\s•\-\d.]+/, "").trim()).filter(s => s);
      
      // Extract sets
      const setsMatch = block.match(/(?:🔁\s*)?(?:Séries?)[:\s]*(\d+[^\n]*)/i);
      const sets = setsMatch?.[1]?.trim() || "3x12";
      
      // Extract rest
      const restMatch = block.match(/(?:⏱️\s*)?(?:Descanso)[:\s]*([^\n]+)/i);
      const rest = restMatch?.[1]?.trim() || "60 segundos";
      
      // Extract common error
      const errorMatch = block.match(/(?:⚠️\s*)?(?:Erro comum)[:\s]*([^\n🔄]+)/i);
      const commonError = errorMatch?.[1]?.trim() || "Executar muito rápido";
      
      // Extract alternative
      const altMatch = block.match(/(?:🔄\s*)?(?:Alternativa|Não achou)[:\s]*([^\n]+)/i);
      const alternative = altMatch?.[1]?.trim() || "Versão com peso corporal";
      
      if (name && name.length > 3) {
        exercises.push({
          name,
          equipment,
          steps: steps.length > 0 ? steps : ["Execute o movimento de forma controlada"],
          sets,
          reps: sets,
          rest,
          commonError,
          alternative,
        });
      }
    }
    
    if (exercises.length > 0) {
      days.push({
        dayName,
        muscleGroup,
        exercises,
      });
    }
  }
  
  return days.length > 0 ? days : null;
}

export function hasWorkoutPlan(content: string): boolean {
  const workoutIndicators = [
    /rotina\s*(?:de\s*)?treino/i,
    /plano\s*de\s*treino/i,
    /treino\s*da\s*semana/i,
    /(?:segunda|terça|quarta|quinta|sexta)(?:-feira)?\s*[:\n]/i,
    /dia\s*\d+\s*[:\n-]/i,
    /exercício\s*\d+/i,
  ];
  
  return workoutIndicators.some(pattern => pattern.test(content));
}
