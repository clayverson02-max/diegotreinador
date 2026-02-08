import { DiegoAvatar } from "./DiegoAvatar";
import { ArrowRight, CheckCircle } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection = ({ onStart }: HeroSectionProps) => {
  const benefits = [
    "Plano de treino personalizado",
    "Orientação alimentar completa",
    "Exercícios explicados passo a passo",
    "Adaptado ao seu nível e objetivo",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Floating Avatar */}
      <div className="mb-8">
        <DiegoAvatar size="lg" animate />
      </div>

      {/* Title */}
      <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
        Fala! Eu sou o{" "}
        <span className="diego-gradient-text diego-glow-text">Diego</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-md mb-8">
        Seu instrutor digital de academia. Vou montar um plano{" "}
        <strong className="text-foreground">100% personalizado</strong> para você.
      </p>

      {/* Benefits */}
      <div className="flex flex-col items-start gap-3 mb-10">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CheckCircle size={20} className="text-primary" />
            <span className="text-foreground">{benefit}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="diego-button-primary text-lg flex items-center gap-3 group"
      >
        Começar Agora
        <ArrowRight
          size={20}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground mt-8 max-w-sm">
        ⚠️ Orientações educacionais. Consulte um profissional de saúde antes de
        iniciar qualquer programa de exercícios.
      </p>
    </div>
  );
};
