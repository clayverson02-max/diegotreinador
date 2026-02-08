import { Meal } from "@/types/diego";
import { Clock, Utensils, RefreshCw, Lightbulb } from "lucide-react";

interface MealCardProps {
  meal: Meal;
}

export const MealCard = ({ meal }: MealCardProps) => {
  return (
    <div className="meal-card slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Utensils size={20} className="text-primary" />
          <h4 className="font-display font-semibold text-lg text-foreground">
            {meal.nome}
          </h4>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock size={14} />
          {meal.horario}
        </div>
      </div>

      {/* Alimentos */}
      <div className="mb-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">O que comer</span>
        <ul className="mt-2 space-y-1">
          {meal.alimentos.map((alimento, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {alimento}
            </li>
          ))}
        </ul>
      </div>

      {/* Substituições */}
      <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3 mb-3">
        <RefreshCw size={16} className="text-diego-info mt-0.5 shrink-0" />
        <div>
          <span className="text-xs text-diego-info uppercase tracking-wide font-medium">Substituições</span>
          <p className="text-sm text-foreground mt-1">
            {meal.substituicoes.join(" • ")}
          </p>
        </div>
      </div>

      {/* Por quê */}
      <div className="flex items-start gap-3">
        <Lightbulb size={16} className="text-accent mt-0.5 shrink-0" />
        <div>
          <span className="text-xs text-accent uppercase tracking-wide font-medium">Por quê?</span>
          <p className="text-sm text-muted-foreground mt-1">{meal.porque}</p>
        </div>
      </div>
    </div>
  );
};
