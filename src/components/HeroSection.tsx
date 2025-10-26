import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import heroImage from "@/assets/webook-hero.png";

const HeroSection = () => {
  const scrollToOffer = () => {
    document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          {/* Left: Text Content */}
          <div className="text-center md:text-left space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary animate-pulse">
              <Heart size={16} fill="currentColor" />
              <span className="font-semibold">Guia Completo Para Casais</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                +1.000 receitas
              </span>
              <span className="block mt-2">para reacender</span>
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                o amor em casa
              </span>
            </h1>

            <div className="mx-auto max-w-xl space-y-4 md:mx-0">
              <p className="text-xl text-muted-foreground">
                O guia definitivo de{" "}
                <span className="text-foreground font-bold border-b-2 border-primary/30">rituais</span>,{" "}
                <span className="text-foreground font-bold border-b-2 border-secondary/30">desafios</span> e{" "}
                <span className="text-foreground font-bold border-b-2 border-primary/30">conversas profundas</span> que
                transformam relacionamentos.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-lg">
                <span className="text-foreground font-bold text-lg">Apenas 10 minutos por dia</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span>
                Baseado em práticas usadas por <span className="text-foreground font-semibold">terapeutas de casais</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="xl" onClick={scrollToOffer} className="group">
                <Heart className="group-hover:scale-110 transition-transform" size={20} fill="currentColor" />
                Quero meu webook por R$ 49,99
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>
                  Acesso <span className="font-semibold text-foreground">imediato</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>
                  Garantia de <span className="font-semibold text-foreground">7 dias</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>
                  Acesso <span className="font-semibold text-foreground">vitalício</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Webook Mockup */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative animate-float">
              <img
                src={heroImage}
                alt="Webook 1000 Receitas de Amor"
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
