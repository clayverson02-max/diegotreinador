import { useState } from "react";
import { UserProfile } from "@/types/diego";
import { HeroSection } from "@/components/diego/HeroSection";
import { OnboardingForm } from "@/components/diego/OnboardingForm";
import { ChatInterface } from "@/components/diego/ChatInterface";
import { DiegoAvatar } from "@/components/diego/DiegoAvatar";
import { ArrowLeft } from "lucide-react";

type AppState = "hero" | "onboarding" | "chat";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("hero");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleStart = () => {
    setAppState("onboarding");
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setAppState("chat");
  };

  const handleBack = () => {
    if (appState === "chat") {
      setAppState("onboarding");
    } else if (appState === "onboarding") {
      setAppState("hero");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header for onboarding and chat */}
      {appState !== "hero" && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container max-w-2xl mx-auto flex items-center justify-between p-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <DiegoAvatar size="sm" />
              <span className="font-display font-semibold text-foreground">Diego</span>
            </div>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={appState !== "hero" ? "pt-20" : ""}>
        {appState === "hero" && <HeroSection onStart={handleStart} />}

        {appState === "onboarding" && (
          <div className="container py-8 px-4">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                Vamos lá! Me conta sobre você
              </h2>
              <p className="text-muted-foreground">
                Preciso de algumas informações para montar seu plano
              </p>
            </div>
            <OnboardingForm onComplete={handleOnboardingComplete} />
          </div>
        )}

        {appState === "chat" && userProfile && (
          <div className="h-[calc(100vh-5rem)]">
            <ChatInterface profile={userProfile} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
