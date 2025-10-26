import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [progress, setProgress] = useState(0);

  const phrases = [
    "Aquecendo o amor…",
    "Preparando suas receitas de conexão…",
    "Pronto para reacender sentimentos reais?",
  ];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0B1220] to-[#111827]">
      <div className="flex flex-col items-center gap-8">
        {/* Heart Animation */}
        <div className="relative">
          <Heart
            className="absolute left-0 top-0 text-primary animate-pulse-heart"
            size={64}
            fill="currentColor"
          />
          <Heart
            className="absolute left-8 top-0 text-secondary animate-pulse-heart"
            size={64}
            fill="currentColor"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Phrases */}
        <p className="mt-24 text-xl font-medium text-foreground/90 animate-fade-up">
          {phrases[currentPhrase]}
        </p>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
