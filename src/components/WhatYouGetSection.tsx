import { useEffect, useState } from "react";
import { Book, Calendar, Infinity, Mail, Map } from "lucide-react";
import { listPublicRecipes, Recipe } from "@/lib/api";

const staticFeatures = [
  {
    icon: Book,
    text: "Webook digital com mais de 1.000 experiencias",
  },
  {
    icon: Calendar,
    text: "Planos praticos de 7, 14 e 30 dias",
  },
  {
    icon: Mail,
    text: "Mensagens de carinho prontas para surpreender",
  },
  {
    icon: Map,
    text: "Guias de reconciliacao em diferentes fases",
  },
  {
    icon: Infinity,
    text: "Acesso vitalicio a dashboard exclusiva",
  },
];

const WhatYouGetSection = () => {
  const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    listPublicRecipes()
      .then((data) => {
        if (isMounted) {
          setPublicRecipes(data.items.slice(0, 3));
        }
      })
      .catch((err) => {
        console.warn("Nao foi possivel carregar receitas publicas:", err);
        if (isMounted) {
          setError("Receitas demonstrativas indisponiveis no momento.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-card/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center animate-fade-up">
          <div className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Conteudo Exclusivo
          </div>

          <h2 className="text-3xl font-bold md:text-5xl">
            O que voce vai{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              receber
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-foreground">
            Tudo que voce precisa para <span className="font-bold text-foreground">transformar</span> o relacionamento
            dia apos dia.
          </p>
        </div>

        <div className="space-y-4">
          {staticFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.text}
                className="flex items-start gap-4 rounded-lg border border-border bg-background p-6 transition-all duration-300 hover:border-primary/50 animate-fade-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="text-primary" size={20} />
                  </div>
                </div>
                <p className="text-lg font-medium text-foreground">{feature.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 space-y-4 animate-fade-up">
          <h3 className="text-center text-lg font-semibold text-foreground">Receitas publicas liberadas</h3>
          {error ? (
            <p className="text-center text-sm text-muted-foreground">{error}</p>
          ) : publicRecipes.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Carregando receitas demonstrativas...</p>
          ) : (
            <div className="grid gap-4 rounded-lg border border-border/60 bg-background/80 p-6 sm:grid-cols-3">
              {publicRecipes.map((recipe) => (
                <div key={recipe.id} className="flex flex-col gap-2 text-left">
                  <span className="text-xs uppercase tracking-widest text-primary">
                    {recipe.category ?? "sem categoria"}
                  </span>
                  <p className="text-base font-semibold text-foreground">{recipe.title}</p>
                  <p className="text-sm text-muted-foreground">{recipe.content.slice(0, 140)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;

