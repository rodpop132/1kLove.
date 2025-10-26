import { Clock, Heart, MessageCircle } from "lucide-react";

const solutions = [
  {
    icon: Clock,
    pain: "Rotina corrida",
    solution: "Micro rituais de 10 minutos que cabem no intervalo de trabalho ou antes de dormir.",
  },
  {
    icon: Heart,
    pain: "Distancia emocional",
    solution: "Perguntas guiadas que desbloqueiam conversas profundas sem clima pesado.",
  },
  {
    icon: MessageCircle,
    pain: "Discussao repetida",
    solution: "Um roteiro simples para transformar conflitos em combinados que funcionam.",
  },
];

const PainSolutionSection = () => {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/60 to-card" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-4xl text-center sm:mb-20 animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">
            <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
            Se voce sente o relacionamento morno
          </div>

          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            Voltar a sentir carinho genuino nao precisa ser complicado
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A maioria dos casais chega ate aqui depois de meses sem tempo, com conversas cada vez mais rapidas e
            dificuldades para manter a chama acesa. O webook mostra um passo a passo pratico para reconectar sem precisar
            de horas de terapia.
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {solutions.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.pain}
                className="group rounded-xl border border-border bg-card/80 p-6 transition-all duration-300 hover:border-primary/60 hover:shadow-lg sm:p-7 animate-fade-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-transform group-hover:scale-105">
                  <Icon size={28} />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground sm:text-xl">{item.pain}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{item.solution}</p>
              </article>
            );
          })}
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 p-6 text-center sm:p-10 animate-fade-up">
          <p className="text-2xl font-bold text-foreground sm:text-3xl">Receba um mapa completo para reconectar</p>
          <p className="mt-3 text-lg text-muted-foreground">
            Rotinas romanticas, desafios semanais, prompts de conversa e momentos surpreendentes sempre ao alcance do
            seu celular.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PainSolutionSection;
