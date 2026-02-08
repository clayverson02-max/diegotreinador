import { Exercise } from "@/types/diego";
import { MapPin, Brain, AlertTriangle, RefreshCw, Timer, Repeat } from "lucide-react";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard = ({ exercise, index }: ExerciseCardProps) => {
  return (
    <div className="exercise-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="diego-gradient w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
          {index + 1}
        </span>
        <h4 className="font-display font-semibold text-lg text-foreground">
          {exercise.nome}
        </h4>
      </div>

      {/* Image placeholder */}
      {exercise.imagem && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img 
            src={exercise.imagem} 
            alt={exercise.nome}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Details */}
      <div className="space-y-3">
        {/* Máquina */}
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Máquina</span>
            <p className="text-sm text-foreground">{exercise.maquina}</p>
          </div>
        </div>

        {/* Execução */}
        <div className="flex items-start gap-3">
          <Brain size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Execução</span>
            <ul className="text-sm text-foreground mt-1 space-y-1">
              {exercise.execucao.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Séries e Reps */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Repeat size={16} className="text-diego-info" />
            <span className="text-sm">
              <span className="text-muted-foreground">Séries:</span>{" "}
              <span className="font-medium">{exercise.series}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-diego-warning" />
            <span className="text-sm">
              <span className="text-muted-foreground">Descanso:</span>{" "}
              <span className="font-medium">{exercise.descanso}</span>
            </span>
          </div>
        </div>

        {/* Erro comum */}
        <div className="flex items-start gap-3 bg-destructive/10 rounded-lg p-3">
          <AlertTriangle size={18} className="text-destructive mt-0.5 shrink-0" />
          <div>
            <span className="text-xs text-destructive uppercase tracking-wide font-medium">Erro comum</span>
            <p className="text-sm text-foreground">{exercise.erroComum}</p>
          </div>
        </div>

        {/* Alternativa */}
        <div className="flex items-start gap-3 bg-primary/10 rounded-lg p-3">
          <RefreshCw size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <span className="text-xs text-primary uppercase tracking-wide font-medium">Alternativa</span>
            <p className="text-sm text-foreground">{exercise.alternativa}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
