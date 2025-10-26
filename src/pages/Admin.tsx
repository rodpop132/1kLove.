import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  AdminRecipePayload,
  createAdminRecipe,
  deleteAdminRecipe,
  getAdminPayments,
  getAdminRecipes,
  getAdminStats,
  getAdminUsers,
  Recipe,
  updateAdminRecipe,
} from "@/lib/api";
import { Loader2, Lock, Unlock } from "lucide-react";

type AdminData = {
  recipes: Recipe[];
  stats: Awaited<ReturnType<typeof getAdminStats>>;
  users: Awaited<ReturnType<typeof getAdminUsers>>["items"];
  payments: Awaited<ReturnType<typeof getAdminPayments>>["items"];
};

const defaultRecipe: AdminRecipePayload = {
  title: "",
  content: "",
  category: "",
  is_public: false,
};

const Admin = () => {
  const { admin, adminLogin, clearAdmin } = useAuth();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipeForm, setRecipeForm] = useState(defaultRecipe);
  const [isSubmittingRecipe, setIsSubmittingRecipe] = useState(false);

  const appliedAdmin = admin?.header ?? "";

  const loadAdminData = useCallback(
    async (authHeader: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const [recipesRes, statsRes, usersRes, paymentsRes] = await Promise.all([
          getAdminRecipes(authHeader),
          getAdminStats(authHeader),
          getAdminUsers(authHeader),
          getAdminPayments(authHeader),
        ]);
        setAdminData({
          recipes: recipesRes.items,
          stats: statsRes,
          users: usersRes.items,
          payments: paymentsRes.items,
        });
      } catch (err) {
        console.error("Falha ao carregar dados administrativos:", err);
        setError(
          err instanceof Error ? err.message : "Não foi possível carregar os dados administrativos agora.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await adminLogin(credentials.username, credentials.password);
    if (!result.success) {
      setIsLoading(false);
      setError(result.error ?? "Credenciais inválidas. Verifique usuário e senha.");
      return;
    }

    setAdminData({
      recipes: result.data!.recipes.items,
      stats: result.data!.stats,
      users: result.data!.users.items,
      payments: result.data!.payments.items,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!admin) {
      setAdminData(null);
    }
  }, [admin]);

  const handleCreateRecipe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!admin) return;
    setIsSubmittingRecipe(true);
    setError(null);
    try {
      await createAdminRecipe(admin.header, recipeForm);
      setRecipeForm(defaultRecipe);
      await loadAdminData(admin.header);
    } catch (err) {
      console.error("Falha ao criar receita:", err);
      setError(err instanceof Error ? err.message : "Não foi possível criar a receita agora.");
    } finally {
      setIsSubmittingRecipe(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (!admin) return;
    setIsLoading(true);
    try {
      await deleteAdminRecipe(admin.header, recipeId);
      await loadAdminData(admin.header);
    } catch (err) {
      console.error("Falha ao excluir receita:", err);
      setError(err instanceof Error ? err.message : "Não foi possível excluir a receita.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRecipeVisibility = async (recipe: Recipe) => {
    if (!admin) return;
    setIsLoading(true);
    try {
      await updateAdminRecipe(admin.header, recipe.id, {
        title: recipe.title,
        content: recipe.content,
        category: recipe.category ?? "geral",
        is_public: !recipe.is_public,
      });
      await loadAdminData(admin.header);
    } catch (err) {
      console.error("Falha ao atualizar receita:", err);
      setError(err instanceof Error ? err.message : "Não foi possível atualizar a receita.");
    } finally {
      setIsLoading(false);
    }
  };

  const formattedPayments = useMemo(() => {
    if (!adminData) return [];
    return adminData.payments.map((payment) => ({
      ...payment,
      amount: (payment.amount_cents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: payment.currency.toUpperCase(),
      }),
    }));
  }, [adminData]);

  if (!admin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto flex max-w-3xl flex-col items-center justify-center gap-10 px-4 py-16 sm:px-6 sm:py-20">
          <Card className="w-full border border-border/70 bg-card/80">
            <CardHeader className="space-y-3 text-center">
              <Badge
                variant="outline"
                className="mx-auto w-fit border-destructive/40 bg-destructive/10 text-destructive"
              >
                Área restrita
              </Badge>
              <CardTitle className="text-3xl font-bold text-foreground sm:text-4xl">Login administrativo</CardTitle>
              <CardDescription className="text-base text-muted-foreground sm:text-lg">
                Apenas gestores autorizados podem cadastrar e editar receitas. Utilize as credenciais exclusivas da
                equipe editorial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Usuário</Label>
                  <Input
                    id="admin-username"
                    autoComplete="username"
                    placeholder="admin"
                    value={credentials.username}
                    onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Senha</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="senha administrativa"
                    value={credentials.password}
                    onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} /> Validando acesso...
                    </>
                  ) : (
                    "Entrar no painel admin"
                  )}
                </Button>
              </form>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Dica: mantenha esta URL apenas com quem faz a curadoria das receitas do webook.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-5xl space-y-12 px-4 py-16 sm:px-6 sm:py-20">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit border-primary/40 bg-primary/10 text-primary">
                Painel interno
              </Badge>
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
                Painel administrativo de receitas
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                Utilize este painel para gerir o catálogo do webook. Dados reais são exibidos diretamente da API.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                clearAdmin();
                setAdminData(null);
              }}
            >
              Encerrar sessão admin
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Adicionar nova receita</CardTitle>
              <CardDescription>
                Cadastre o conteúdo que aparecerá para os usuários. Escolha se ela será pública ou premium.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRecipe} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipe-title">Título</Label>
                  <Input
                    id="recipe-title"
                    placeholder="Jantar temático surpresa"
                    value={recipeForm.title}
                    onChange={(event) => setRecipeForm((prev) => ({ ...prev, title: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipe-category">Categoria</Label>
                  <Input
                    id="recipe-category"
                    placeholder="desafios, rituais..."
                    value={recipeForm.category}
                    onChange={(event) => setRecipeForm((prev) => ({ ...prev, category: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipe-content">Conteúdo</Label>
                  <Textarea
                    id="recipe-content"
                    placeholder="1. Prepare o ambiente...\n2. Defina as regras...\n3. Sugestões de conversa..."
                    rows={6}
                    value={recipeForm.content}
                    onChange={(event) => setRecipeForm((prev) => ({ ...prev, content: event.target.value }))}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Visibilidade: {recipeForm.is_public ? "Pública" : "Premium"}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRecipeForm((prev) => ({ ...prev, is_public: !prev.is_public }))}
                  >
                    {recipeForm.is_public ? "Marcar como premium" : "Marcar como pública"}
                  </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmittingRecipe}>
                  {isSubmittingRecipe ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} /> Publicando...
                    </>
                  ) : (
                    "Publicar receita"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Estatísticas gerais</CardTitle>
              <CardDescription>Resumo automático atualizado em tempo real a partir da API.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {isLoading && !adminData ? (
                <p>Carregando dados...</p>
              ) : adminData ? (
                <>
                  <div>
                    <p className="font-semibold text-foreground">Utilizadores</p>
                    <p>Total: {adminData.stats.users.total}</p>
                    <p>Pagos: {adminData.stats.users.paid}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Receitas</p>
                    <p>Total: {adminData.stats.recipes.total}</p>
                    <p>Públicas: {adminData.stats.recipes.public}</p>
                    <p>Premium: {adminData.stats.recipes.private}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Pagamentos</p>
                    <p>
                      Volume:{" "}
                      {(adminData.stats.payments.total_amount_cents / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: adminData.stats.payments.currency.toUpperCase(),
                      })}
                    </p>
                  </div>
                </>
              ) : (
                <p>Sem dados carregados.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Receitas cadastradas</CardTitle>
            <CardDescription>Gerencie visibilidade ou remova conteúdos rapidamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && !adminData ? (
              <p className="text-sm text-muted-foreground">Carregando receitas...</p>
            ) : adminData && adminData.recipes.length > 0 ? (
              adminData.recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/50 bg-background/40 p-4 transition hover:border-primary/50 hover:bg-primary/5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground">{recipe.title}</p>
                    <p className="text-sm text-muted-foreground">{recipe.content}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                      <span>{recipe.category ?? "sem categoria"}</span>
                      <span>•</span>
                      <span>{recipe.is_public ? "Pública" : "Premium"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRecipeVisibility(recipe)}
                      disabled={isLoading}
                    >
                      {recipe.is_public ? (
                        <>
                          <Lock className="mr-2" size={16} /> Tornar premium
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2" size={16} /> Tornar pública
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      disabled={isLoading}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma receita cadastrada até o momento. Adicione uma acima para começar.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Usuários registados</CardTitle>
              <CardDescription>Status de pagamento e acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {adminData?.users.length ? (
                adminData.users.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 p-3"
                  >
                    <span>{user.email}</span>
                    <Badge variant={user.has_paid ? "secondary" : "outline"}>
                      {user.has_paid ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p>Nenhum usuário registado encontrado.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Pagamentos recentes</CardTitle>
              <CardDescription>Conferência rápida dos pagamentos processados na Stripe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {formattedPayments.length ? (
                formattedPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-lg border border-border/40 bg-background/40 p-3 leading-relaxed"
                  >
                    <p className="font-semibold text-foreground">{payment.email}</p>
                    <p>{payment.amount}</p>
                    <p className="text-xs uppercase tracking-widest">
                      {new Date(payment.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))
              ) : (
                <p>Nenhum pagamento encontrado nesta conta ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => admin && loadAdminData(admin.header)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={16} /> Atualizando...
              </>
            ) : (
              "Atualizar dados"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Admin;
