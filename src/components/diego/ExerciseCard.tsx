import { useMemo, useState } from "react";
import { Exercise } from "@/types/diego";
import { MapPin, Brain, AlertTriangle, RefreshCw, Timer, Repeat, ImageIcon, Loader2 } from "lucide-react";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  showImage?: boolean;
}

const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-exercise-image`;

const createExerciseIllustration = (exercise: Exercise) => {
  const title = exercise.nome.slice(0, 42);
  const equipment = exercise.maquina.slice(0, 54);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="hsl(142, 76%, 36%)"/>
          <stop offset="1" stop-color="hsl(160, 84%, 39%)"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="38%" r="48%">
          <stop offset="0" stop-color="hsl(0, 0%, 100%)" stop-opacity="0.35"/>
          <stop offset="1" stop-color="hsl(0, 0%, 100%)" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="675" fill="hsl(222, 47%, 11%)"/>
      <rect x="36" y="36" width="1128" height="603" rx="40" fill="url(#bg)" opacity="0.22"/>
      <circle cx="600" cy="280" r="270" fill="url(#glow)"/>
      <path d="M180 535h840" stroke="hsl(142, 76%, 56%)" stroke-width="18" stroke-linecap="round" opacity="0.55"/>
      <circle cx="595" cy="174" r="58" fill="hsl(142, 76%, 56%)"/>
      <path d="M595 238v154" stroke="hsl(142, 76%, 56%)" stroke-width="44" stroke-linecap="round"/>
      <path d="M500 300h190" stroke="hsl(0, 0%, 100%)" stroke-width="34" stroke-linecap="round" opacity="0.92"/>
      <path d="M525 395l-72 100M665 395l78 100" stroke="hsl(0, 0%, 100%)" stroke-width="38" stroke-linecap="round" opacity="0.92"/>
      <path d="M362 300h108M720 300h118" stroke="hsl(142, 76%, 56%)" stroke-width="26" stroke-linecap="round"/>
      <circle cx="334" cy="300" r="34" fill="hsl(142, 76%, 56%)" opacity="0.82"/>
      <circle cx="866" cy="300" r="34" fill="hsl(142, 76%, 56%)" opacity="0.82"/>
      <rect x="92" y="72" width="1016" height="92" rx="24" fill="hsl(222, 47%, 11%)" opacity="0.72"/>
      <text x="122" y="126" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="800" fill="hsl(0, 0%, 100%)">${title}</text>
      <text x="122" y="590" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="600" fill="hsl(0, 0%, 100%)" opacity="0.9">${equipment}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const ExerciseCard = ({ exercise, index, showImage = false }: ExerciseCardProps) => {
  const fallbackImage = useMemo(() => createExerciseIllustration(exercise), [exercise.nome, exercise.maquina]);
  const [imageUrl, setImageUrl] = useState<string>(exercise.imagem || fallbackImage);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const generateImage = async () => {
    setIsLoadingImage(true);
    setImageError(false);
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
        setImageUrl(fallbackImage);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setImageError(true);
      setImageUrl(fallbackImage);
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
          ) : (
            <div className="relative w-full h-full">
            <img 
              src={imageUrl} 
              alt={exercise.nome}
              className="w-full h-full object-cover"
              onError={() => {
                setImageError(true);
                setImageUrl(fallbackImage);
              }}
            />
              <button
                type="button"
                onClick={generateImage}
                className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/80 px-3 py-2 text-xs text-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
                aria-label={`Gerar imagem real de ${exercise.nome}`}
              >
                {imageError ? <RefreshCw size={14} /> : <ImageIcon size={14} />}
                Melhorar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Execução — destaque logo abaixo da imagem */}
      <div className="mb-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={18} className="text-primary" />
          <span className="text-xs text-primary uppercase tracking-wide font-semibold">
            Como fazer corretamente
          </span>
        </div>
        <ol className="text-sm text-foreground space-y-2 list-decimal list-inside">
          {exercise.execucao.map((step, i) => (
            <li key={i} className="leading-relaxed">{step}</li>
          ))}
        </ol>
      </div>

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
