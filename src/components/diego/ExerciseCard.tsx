import { useState, useEffect } from "react";
import { Exercise } from "@/types/diego";
import { MapPin, Brain, AlertTriangle, RefreshCw, Timer, Repeat, ImageIcon, Loader2 } from "lucide-react";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  showImage?: boolean;
}

const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-exercise-image`;

export const ExerciseCard = ({ exercise, index, showImage = false }: ExerciseCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(exercise.imagem || null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (showImage && !imageUrl && !isLoadingImage) {
      generateImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showImage]);

  const generateImage = async () => {
    setIsLoadingImage(true);
    try {
      const resp = await fetch(IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          exerciseName: exercise.nome,
          equipment: exercise.maquina,
          targetMuscle: exercise.nome,
        }),
      });

      const data = await resp.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setImageError(true);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setImageError(true);
    } finally {
      setIsLoadingImage(false);
    }
  };

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

      {/* Exercise Image */}
      {showImage && (
        <div className="mb-4 rounded-xl overflow-hidden bg-muted/30 aspect-video flex items-center justify-center">
          {isLoadingImage ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-xs">Gerando imagem...</span>
            </div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt={exercise.nome}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon size={32} />
              <span className="text-xs">Imagem indisponível</span>
            </div>
          )}
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
