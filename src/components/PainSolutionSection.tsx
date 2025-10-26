import { Clock, Heart, MessageCircle } from "lucide-react";

const solutions = [
  {
    icon: Clock,
    pain: "Falta de tempo",
    solution: "Rituais curtos que cabem no dia",
  },
  {
    icon: Heart,
    pain: "Distância emocional",
    solution: "Prompts que destravam conversas profundas",
  },
  {
    icon: MessageCircle,
    pain: "Discussões repetitivas",
    solution: "Método simples para reconectar sem terapia",
  },
];

const PainSolutionSection = () => {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Transition Text */}
        <div className="mx-auto mb-16 max-w-4xl animate-fade-up text-center sm:mb-20 sm:px-4">
          <div className="mb-6 inline-block rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <span className="font-semibold">Se você se identifica com isso...</span>
          </div>

          <h2 className="text-3xl font-bold leading-tight text-muted-foreground sm:text-4xl md:text-5xl">
            Você sente que o relacionamento{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
                esfriou
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full text-destructive/30"
                height="8"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path d="M0,4 Q25,8 50,4 T100,4" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
            , que as conversas ficaram{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
                curtas
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full text-destructive/30"
                height="8"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path d="M0,4 Q25,8 50,4 T100,4" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>{" "}
            e{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl">
                o carinho se perdeu na rotina?
              </span>
            </span>
          </h2>

          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            Não se preocupe. <span className="font-semibold text-foreground">Você não está sozinho(a)</span> — e tem solução. 💚
          </p>
        </div>

        {/* Solution Cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {solutions.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.pain}
                className="group animate-fade-up rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 sm:p-7 md:p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-4 transition-transform group-hover:scale-110">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
                  <span className="text-destructive">💔</span>
                  {item.pain}
                </h3>
                <div className="my-4 h-px bg-border" />
                <p className="leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-primary">→</span> {item.solution}
                </p>
              </div>
            );
          })}
        </div>

        {/* Closing Statement */}
        <div className="mx-auto max-w-3xl animate-fade-up text-center" style={{ animationDelay: "0.3s" }}>
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 p-6 sm:p-8">
            <p className="mb-4 text-2xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                "Webook +1.000 Receitas de Amor"
              </span>
            </p>
            <p className="text-lg text-muted-foreground">
              foi criado para{" "}
              <span className="border-b-2 border-primary/30 font-bold text-foreground">casais reais</span>, com{" "}
              <span className="border-b-2 border-secondary/30 font-bold text-foreground">rotinas reais</span>, que querem se{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl font-bold">
                reencontrar
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainSolutionSection;

