import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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
  updateAdminUser,
  uploadAdminImage,
} from "@/lib/api";
import { Loader2, Lock, Unlock } from "lucide-react";

type AdminData = {
  recipes: Recipe[];
  stats: Awaited<ReturnType<typeof getAdminStats>>;
  users: Awaited<ReturnType<typeof getAdminUsers>>["items"];
  payments: Awaited<ReturnType<typeof getAdminPayments>>["items"];
};

const defaultForm: AdminRecipePayload = {
  title: "",
  content: "",
  category: "",
  is_public: false,
  image_url: "",
};

const Admin = () => {
  const { admin, adminLogin, clearAdmin } = useAuth();
  const { toast } = useToast();

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipeForm, setRecipeForm] = useState(defaultForm);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [activeUserAction, setActiveUserAction] = useState<number | null>(null);

  const loadAdminData = useCallback(
    async (authHeader: string) => {
      setIsLoading(true);
      setDashboardError(null);
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
      } catch (error) {
        console.error("Falha ao carregar dados administrativos:", error);
        const message =
          error instanceof Error ? error.message : "Nao foi possivel carregar os dados administrativos.";
        setDashboardError(message);
        toast({
          title: "Erro ao sincronizar dados",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDashboardError(null);
    setIsLoading(true);

    const result = await adminLogin(credentials.username, credentials.password);
    if (!result.success) {
      setIsLoading(false);
      const message = result.error ?? "Credenciais invalidas. Verifique usuario e senha.";
      setDashboardError(message);
      toast({
        title: "Nao foi possivel entrar",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setAdminData({
      recipes: result.data!.recipes.items,
      stats: result.data!.stats,
      users: result.data!.users.items,
      payments: result.data!.payments.items,
    });
    setIsLoading(false);
    toast({
      title: "Sessao iniciada",
      description: "Bem-vindo de volta ao painel administrativo.",
    });
  };

  useEffect(() => {
    if (!admin) {
      setAdminData(null);
    }
  }, [admin]);

  const handleCreateRecipe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!admin) return;
    setIsSubmitting(true);
    setDashboardError(null);

    try {
      await createAdminRecipe(admin.header, {
        ...recipeForm,
        image_url: recipeForm.image_url ? recipeForm.image_url : undefined,
      });
      setRecipeForm(defaultForm);
      setImageUploadError(null);
      toast({
        title: "Receita publicada",
        description: "A experiencia foi adicionada com sucesso para os assinantes.",
      });
      await loadAdminData(admin.header);
    } catch (error) {
      console.error("Falha ao criar receita:", error);
      const message = error instanceof Error ? error.message : "Nao foi possivel criar a receita.";
      setDashboardError(message);
      toast({
        title: "Erro ao publicar receita",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecipeImageUpload = async (file: File | null) => {
    if (!admin || !file) return;
    setIsUploadingImage(true);
    setImageUploadError(null);

    try {
      const response = await uploadAdminImage(admin.header, file);
      setRecipeForm((prev) => ({ ...prev, image_url: response.url }));
      toast({
        title: "Imagem carregada",
        description: "URL adicionada automaticamente ao formulario.",
      });
    } catch (error) {
      console.error("Falha ao enviar imagem:", error);
      const message = error instanceof Error ? error.message : "Nao foi possivel carregar a imagem.";
      setImageUploadError(message);
      toast({
        title: "Erro ao carregar imagem",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleToggleRecipe = async (recipe: Recipe) => {
    if (!admin) return;
    setIsLoading(true);
    setDashboardError(null);
    try {
      await updateAdminRecipe(admin.header, recipe.id, {
        title: recipe.title,
        content: recipe.content,
        category: recipe.category ?? "geral",
        is_public: !recipe.is_public,
        image_url: recipe.image_url ?? undefined,
      });
      toast({
        title: "Visibilidade atualizada",
        description: recipe.is_public
          ? "A receita agora esta marcada como premium."
          : "A receita agora esta disponivel como publica.",
      });
      await loadAdminData(admin.header);
    } catch (error) {
      console.error("Falha ao atualizar receita:", error);
      const message = error instanceof Error ? error.message : "Nao foi possivel atualizar esta receita.";
      setDashboardError(message);
      toast({
        title: "Erro ao atualizar receita",
        description: message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (!admin) return;
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta receita?");
    if (!confirmDelete) return;

    setIsLoading(true);
    setDashboardError(null);
    try {
      await deleteAdminRecipe(admin.header, recipeId);
      toast({
        title: "Receita removida",
        description: "O conteudo nao aparece mais para os usuarios.",
      });
      await loadAdminData(admin.header);
    } catch (error) {
      console.error("Falha ao remover receita:", error);
      const message = error instanceof Error ? error.message : "Nao foi possivel excluir esta receita.";
      setDashboardError(message);
      toast({
        title: "Erro ao excluir receita",
        description: message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleToggleUserPaid = async (userId: number, hasPaid: boolean) => {
    if (!admin) return;
    setActiveUserAction(userId);
    setDashboardError(null);

    try {
      await updateAdminUser(admin.header, userId, { has_paid: !hasPaid });
      toast({
        title: !hasPaid ? "Acesso liberado" : "Acesso premium removido",
        description: !hasPaid
          ? "O utilizador agora esta marcado como pagante."
          : "O utilizador foi marcado como pendente.",
      });
      await loadAdminData(admin.header);
    } catch (error) {
      console.error("Falha ao atualizar utilizador:", error);
      const message = error instanceof Error ? error.message : "Nao foi possivel atualizar os dados do usuario.";
      setDashboardError(message);
      toast({
        title: "Erro ao atualizar utilizador",
        description: message,
        variant: "destructive",
      });
    } finally {
      setActiveUserAction(null);
    }
  };

  const handleUpdateUserEmail = async (userId: number, currentEmail: string) => {
    if (!admin) return;
    const newEmail = window.prompt("Novo e-mail para o utilizador:", currentEmail);
    if (!newEmail || newEmail === currentEmail) return;

    setActiveUserAction(userId);
    setDashboardError(null);
    try {
      await updateAdminUser(admin.header, userId, { email: newEmail });
      toast({
        title: "E-mail atualizado",
        description: `O utilizador agora utiliza ${newEmail}.`,
      });
      await loadAdminData(admin.header);
    } catch (error) {
      console.error("Falha ao atualizar e-mail:", error);
      const message = error instanceof Error ? error.message : "Nao foi possivel atualizar o e-mail.";
      setDashboardError(message);
      toast({
        title: "Erro ao atualizar e-mail",
        description: message,
        variant: "destructive",
      });
    } finally {
      setActiveUserAction(null);
    }
  };

  const handleResetUserPassword = async (userId: number) => {
    if (!admin) return;
    const newPassword = window.prompt("Informe a nova senha temporaria para este utilizador:");
    if (!newPassword) return;

    setActiveUserAction(userId);
    setDashboardError(null);
    try {
      await updateAdminUser(admin.header, userId, { new_password: newPassword });
      toast({
        title: "Senha atualizada",
        description: "A nova senha foi aplicada com sucesso.",
      });
    } catch (error) {
      console.error("Falha ao redefinir senha:", error);
      const message = error instanceof Error ? error.message : "Nao foi possivel redefinir a senha.";
      setDashboardError(message);
      toast({
        title: "Erro ao redefinir senha",
        description: message,
        variant: "destructive",
      });
    } finally {
      setActiveUserAction(null);
    }
  };

  const formattedPayments = useMemo(() => {
    if (!adminData) return [];
    return adminData.payments.map((payment) => {
      const cents = Number.isFinite(payment.amount_cents)
        ? payment.amount_cents
        : Number.isFinite(payment.amount_total)
          ? payment.amount_total
          : 0;
      const currencyCode = payment.currency ? payment.currency.toUpperCase() : "BRL";
      const timestamp = payment.paid_at ?? payment.created_at ?? null;
      return {
        ...payment,
        amount: (cents / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: currencyCode,
        }),
        timestamp,
      };
    });
  }, [adminData]);

  const adminStatsSummary = useMemo(() => {
    if (!adminData) return null;
    const totalCents = Number.isFinite(adminData.stats.payments.total_amount_cents)
      ? adminData.stats.payments.total_amount_cents
      : 0;
    const currencyCode =
      adminData.stats.payments.currency && adminData.stats.payments.currency.length > 0
        ? adminData.stats.payments.currency.toUpperCase()
        : "BRL";
    const totalFormatted = (totalCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: currencyCode,
    });

    return {
      users: adminData.stats.users,
      recipes: adminData.stats.recipes,
      payments: {
        ...adminData.stats.payments,
        currencyCode,
        totalFormatted,
      },
    };
  }, [adminData]);

  if (!admin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto flex max-w-3xl flex-col items-center justify-center gap-10 px-4 py-16 sm:px-6 sm:py-20">
          <Card className="w-full border border-border/60 bg-card/80">
            <CardHeader className="space-y-3 text-center">
              <Badge variant="outline" className="mx-auto w-fit border-destructive/40 bg-destructive/10 text-destructive">
                Area restrita
              </Badge>
              <CardTitle className="text-3xl font-bold text-foreground sm:text-4xl">Login administrativo</CardTitle>
              <CardDescription className="text-base text-muted-foreground sm:text-lg">
                Apenas gestores autorizados podem gerir receitas. Utilize as credenciais dedicadas da equipa editorial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Usuario</Label>
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
                {dashboardError && <p className="text-sm text-destructive">{dashboardError}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validando acesso...
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit border-primary/40 bg-primary/10 text-primary">
                Painel interno
              </Badge>
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
                Gerir receitas e comunidade
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                Veja estatisticas em tempo real, publique novas experiencias e acompanhe pagamentos confirmados na Stripe.
              </p>
            </div>
            <Button variant="outline" onClick={clearAdmin} className="self-start">
              Encerrar sessao
            </Button>
          </div>
          {dashboardError && <p className="text-sm text-destructive">{dashboardError}</p>}
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Adicionar nova receita</CardTitle>
              <CardDescription>Preencha os campos para publicar imediatamente para os assinantes.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRecipe} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipe-title">Titulo</Label>
                  <Input
                    id="recipe-title"
                    placeholder="Jantar tematico surpresa"
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
                  <Label htmlFor="recipe-image-url">Imagem (opcional)</Label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Input
                      id="recipe-image-url"
                      type="url"
                      placeholder="https://cdn.seusite.com/imagem.jpg"
                      value={recipeForm.image_url ?? ""}
                      onChange={(event) => setRecipeForm((prev) => ({ ...prev, image_url: event.target.value }))}
                    />
                    <Input
                      id="recipe-image-file"
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage}
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        void handleRecipeImageUpload(file);
                        event.target.value = "";
                      }}
                    />
                  </div>
                  {isUploadingImage && <p className="text-xs text-muted-foreground">Carregando imagem...</p>}
                  {imageUploadError && <p className="text-xs text-destructive">{imageUploadError}</p>}
                  {recipeForm.image_url && (
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-3 text-xs text-muted-foreground">
                      <img
                        src={recipeForm.image_url}
                        alt="Preview da receita"
                        className="h-16 w-16 rounded object-cover"
                      />
                      <span className="break-all">{recipeForm.image_url}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipe-content">Conteudo</Label>
                  <Textarea
                    id="recipe-content"
                    rows={6}
                    placeholder="1. Prepare o ambiente...\n2. Defina as regras...\n3. Sugestoes de conversa..."
                    value={recipeForm.content}
                    onChange={(event) => setRecipeForm((prev) => ({ ...prev, content: event.target.value }))}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/40 p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <span>Visibilidade atual: {recipeForm.is_public ? "publica" : "premium"}</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRecipeForm((prev) => ({ ...prev, is_public: !prev.is_public }))}
                  >
                    {recipeForm.is_public ? "Marcar como premium" : "Marcar como publica"}
                  </Button>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publicando...
                    </>
                  ) : (
                    "Publicar receita"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {adminStatsSummary && (
            <Card className="border border-border/60 bg-card/80">
              <CardHeader>
                <CardTitle>Estatisticas gerais</CardTitle>
                <CardDescription>Resumo gerado diretamente pela API.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">Utilizadores</p>
                  <p>Total: {adminStatsSummary.users.total}</p>
                  <p>Pagos: {adminStatsSummary.users.paid}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Receitas</p>
                  <p>Total: {adminStatsSummary.recipes.total}</p>
                  <p>Publicas: {adminStatsSummary.recipes.public}</p>
                  <p>Premium: {adminStatsSummary.recipes.private}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Pagamentos</p>
                  <p>Faturamento: {adminStatsSummary.payments.totalFormatted}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => admin && loadAdminData(admin.header)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...
                    </>
                  ) : (
                    "Atualizar dados"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <Card className="border border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Receitas cadastradas</CardTitle>
            <CardDescription>Alterar visibilidade ou remover conteudo rapidamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && !adminData ? (
              <p className="text-sm text-muted-foreground">Carregando receitas...</p>
            ) : adminData && adminData.recipes.length > 0 ? (
                adminData.recipes.map((recipe) => (
                  <article
                    key={recipe.id}
                    className="flex flex-col gap-3 rounded-lg border border-border/50 bg-background/40 p-4 transition hover:border-primary/50 hover:bg-primary/5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      {recipe.image_url && (
                        <img
                          src={recipe.image_url}
                          alt={`Imagem da receita ${recipe.title}`}
                          className="h-24 w-full rounded object-cover md:h-20 md:w-32"
                        />
                      )}
                      <p className="text-lg font-semibold text-foreground">{recipe.title}</p>
                      <p className="text-sm text-muted-foreground">{recipe.content}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                      <span>{recipe.category ?? "sem categoria"}</span>
                      <span>-</span>
                      <span>{recipe.is_public ? "publica" : "premium"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleToggleRecipe(recipe)} disabled={isLoading}>
                      {recipe.is_public ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" /> Tornar premium
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" /> Tornar publica
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
                </article>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma receita cadastrada ate o momento. Adicione uma acima para comecar.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Usuarios registados</CardTitle>
              <CardDescription>Status de pagamento e acesso.</CardDescription>
            </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {adminData?.users.length ? (
                  adminData.users.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-3 rounded-lg border border-border/40 bg-background/40 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <span className="font-semibold text-foreground">{item.email}</span>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">ID {item.id}</p>
                        </div>
                        <Badge variant={item.has_paid ? "secondary" : "outline"}>
                          {item.has_paid ? "Pago" : "Pendente"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={item.has_paid ? "outline" : "secondary"}
                          size="sm"
                          onClick={() => handleToggleUserPaid(item.id, item.has_paid)}
                          disabled={activeUserAction === item.id}
                        >
                          {activeUserAction === item.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...
                            </>
                          ) : item.has_paid ? (
                            "Marcar como pendente"
                          ) : (
                            "Liberar acesso premium"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateUserEmail(item.id, item.email)}
                          disabled={activeUserAction === item.id}
                        >
                          Atualizar e-mail
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary"
                          onClick={() => handleResetUserPassword(item.id)}
                          disabled={activeUserAction === item.id}
                        >
                          Redefinir senha
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nenhum usuario registado encontrado.</p>
                )}
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Pagamentos recentes</CardTitle>
              <CardDescription>Conferencia rapida dos pagamentos processados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                {formattedPayments.length ? (
                  formattedPayments.map((payment) => (
                    <div key={payment.id} className="rounded-lg border border-border/40 bg-background/40 p-3 leading-relaxed">
                      <p className="font-semibold text-foreground">{payment.email}</p>
                      <p>{payment.amount}</p>
                      <p className="text-xs uppercase tracking-widest">
                        {payment.timestamp ? new Date(payment.timestamp).toLocaleString("pt-BR") : "Sem data"}
                      </p>
                      {payment.session_id && (
                        <p className="text-[11px] text-muted-foreground">Sessao: {payment.session_id}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>Nenhum pagamento encontrado.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
