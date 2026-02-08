import { WorkoutDay } from "@/types/diego";
import { ExerciseCard } from "./ExerciseCard";
import { Calendar } from "lucide-react";

interface WorkoutDayCardProps {
  day: WorkoutDay;
}

export const WorkoutDayCard = ({ day }: WorkoutDayCardProps) => {
  return (
    <div className="space-y-4">
      {/* Day Header */}
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

      {/* Exercises */}
      <div className="space-y-4">
        {day.exercicios.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} index={index} />
        ))}
      </div>
    </div>
  );
};
