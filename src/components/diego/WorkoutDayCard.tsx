import { WorkoutDay } from "@/types/diego";
import { ExerciseCard } from "./ExerciseCard";
import { Calendar, CheckCircle2 } from "lucide-react";

interface WorkoutDayCardProps {
  day: WorkoutDay;
  isCompleted?: boolean;
  onComplete?: () => void;
  showImages?: boolean;
}

export const WorkoutDayCard = ({ day, isCompleted, onComplete, showImages }: WorkoutDayCardProps) => {
  return (
    <div className="space-y-4">
      {/* Day Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="workout-day-badge">
            <Calendar size={16} />
            {day.dia}
          </div>
          <span className="text-muted-foreground">|</span>
          <span className="font-display font-semibold text-foreground">
            {day.grupoMuscular}
          </span>
        </div>
        
        {isCompleted && (
          <div className="flex items-center gap-2 text-diego-success">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">Concluído</span>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {day.exercicios.map((exercise, index) => (
          <ExerciseCard 
            key={index} 
            exercise={exercise} 
            index={index}
            showImage={showImages}
          />
        ))}
      </div>

      {/* Complete Button */}
      {onComplete && !isCompleted && (
        <button
          onClick={onComplete}
          className="w-full diego-button-primary flex items-center justify-center gap-2 py-4"
        >
          <CheckCircle2 size={20} />
          Finalizar Treino do Dia
        </button>
      )}
    </div>
  );
};
