import { useState } from "react";
import { UserProfile } from "@/types/diego";
import { ChevronRight, ChevronLeft, User, Target, Dumbbell, Apple } from "lucide-react";

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

const steps = [
  { id: 1, title: "Dados Básicos", icon: User },
  { id: 2, title: "Objetivos", icon: Target },
  { id: 3, title: "Treino", icon: Dumbbell },
  { id: 4, title: "Alimentação", icon: Apple },
];

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    idade: "",
    altura: "",
    peso: "",
    sexo: "",
    objetivo: "",
    nivel: "",
    diasSemana: "",
    local: "",
    limitacoes: "",
    alimentacao: "",
  });

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else onComplete(profile);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profile.idade && profile.altura && profile.peso && profile.sexo;
      case 2:
        return profile.objetivo && profile.nivel;
      case 3:
        return profile.diasSemana && profile.local;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep >= step.id
                  ? "diego-gradient text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <step.icon size={18} />
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 transition-all ${
                  currentStep > step.id ? "bg-primary" : "bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="diego-card mb-6 slide-up">
        <h3 className="font-display font-bold text-xl mb-6 text-foreground">
          {steps[currentStep - 1].title}
        </h3>

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Idade</label>
              <input
                type="number"
                value={profile.idade}
                onChange={(e) => updateProfile("idade", e.target.value)}
                placeholder="Ex: 25"
                className="diego-input w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Altura (cm)</label>
                <input
                  type="number"
                  value={profile.altura}
                  onChange={(e) => updateProfile("altura", e.target.value)}
                  placeholder="Ex: 175"
                  className="diego-input w-full"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Peso (kg)</label>
                <input
                  type="number"
                  value={profile.peso}
                  onChange={(e) => updateProfile("peso", e.target.value)}
                  placeholder="Ex: 70"
                  className="diego-input w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Sexo</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "masculino", label: "Masculino" },
                  { value: "feminino", label: "Feminino" },
                  { value: "outro", label: "Outro" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateProfile("sexo", option.value as UserProfile["sexo"])}
                    className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                      profile.sexo === option.value
                        ? "diego-gradient text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Objetivo Principal</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Perder peso",
                  "Ganhar massa muscular",
                  "Definição",
                  "Saúde e bem-estar",
                  "Condicionamento físico",
                ].map((obj) => (
                  <button
                    key={obj}
                    onClick={() => updateProfile("objetivo", obj)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium text-left transition-all ${
                      profile.objetivo === obj
                        ? "diego-gradient text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Nível de Experiência</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "iniciante", label: "Iniciante Total" },
                  { value: "intermediario", label: "Intermediário" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateProfile("nivel", option.value as UserProfile["nivel"])}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      profile.nivel === option.value
                        ? "diego-gradient text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Quantos dias por semana pode treinar?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {["2", "3", "4", "5", "6"].map((dias) => (
                  <button
                    key={dias}
                    onClick={() => updateProfile("diasSemana", dias)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      profile.diasSemana === dias
                        ? "diego-gradient text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {dias}x
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Onde vai treinar?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "academia", label: "🏋️ Academia" },
                  { value: "casa", label: "🏠 Em Casa" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateProfile("local", option.value as UserProfile["local"])}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      profile.local === option.value
                        ? "diego-gradient text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Possui alguma dor ou limitação física?
              </label>
              <textarea
                value={profile.limitacoes}
                onChange={(e) => updateProfile("limitacoes", e.target.value)}
                placeholder="Ex: Dor no joelho direito, tendinite no ombro... (deixe vazio se não houver)"
                className="diego-input w-full h-24 resize-none"
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Como é sua alimentação atual?
              </label>
              <textarea
                value={profile.alimentacao}
                onChange={(e) => updateProfile("alimentacao", e.target.value)}
                placeholder="Descreva brevemente o que costuma comer no dia a dia... (café da manhã, almoço, jantar, lanches)"
                className="diego-input w-full h-32 resize-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ As orientações alimentares são educacionais e não substituem acompanhamento com nutricionista.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 1 && (
          <button onClick={prevStep} className="diego-button-secondary flex items-center gap-2">
            <ChevronLeft size={18} />
            Voltar
          </button>
        )}
        <button
          onClick={nextStep}
          disabled={!canProceed()}
          className={`flex-1 diego-button-primary flex items-center justify-center gap-2 ${
            !canProceed() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {currentStep === 4 ? "Ver Meu Plano" : "Continuar"}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
