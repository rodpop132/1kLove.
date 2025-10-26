import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { listMyRecipes, Recipe } from "@/lib/api";

type CategorisedRecipes = Record<string, Recipe[]>;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!user) {
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
        console.error("Erro ao carregar receitas do usuário:", err);
        setError(
          err instanceof Error ? err.message : "Não foi possível carregar suas receitas no momento.",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-5xl space-y-12 px-4 py-16 sm:px-6 sm:py-20">
        <section className="space-y-4">
          <Badge variant="secondary" className="w-fit bg-secondary/10 text-secondary-foreground">
            Em desenvolvimento
          </Badge>
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            Olá, {user.email.split("@")[0]}! Bem-vindo ao seu painel
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Consulte suas receitas acessíveis, registre memórias e acompanhe os próximos passos do relacionamento.
            {user.hasPaid
              ? " Tudo liberado para explorar!"
              : " Complete o pagamento para desbloquear o conteúdo premium."}
          </p>
        </section>

        <Card className="border border-border/60 bg-card/80">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Suas receitas</CardTitle>
              <CardDescription>
                Receitas públicas e privadas aparecem aqui assim que o pagamento é confirmado via Stripe.
              </CardDescription>
            </div>
            {!user.hasPaid && (
              <Button variant="hero" size="sm" asChild>
                <Link to="/#offer">Liberar acesso completo</Link>
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
                Assim que concluir o pagamento, suas receitas favoritas aparecerão aqui automaticamente.
              </p>
            ) : (
              <Tabs defaultValue={firstCategory} className="space-y-4">
                <TabsList>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category.replace(/_/g, " ")}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {recipesByCategory[category].map((recipe) => (
                        <div
                          key={recipe.id}
                          className="rounded-lg border border-border/60 bg-background/60 p-4 transition hover:border-primary/50 hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-lg font-semibold text-foreground">{recipe.title}</h3>
                            <span className="text-xs uppercase tracking-widest text-muted-foreground">
                              {recipe.is_public ? "Pública" : "Premium"}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">{recipe.content}</p>
                        </div>
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
              <CardTitle>Diário do casal</CardTitle>
              <CardDescription>Registre sentimentos, vitórias e próximos passos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Em breve você poderá registrar emoções diárias e acompanhar a evolução da conexão.</p>
              <p>Incluiremos anexos privados, metas semanais e alertas terapêuticos personalizados.</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Conta do casal</CardTitle>
              <CardDescription>Convide seu parceiro(a) para acompanhar tudo junto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Compartilhe acesso, sincronize progresso e definam lembretes conjuntos.</p>
              <p>Notificações push, agenda integrada e experiências gamificadas já estão no roadmap.</p>
            </CardContent>
          </Card>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 p-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Quer sugerir uma nova experiência?</p>
            <p className="text-sm text-muted-foreground">
              Envie suas ideias e construiremos juntos o banco de receitas mais completo para casais.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin">Enviar sugestão no painel admin</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

