import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { listMyRecipes, Recipe } from "@/lib/api";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Sparkles, Users } from "lucide-react";

type CategorisedRecipes = Record<string, Recipe[]>;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { redirectToCheckout, isRedirecting, error: checkoutError } = useStripeCheckout();
  const { toast } = useToast();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const [lastVerification, setLastVerification] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState<"overview" | "community" | "recipes">("overview");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!user || user.hasPaid) return;

    let cancelled = false;
    setIsRefreshingStatus(true);

    refreshUser()
      .then((result) => {
        if (result?.success) {
          setLastVerification(new Date());
        }
      })
      .catch((err) => console.warn("Falha ao validar status do usuario:", err))
      .finally(() => {
        if (!cancelled) {
          setIsRefreshingStatus(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshUser, user]);

  useEffect(() => {
    if (!user || !user.hasPaid) {
      setRecipes([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    listMyRecipes(user.email, user.password)
      .then((data) => {
        if (isMounted) {
          setRecipes(data.items);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Erro ao carregar receitas do usuario:", err);
        setError(err instanceof Error ? err.message : "Nao foi possivel carregar suas receitas agora.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleVerifyPayment = useCallback(async () => {
    if (!user) return;
    setIsRefreshingStatus(true);
    try {
      const result = await refreshUser();
      setLastVerification(new Date());

      if (!result) {
        toast({
          title: "Nao foi possivel verificar agora",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
        return;
      }

      if (result.success) {
        if (result.hasPaid) {
          toast({
            title: "Pagamento confirmado!",
            description: "Seu acesso premium foi liberado. Recarregando receitas...",
          });
        } else {
          toast({
            title: "Pagamento ainda nao confirmado",
            description: "A Stripe ainda nao confirmou o pagamento. Aguarde alguns segundos e tente novamente.",
          });
        }
      } else {
        toast({
          title: "Nao foi possivel verificar",
          description: result.error ?? "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao contactar o servidor",
        description: err instanceof Error ? err.message : "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingStatus(false);
    }
  }, [refreshUser, toast, user]);

  const recipesByCategory = useMemo(() => {
    return recipes.reduce<CategorisedRecipes>((acc, recipe) => {
      const key = recipe.category ?? "geral";
      acc[key] = acc[key] ? [...acc[key], recipe] : [recipe];
      return acc;
    }, {});
  }, [recipes]);

  const categories = useMemo(() => Object.keys(recipesByCategory), [recipesByCategory]);
  const firstCategory = categories[0] ?? "geral";

  if (!user) return null;

  const showPaymentOverlay = !user.hasPaid;
  const dashboardSections: Array<{
    id: "overview" | "community" | "recipes";
    label: string;
    description: string;
    icon: typeof Sparkles;
  }> = [
    {
      id: "overview",
      label: "Novidades",
      description: "Resumo rapido das novidades e planos da semana.",
      icon: Sparkles,
    },
    {
      id: "community",
      label: "Comunidade",
      description: "Espaco para acompanhar atividades em grupo.",
      icon: Users,
    },
    {
      id: "recipes",
      label: "Receitas",
      description: "Acesse os guias premium e colecoes.",
      icon: BookOpen,
    },
  ];

  const overviewHighlights = [
    {
      title: "Novidade da semana",
      description:
        "Novo desafio \"7 dias de reencontro\" desbloqueia tarefas curtas e conversas guiadas para reacender a proximidade.",
      bullets: ["3 atividades surpresa", "Checklist rapido para praticar juntos", "Frases inspiradoras diarias"],
    },
    {
      title: "Plano rapido para hoje",
      description: "Selecione um mini ritual de 15 minutos para quebrar a rotina esta noite.",
      bullets: ["Escolha o mood: leve, divertido ou profundo", "Checklist de preparacao em 3 passos"],
    },
  ];

  const communityUpdates = [
    {
      title: "Espaco de partilha",
      items: [
        "Pergunta da semana: Qual gesto simples fez diferenca nos ultimos dias?",
        "Podcast exclusivo: Como criar combinados que funcionam para ambos.",
      ],
    },
    {
      title: "Eventos proximos",
      items: [
        "Encontro ao vivo no Zoom – Sexta, 20h (Tema: Como celebrar pequenas vitorias).",
        "Sessao de journaling guiado – Domingo, 10h. Receba um roteiro pronto por e-mail.",
      ],
    },
    {
      title: "Canais de apoio",
      items: [
        "Newsletter quinzenal com novos prompts de conversa.",
        "Grupo reservado (Telegram) para celebrar progresso com outros casais.",
      ],
    },
  ];

  const recipeCompanions = [
    {
      title: "Diario do casal",
      description: "Registre emocoes, momentos especiais e combinados importantes. Em breve com sincronizacao entre parceiros.",
    },
    {
      title: "Conta compartilhada",
      description: "Convide seu parceiro(a) para acompanhar avancos, metas e desbloquear recompensas conjuntas.",
    },
    {
      title: "Favoritos e listas",
      description: "Crie colecoes personalizadas com os rituais que mais funcionaram para voces.",
    },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <Card className="border border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle>Status da assinatura</CardTitle>
                <CardDescription>
                  {user.hasPaid
                    ? "Acesso premium ativo. Aproveite todo o conteudo desbloqueado."
                    : "Pagamento pendente. Conclua a compra para acessar os materiais exclusivos."}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border/40 bg-background/40 p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Seu ritmo ideal</p>
                  <p className="mt-2">
                    Combine os rituais diarios com lembretes personalizados. Defina alarmes leves para nunca esquecer
                    o momento do casal.
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/40 p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Planos curtos</p>
                  <p className="mt-2">
                    Receba em breve planos de 7, 14 e 30 dias para avanco rapido, ajustados ao tempo que voces tem
                    disponivel.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {overviewHighlights.map((item) => (
                <Card key={item.title} className="border border-border/60 bg-card/80">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "community":
        return (
          <div className="space-y-6">
            <Card className="border border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle>Comunidade ativa</CardTitle>
                <CardDescription>
                  Participe das conversas semanais e acompanhe o progresso de outros casais caminhando com voce.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Envie relatos curtos sobre como foi o ritual do dia. Selecionamos os destaques para inspirar outras
                  pessoas (com anonimato, se preferir).
                </p>
                <p>
                  Em breve teremos um mural com os melhores momentos compartilhados e badges exclusivos para quem
                  completar desafios mensais.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {communityUpdates.map((card) => (
                <Card key={card.title} className="border border-border/60 bg-card/80">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "recipes":
      default:
        return (
          <div className="space-y-6">
            <Card className="border border-border/60 bg-card/80">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Suas receitas</CardTitle>
                  <CardDescription>
                    Receitas publicas e premium aparecem aqui assim que o pagamento for confirmado pela Stripe.
                  </CardDescription>
                </div>
                {!user.hasPaid && (
                  <Button variant="hero" size="sm" onClick={redirectToCheckout} disabled={isRedirecting}>
                    {isRedirecting ? "Redirecionando..." : "Liberar acesso completo"}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Carregando suas receitas personalizadas...</p>
                ) : error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : recipes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Assim que as primeiras receitas forem liberadas elas aparecem aqui automaticamente.
                  </p>
                ) : (
                  <Tabs defaultValue={firstCategory} className="space-y-4">
                    <TabsList className="flex w-full gap-2 overflow-x-auto">
                      {categories.map((category) => (
                        <TabsTrigger key={category} value={category} className="capitalize">
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {categories.map((category) => (
                      <TabsContent key={category} value={category}>
                        <div className="grid gap-4 md:grid-cols-2">
                          {recipesByCategory[category].map((recipe) => (
                            <article
                              key={recipe.id}
                              className="rounded-lg border border-border/60 bg-background/60 p-4 transition hover:border-primary/50 hover:shadow-lg"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-lg font-semibold text-foreground">{recipe.title}</h3>
                                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                                  {recipe.is_public ? "Publica" : "Premium"}
                                </span>
                              </div>
                              <p className="mt-3 text-sm text-muted-foreground">{recipe.content}</p>
                            </article>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {recipeCompanions.map((card) => (
                <Card key={card.title} className="border border-border/60 bg-card/80">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="relative container mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 sm:py-20">
        <section className="space-y-4">
          <Badge variant="secondary" className="w-fit bg-secondary/10 text-secondary-foreground">
            Em desenvolvimento
          </Badge>
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            Ola, {user.email.split("@")[0]}! Bem-vindo ao seu painel
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Consulte receitas, registre memorias e acompanhe os proximos passos do relacionamento.{" "}
            {user.hasPaid ? "Tudo liberado para explorar!" : "Complete o pagamento para desbloquear o conteudo premium."}
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,240px)_1fr]">
          <aside className="lg:sticky lg:top-28">
            <div className="flex gap-3 overflow-x-auto rounded-2xl border border-border/60 bg-card/80 p-3 lg:flex-col lg:overflow-visible">
              {dashboardSections.map(({ id, label, icon: Icon, description }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveSection(id)}
                    className={`flex flex-col rounded-xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:flex-row lg:items-center lg:gap-3 ${
                      isActive
                        ? "border-primary/60 bg-primary/10 text-primary"
                        : "border-border/50 bg-background/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-semibold">{label}</span>
                    </div>
                    <span className="mt-2 text-xs text-muted-foreground lg:mt-0 lg:text-[11px] lg:font-normal">
                      {description}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="space-y-8">{renderSectionContent()}</section>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-foreground">Sugira experiencias que fazem sentido para voces</p>
            <p>
              Envie novas ideias, receitas ou rituais que gostariam de ver no guia. Cada contribuicao ajuda a comunidade
              a crescer.
            </p>
          </div>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <a href="mailto:contato@receitasdeamor.com">Enviar sugestao por e-mail</a>
          </Button>
        </div>

        {showPaymentOverlay && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 px-4 text-center backdrop-blur">
            <div className="max-w-lg space-y-5 rounded-2xl border border-primary/30 bg-card/90 p-8 shadow-xl">
              <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
                Conteudo premium bloqueado
              </Badge>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Finalize o pagamento para desbloquear tudo
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Assim que a Stripe confirmar sua compra as receitas premium aparecem automaticamente neste painel. Abra o
                checkout novamente ou verifique o status caso ja tenha pago.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={redirectToCheckout}
                  disabled={isRedirecting}
                  className="w-full sm:w-auto"
                >
                  {isRedirecting ? "Abrindo checkout..." : "Ir para checkout seguro"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleVerifyPayment}
                  disabled={isRefreshingStatus}
                  className="w-full sm:w-auto"
                >
                  {isRefreshingStatus ? "Verificando..." : "Ja paguei, atualizar"}
                </Button>
              </div>
              {checkoutError && <p className="text-sm text-destructive">{checkoutError}</p>}
              {lastVerification && (
                <p className="text-xs text-muted-foreground">
                  Ultima verificacao manual: {lastVerification.toLocaleTimeString("pt-BR")}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Precisa de ajuda? Escreva para{" "}
                <a href="mailto:contato@receitasdeamor.com" className="font-semibold text-primary hover:underline">
                  contato@receitasdeamor.com
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
