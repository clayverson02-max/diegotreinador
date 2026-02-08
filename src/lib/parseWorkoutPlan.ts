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
  
  // More flexible day pattern matching
  // Matches: "Segunda-feira (Treino A)", "Terça-feira (Treino B)", "### Segunda-feira", etc.
  const dayRegex = /(?:#{1,3}\s*)?(?:\*\*)?(?:📅\s*)?(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)(?:-feira)?(?:\s*\((?:Treino\s*)?([A-Z]|[^)]+)\))?(?:\*\*)?/gi;
  
  // Find all day headers with their positions
  const dayMatches: { match: RegExpExecArray; index: number }[] = [];
  let match;
  while ((match = dayRegex.exec(content)) !== null) {
    dayMatches.push({ match, index: match.index });
  }
  
  if (dayMatches.length === 0) return null;
  
  // Extract content for each day
  for (let i = 0; i < dayMatches.length; i++) {
    const startIdx = dayMatches[i].index;
    const endIdx = i < dayMatches.length - 1 ? dayMatches[i + 1].index : content.length;
    const dayContent = content.slice(startIdx, endIdx);
    
    const dayName = dayMatches[i].match[1];
    
    // Extract muscle group - look for pattern after day name
    const muscleGroupMatch = dayContent.match(/(?:Treino\s*[A-Z]\)?\s*)?(?:\n|\*\*\s*)?([A-Za-zÀ-ú\s]+(?:\se\s[A-Za-zÀ-ú]+)?)/i);
    let muscleGroup = "Treino Completo";
    
    // Common muscle group patterns
    const musclePatterns = [
      /Peito\s*e\s*Tríceps/i,
      /Costas\s*e\s*Bíceps/i,
      /Pernas?\s*(?:Completo)?/i,
      /Ombros?\s*e\s*Core/i,
      /Ombros?\s*e\s*Abdômen/i,
      /Full\s*Body/i,
      /Superior/i,
      /Inferior/i,
    ];
    
    for (const pattern of musclePatterns) {
      const muscleMatch = dayContent.match(pattern);
      if (muscleMatch) {
        muscleGroup = muscleMatch[0];
        break;
      }
    }
    
    // Skip rest days
    if (/descanso|recupera/i.test(dayContent) && !/exercício|🏋️/i.test(dayContent)) {
      continue;
    }
    
    // Parse exercises using the emoji markers
    const exerciseBlocks = dayContent.split(/🏋️\s*(?:Exercício\s*\d+:?\s*)?/i).filter(block => block.trim());
    const exercises: ParsedWorkoutDay["exercises"] = [];
    
    for (const block of exerciseBlocks) {
      if (!block.trim()) continue;
      
      // Extract exercise name (first line or before 📍)
      let name = "";
      const nameMatch = block.match(/^(?:\*\*)?([^📍🧠⚠️🔁⏱️🔄\n*]+?)(?:\*\*)?(?:\n|📍)/);
      if (nameMatch) {
        name = nameMatch[1].trim().replace(/^\*\*|\*\*$/g, "");
      }
      
      if (!name || name.length < 3) continue;
      
      // Extract equipment
      const equipMatch = block.match(/📍\s*(?:Máquina|Equipamento)?:?\s*([^\n🧠]+)/i);
      const equipment = equipMatch?.[1]?.trim() || "Peso corporal";
      
      // Extract execution steps
      const execMatch = block.match(/🧠\s*(?:Execução)?:?\s*([\s\S]*?)(?=🔁|⏱️|⚠️|🔄|$)/i);
      const stepsText = execMatch?.[1] || "";
      const steps = stepsText
        .split(/[•\n]/)
        .map(s => s.trim())
        .filter(s => s && s.length > 3);
      
      // Extract sets
      const setsMatch = block.match(/🔁\s*(?:Séries)?:?\s*(\d+x\d+[^\n⏱️⚠️🔄]*)/i);
      const sets = setsMatch?.[1]?.trim() || "3x12";
      
      // Extract rest
      const restMatch = block.match(/⏱️\s*(?:Descanso)?:?\s*([^\n⚠️🔄]+)/i);
      const rest = restMatch?.[1]?.trim() || "60 segundos";
      
      // Extract common error
      const errorMatch = block.match(/⚠️\s*(?:Erro comum)?:?\s*([^\n🔄]+)/i);
      const commonError = errorMatch?.[1]?.trim() || "Executar sem controle";
      
      // Extract alternative
      const altMatch = block.match(/🔄\s*(?:Alternativa)?:?\s*([^\n🏋️]+)/i);
      const alternative = altMatch?.[1]?.trim() || "Versão com peso corporal";
      
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
    
    if (exercises.length > 0) {
      days.push({
        dayName: dayName + "-feira",
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
    /(?:segunda|terça|quarta|quinta|sexta)(?:-feira)?\s*\(?treino/i,
    /🏋️\s*exercício/i,
    /📅\s*rotina/i,
  ];
  
  return workoutIndicators.some(pattern => pattern.test(content));
}
