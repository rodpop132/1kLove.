import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const phrases = [
  "Aquecendo o amor...",
  "Preparando suas receitas de conexao...",
  "Pronto para reacender sentimentos reais?",
];

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(phraseInterval);
          setTimeout(onLoadingComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0B1220] to-[#111827] px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-3xl border border-border/40 bg-background/40 p-10 text-center shadow-2xl backdrop-blur">
        <div className="relative h-16 w-20">
          <Heart className="absolute left-0 top-0 h-16 w-16 animate-pulse-heart text-primary" fill="currentColor" />
          <Heart
            className="absolute left-7 top-0 h-16 w-16 animate-pulse-heart text-secondary"
            fill="currentColor"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        <p className="text-lg font-medium text-foreground/90 sm:text-xl">{phrases[currentPhrase]}</p>

        <div className="h-2 w-full rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <p className="text-xs text-muted-foreground sm:text-sm">
          Esse aquecimento rapido garante uma experiencia inicial suave em qualquer dispositivo.
        </p>

        <a
          href="/admin"
          className="text-xs font-semibold text-primary underline-offset-2 hover:underline sm:text-sm"
        >
          Acesso administrativo
        </a>
      </div>
    </div>
  );
};

export default LoadingScreen;
