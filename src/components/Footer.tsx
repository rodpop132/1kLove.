import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { Facebook, Heart, Instagram, Mail, ShieldCheck } from "lucide-react";

const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Beneficios", href: "#hero" },
  { label: "Oferta", href: "#offer" },
  { label: "FAQ", href: "#faq" },
  { label: "Admin", href: "/admin" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Facebook", href: "#", icon: Facebook },
];

const Footer = () => {
  const { redirectToCheckout, isRedirecting, error } = useStripeCheckout();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-b from-background via-background/60 to-card">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <Heart size={26} fill="currentColor" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-wide">1000 Receitas de Amor</p>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Rituais Conversas Conexao</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Um webook pratico para transformar relacionamentos com rituais diarios, conversas profundas e desafios que
              podem ser feitos mesmo em dias corridos.
            </p>

            <div className="space-y-3">
              <Button
                variant="hero"
                size="lg"
                className="w-full sm:w-auto"
                onClick={redirectToCheckout}
                disabled={isRedirecting}
              >
                {isRedirecting ? "Redirecionando..." : "Quero garantir meu acesso"}
              </Button>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={14} className="text-primary" />
                Checkout protegido pela Stripe
              </p>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </section>

          <nav className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Mapa rapido</h3>
              <div className="mt-4 flex flex-col gap-3">
                {quickLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-muted-foreground transition-transform duration-300 hover:translate-x-1 hover:text-primary"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Contato</h3>
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                <a
                  href="mailto:contato@receitasdeamor.com"
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Mail size={18} />
                  contato@receitasdeamor.com
                </a>
                <div className="flex gap-3">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="rounded-lg border border-border bg-muted/40 p-2 transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <Card id="login" className="backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Acesse sua conta</CardTitle>
              <CardDescription>Use o login dedicado para acompanhar os seus favoritos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="footer-email">E-mail</Label>
                <Input id="footer-email" type="email" placeholder="voce@email.com" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer-password">Senha</Label>
                <Input id="footer-password" type="password" placeholder="********" autoComplete="current-password" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="w-full sm:flex-1">
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="outline" asChild className="w-full sm:flex-1">
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Em breve voce podera acompanhar progresso, favoritar receitas e receber notificacoes semanais.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/20 px-6 py-4 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span className="flex items-center gap-2 text-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Pagamento protegido por SSL
          </span>
          <span>Acesso imediato ao confirmar o pagamento</span>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>{new Date().getFullYear()} 1000 Receitas de Amor. Todos os direitos reservados.</p>
          <p className="mt-2">
            Material educativo. Resultados variam conforme o comprometimento do casal e nao substituem acompanhamento
            profissional.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
