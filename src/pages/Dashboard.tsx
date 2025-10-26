import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { listMyRecipes, Recipe } from "@/lib/api";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";

type CategorisedRecipes = Record<string, Recipe[]>;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { redirectToCheckout, isRedirecting, error: checkoutError } = useStripeCheckout();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="relative container mx-auto max-w-5xl space-y-12 px-4 py-16 sm:px-6 sm:py-20">
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
                <TabsList className="flex w-full flex-wrap gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid gap-4 sm:grid-cols-2">
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

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Diario do casal</CardTitle>
              <CardDescription>Registre sentimentos, vitorias e proximas metas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Em breve voce podera registrar emocoes diarias e acompanhar a evolucao da conexao.</p>
              <p>Incluiremos anexos privados, metas semanais e alertas personalizados.</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Conta do casal</CardTitle>
              <CardDescription>Convide seu parceiro para acompanhar tudo junto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Compartilhe acesso, sincronize progresso e definam lembretes conjuntos.</p>
              <p>Notificacoes push, agenda integrada e experiencias gamificadas ja estao no roadmap.</p>
            </CardContent>
          </Card>
        </section>

        <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-muted/20 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Quer sugerir uma nova experiencia?</p>
            <p className="text-sm text-muted-foreground">
              Envie suas ideias e construiremos juntos o banco de receitas mais completo para casais.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin">Enviar sugestao no painel admin</Link>
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
                  onClick={() => {
                    setIsRefreshingStatus(true);
                    refreshUser()
                      .catch((err) => console.warn("Falha ao verificar status:", err))
                      .finally(() => setIsRefreshingStatus(false));
                  }}
                  disabled={isRefreshingStatus}
                  className="w-full sm:w-auto"
                >
                  {isRefreshingStatus ? "Verificando..." : "Ja paguei, atualizar"}
                </Button>
              </div>
              {checkoutError && <p className="text-sm text-destructive">{checkoutError}</p>}
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
