import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { Facebook, Heart, Instagram, Mail, ShieldCheck } from "lucide-react";

const quickLinks = [
  { label: "Início", href: "/" },
  { label: "Sobre o webook", href: "#hero" },
  { label: "Perguntas frequentes", href: "#faq" },
  { label: "Termos de uso", href: "#" },
  { label: "Política de privacidade", href: "#" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Facebook", href: "#", icon: Facebook },
];

const Footer = () => {
  const { redirectToCheckout, isRedirecting, error } = useStripeCheckout();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-b from-background via-background/60 to-card">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <Heart size={26} fill="currentColor" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-wide">1000 Receitas de Amor</p>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Rituais • Conversas • Conexão</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Um webook prático para transformar relacionamentos com rituais diários, conversas profundas e experiências
              que criam memórias significativas a dois.
            </p>
            <div className="space-y-2">
              <Button variant="hero" size="lg" className="group w-full sm:w-auto" onClick={redirectToCheckout} disabled={isRedirecting}>
                {isRedirecting ? "Redirecionando..." : "Quero garantir meu acesso"}
              </Button>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={14} className="text-primary" />
                Checkout 100% seguro via Stripe
              </p>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </div>

          {/* Links & contact */}
          <div className="space-y-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Mapa rápido</h3>
              <nav className="mt-4 flex flex-col gap-3">
                {quickLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-muted-foreground transition-transform duration-300 hover:translate-x-1 hover:text-primary"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Contato</h3>
              <div className="mt-4 space-y-4">
                <a
                  href="mailto:contato@receitasdeamor.com"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
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
                      className="rounded-lg border border-border bg-muted/40 p-2 transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_20px_rgba(225,29,72,0.25)]"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Login panel (direciona para páginas dedicadas) */}
          <Card id="login" className="animate-fade-up backdrop-blur" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Acesse sua conta</CardTitle>
              <CardDescription>Faça login ou crie uma conta para acompanhar as receitas favoritas.</CardDescription>
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
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Em breve você poderá acessar o painel completo com receitas, favoritos e acompanhamento diário.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security ribbon */}
        <div className="mt-12 flex justify-center animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-muted/30 px-6 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Pagamento protegido por SSL
            </span>
            <span className="hidden h-4 w-px bg-border md:block" />
            <span className="hidden md:block">Acesso imediato ao confirmar o pagamento</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground animate-fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          <p>© {new Date().getFullYear()} 1000 Receitas de Amor. Todos os direitos reservados.</p>
          <p className="mt-2">
            Material educativo. Resultados variam conforme o comprometimento do casal e não substituem acompanhamento
            profissional quando necessário.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

