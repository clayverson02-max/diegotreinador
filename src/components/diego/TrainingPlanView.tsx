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
  onDayComplete?: (dayIndex: number) => void;
}

export const TrainingPlanView = ({ workoutDays, onDayComplete }: TrainingPlanViewProps) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const { 
    progress, 
    initializeProgress, 
    completeDay, 
    isDayUnlocked, 
    isDayCompleted,
    getNextAvailableDay 
  } = useTrainingProgress();

  // Initialize progress when workout days are loaded
  useEffect(() => {
    if (workoutDays.length > 0 && !progress) {
      initializeProgress(workoutDays.map(d => d.dayName));
    }
  }, [workoutDays, progress]);

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
          
          return (
            <button
              key={index}
              onClick={() => handleDayClick(index)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${isActive ? 'diego-gradient text-primary-foreground scale-105' : ''}
                ${isCompleted && !isActive ? 'bg-diego-success/20 text-diego-success border border-diego-success/30' : ''}
                ${!isUnlocked && !isCompleted ? 'bg-muted/50 text-muted-foreground cursor-not-allowed' : ''}
                ${isUnlocked && !isCompleted && !isActive ? 'bg-secondary text-secondary-foreground hover:bg-muted' : ''}
              `}
            >
              {isCompleted ? (
                <CheckCircle2 size={16} />
              ) : !isUnlocked ? (
                <Lock size={14} />
              ) : (
                <Calendar size={16} />
              )}
              <span>Dia {index + 1}</span>
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
