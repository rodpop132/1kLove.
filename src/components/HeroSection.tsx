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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="absolute h-1 w-1 rounded-full bg-primary/30 animate-float"
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
          <div className="space-y-6 text-center animate-fade-up md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary animate-pulse">
              <Heart size={16} fill="currentColor" />
              <span className="font-semibold">Guia Completo Para Casais</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                +1.000 receitas
              </span>
              <span className="mt-2 block">para reacender</span>
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                o amor em casa
              </span>
            </h1>

            <div className="mx-auto max-w-xl space-y-4 md:mx-0">
              <p className="text-xl text-muted-foreground">
                O guia definitivo de{" "}
                <span className="border-b-2 border-primary/30 font-bold text-foreground">rituais</span>,{" "}
                <span className="border-b-2 border-secondary/30 font-bold text-foreground">desafios</span> e{" "}
                <span className="border-b-2 border-primary/30 font-bold text-foreground">conversas profundas</span> que
                transformam relacionamentos.
              </p>

              <div className="inline-flex items-center gap-2 rounded-lg border border-secondary/20 bg-secondary/10 px-4 py-2">
                <span className="text-lg font-bold text-foreground">Apenas 10 minutos por dia</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
              <span>
                Baseado em praticas usadas por <span className="font-semibold text-foreground">terapeutas de casais</span>
              </span>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button variant="hero" size="xl" onClick={scrollToOffer} className="group">
                <Heart className="transition-transform group-hover:scale-110" size={20} fill="currentColor" />
                Quero meu webook por R$ 49,99
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
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
                  Acesso <span className="font-semibold text-foreground">vitalicio</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative animate-float">
              <img
                src={heroImage}
                alt="Webook 1000 Receitas de Amor"
                className="mx-auto w-full max-w-md drop-shadow-2xl"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/20 to-transparent blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

