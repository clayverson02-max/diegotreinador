export interface UserProfile {
  idade: string;
  altura: string;
  peso: string;
  sexo: 'masculino' | 'feminino' | 'outro' | '';
  objetivo: string;
  nivel: 'iniciante' | 'intermediario' | '';
  diasSemana: string;
  local: 'academia' | 'casa' | '';
  limitacoes: string;
  alimentacao: string;
}

export interface Message {
  id: string;
  role: 'user' | 'diego';
  content: string;
  type?: 'text' | 'workout' | 'meal' | 'routine';
  timestamp: Date;
}

export interface Exercise {
  nome: string;
  maquina: string;
  execucao: string[];
  series: string;
  repeticoes: string;
  descanso: string;
  erroComum: string;
  alternativa: string;
  imagem?: string;
}

export interface WorkoutDay {
  dia: string;
  grupoMuscular: string;
  exercicios: Exercise[];
}

export interface Meal {
  nome: string;
  horario: string;
  alimentos: string[];
  substituicoes: string[];
  porque: string;
}

export interface DailyMealPlan {
  cafeDaManha: Meal;
  almoco: Meal;
  jantar: Meal;
  lanches: Meal[];
}

export interface RoutineTips {
  horarioTreino: string;
  agua: string;
  sono: string;
  frequencia: string;
  dicasMotivacao: string[];
}
