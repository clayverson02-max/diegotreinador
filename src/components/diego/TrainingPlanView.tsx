import { useState, useEffect } from "react";
import { WorkoutDayCard } from "./WorkoutDayCard";
import { DayProgress, useTrainingProgress } from "@/hooks/useTrainingProgress";
import { Calendar, Lock, CheckCircle2, Flame, Trophy } from "lucide-react";
import { toast } from "sonner";

interface WorkoutDay {
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

interface TrainingPlanViewProps {
  workoutDays: WorkoutDay[];
  selectedDays?: string[];
  onDayComplete?: (dayIndex: number) => void;
}

const WEEKDAY_NAMES: Record<string, string> = {
  segunda: "Seg",
  terca: "Ter",
  quarta: "Qua",
  quinta: "Qui",
  sexta: "Sex",
  sabado: "Sáb",
  domingo: "Dom",
};

const formatScheduledDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

const ORDERED_WEEKDAYS = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

export const TrainingPlanView = ({ workoutDays: rawWorkoutDays, selectedDays, onDayComplete }: TrainingPlanViewProps) => {
  // Garante UMA entrada por dia selecionado pelo usuário, ciclando os treinos se a IA gerou menos.
  const workoutDays = (() => {
    if (!selectedDays || selectedDays.length === 0) return rawWorkoutDays;
    const sorted = [...selectedDays].sort((a, b) => ORDERED_WEEKDAYS.indexOf(a) - ORDERED_WEEKDAYS.indexOf(b));
    return sorted.map((_, i) => rawWorkoutDays[i % Math.max(rawWorkoutDays.length, 1)]).filter(Boolean);
  })();

  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const { 
    progress, 
    initializeProgress, 
    completeDay, 
    isDayUnlocked, 
    isDayCompleted,
    getNextAvailableDay,
    resetProgress,
  } = useTrainingProgress();

  // Initialize or reset progress when workout days or selected days change
  useEffect(() => {
    if (workoutDays.length > 0) {
      // Se não há progresso, inicializar
      if (!progress) {
        initializeProgress(workoutDays.map(d => d.dayName), selectedDays);
        return;
      }
      
      // Se os dias selecionados mudaram, reiniciar progresso
      const currentSelectedDays = progress.selectedDays || [];
      const newSelectedDays = selectedDays || [];
      const daysChanged = JSON.stringify(currentSelectedDays.sort()) !== JSON.stringify([...newSelectedDays].sort());
      
      if (daysChanged && newSelectedDays.length > 0) {
        resetProgress();
        setTimeout(() => {
          initializeProgress(workoutDays.map(d => d.dayName), selectedDays);
        }, 100);
      }
    }
  }, [workoutDays, progress, selectedDays]);

  const handleDayClick = (index: number) => {
    const dayId = `day_${index}`;
    
    if (!isDayUnlocked(dayId) && !isDayCompleted(dayId)) {
      const day = progress?.days[index];
      if (day) {
        const scheduledDate = new Date(day.scheduledDate);
        const today = new Date();
        const diffDays = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        toast.info(`🔒 Este treino será liberado em ${diffDays} dia${diffDays > 1 ? 's' : ''}`);
      }
      return;
    }
    
    setActiveDayIndex(activeDayIndex === index ? null : index);
  };

  const handleCompleteDay = (index: number) => {
    const dayId = `day_${index}`;
    completeDay(dayId);
    onDayComplete?.(index);
    toast.success("🎉 Treino finalizado! Excelente trabalho!");
  };

  const completedCount = progress?.days.filter(d => d.completedAt).length || 0;
  const totalDays = workoutDays.length;
  const streakDays = completedCount;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="diego-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Trophy className="text-accent" size={20} />
            Seu Progresso
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <Flame className="text-destructive" size={16} />
            <span className="font-semibold">{streakDays} dias</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 diego-gradient rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalDays) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {completedCount} de {totalDays} treinos concluídos
        </p>
      </div>

      {/* Day Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {workoutDays.map((day, index) => {
          const dayId = `day_${index}`;
          const isCompleted = isDayCompleted(dayId);
          const isUnlocked = isDayUnlocked(dayId);
          const isActive = activeDayIndex === index;
          const progressDay = progress?.days[index];
          const weekDayLabel = progressDay?.weekDay ? WEEKDAY_NAMES[progressDay.weekDay] : "";
          const dateLabel = progressDay?.scheduledDate ? formatScheduledDate(progressDay.scheduledDate) : "";
          
          return (
            <button
              key={index}
              onClick={() => handleDayClick(index)}
              className={`
                flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all min-w-[80px]
                ${isActive ? 'diego-gradient text-primary-foreground scale-105' : ''}
                ${isCompleted && !isActive ? 'bg-diego-success/20 text-diego-success border border-diego-success/30' : ''}
                ${!isUnlocked && !isCompleted ? 'bg-muted/50 text-muted-foreground cursor-not-allowed' : ''}
                ${isUnlocked && !isCompleted && !isActive ? 'bg-secondary text-secondary-foreground hover:bg-muted' : ''}
              `}
            >
              <div className="flex items-center gap-1">
                {isCompleted ? (
                  <CheckCircle2 size={14} />
                ) : !isUnlocked ? (
                  <Lock size={12} />
                ) : (
                  <Calendar size={14} />
                )}
                <span>{weekDayLabel || `Dia ${index + 1}`}</span>
              </div>
              <span className="text-xs opacity-80">{dateLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Day Content */}
      {activeDayIndex !== null && workoutDays[activeDayIndex] && (
        <div className="fade-in">
          <WorkoutDayCard
            day={{
              dia: workoutDays[activeDayIndex].dayName,
              grupoMuscular: workoutDays[activeDayIndex].muscleGroup,
              exercicios: workoutDays[activeDayIndex].exercises.map(ex => ({
                nome: ex.name,
                maquina: ex.equipment,
                execucao: ex.steps,
                series: ex.sets,
                repeticoes: ex.reps,
                descanso: ex.rest,
                erroComum: ex.commonError,
                alternativa: ex.alternative,
              })),
            }}
            isCompleted={isDayCompleted(`day_${activeDayIndex}`)}
            onComplete={() => handleCompleteDay(activeDayIndex)}
            showImages={true}
          />
        </div>
      )}

      {/* Locked Message */}
      {activeDayIndex === null && (
        <div className="diego-card text-center py-8">
          <Calendar className="mx-auto text-muted-foreground mb-3" size={40} />
          <p className="text-muted-foreground">
            Selecione um dia acima para ver seu treino
          </p>
        </div>
      )}
    </div>
  );
};
