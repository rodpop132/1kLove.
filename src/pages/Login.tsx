import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Não foi possível acessar sua conta. Tente novamente.");
      return;
    }

    if (result.hasPaid) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/#offer");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto flex max-w-3xl flex-col items-center justify-center gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <Card className="w-full border border-border/60 bg-card/80">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold text-foreground sm:text-4xl">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-base text-muted-foreground sm:text-lg">
              Acesse o painel para continuar suas experiências de conexão. Seus dados ficam protegidos e você poderá
              retomar de onde parou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="********"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={18} /> Entrando...
                  </>
                ) : (
                  "Entrar no dashboard"
                )}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link to="/cadastro" className="font-semibold text-primary hover:underline">
                Criar acesso
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;

