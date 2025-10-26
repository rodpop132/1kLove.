import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const result = await register(form.email, form.password);

    if (!result.success) {
      setIsLoading(false);
      setError(result.error ?? "Não foi possível criar sua conta agora.");
      return;
    }

    if (result.status === 409) {
      setIsLoading(false);
      setMessage("Conta já existente. Faça login para continuar.");
      return;
    }

    const loginResult = await login(form.email, form.password);
    setIsLoading(false);

    if (loginResult.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setMessage("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto flex max-w-3xl flex-col items-center justify-center gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <Card className="w-full border border-border/60 bg-card/80">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold text-foreground sm:text-4xl">Crie seu acesso</CardTitle>
            <CardDescription className="text-base text-muted-foreground sm:text-lg">
              Garanta seu lugar na comunidade 1000 Receitas de Amor. Em breve você terá acesso completo às experiências,
              recomendações personalizadas e ao diário do casal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nome</Label>
                <Input
                  id="signup-name"
                  placeholder="Seu nome"
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">E-mail</Label>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Crie uma senha"
                  minLength={6}
                  required
                  value={form.password}
                  onChange={handleChange("password")}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={18} /> Criando acesso...
                  </>
                ) : (
                  "Começar agora"
                )}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Já possui conta?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Signup;

