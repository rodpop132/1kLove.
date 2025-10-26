import { Button } from "@/components/ui/button";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { CreditCard, Heart, Loader2, Shield } from "lucide-react";

const OfferSection = () => {
  const { redirectToCheckout, isRedirecting, error } = useStripeCheckout();

  return (
    <section id="offer" className="bg-card/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-card to-background p-6 animate-fade-up sm:p-8 md:p-12">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 h-64 w-64 -z-10 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -z-10 rounded-full bg-secondary/10 blur-3xl" />

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive animate-fade-up">
            <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
            Lançamento promocional — termina em 48h
          </div>

          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold leading-tight animate-fade-up md:text-5xl">
              <span className="text-foreground">Transforme seu relacionamento</span>
              <br />
              <span className="relative mt-2 inline-block">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-4xl text-transparent animate-gradient md:text-6xl">
                  hoje mesmo
                </span>
                <div className="absolute -inset-2 -z-10 bg-primary/10 blur-xl" />
              </span>
            </h2>

            {/* Price */}
            <div className="space-y-4 py-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div>
                <span className="text-2xl text-muted-foreground line-through md:text-3xl">R$ 97,00</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-7xl">
                  R$ 49
                </span>
                <div className="text-left">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl">
                    ,99
                  </span>
                  <p className="text-xs text-muted-foreground">por tempo limitado</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                À vista ou <span className="font-semibold text-foreground">12x de R$ 4,16</span> no cartão
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-500">
                Economize R$ 47,01 hoje!
              </div>
            </div>

            {/* CTA Button */}
            <Button
              variant="hero"
              size="xl"
              className="group w-full text-lg animate-fade-up md:w-auto"
              onClick={redirectToCheckout}
              disabled={isRedirecting}
              style={{ animationDelay: "0.2s" }}
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  Redirecionando para checkout seguro...
                </>
              ) : (
                <>
                  <Heart
                    size={24}
                    fill="currentColor"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  Garantir meu acesso agora
                </>
              )}
            </Button>
            {error && (
              <p className="text-sm text-destructive animate-fade-up" style={{ animationDelay: "0.25s" }}>
                {error}
              </p>
            )}

            {/* Trust Badges */}
            <div
              className="grid gap-6 border-t border-border pt-8 animate-fade-up md:grid-cols-3"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-center gap-3">
                <Shield className="text-primary flex-shrink-0" size={24} />
                <p className="text-sm text-muted-foreground text-left">Pagamento 100% seguro via Stripe</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Heart className="text-primary flex-shrink-0" size={24} />
                <p className="text-sm text-muted-foreground text-left">Acesso imediato após pagamento</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CreditCard className="text-primary flex-shrink-0" size={24} />
                <p className="text-sm text-muted-foreground text-left">Garantia total de 7 dias</p>
              </div>
            </div>

            {/* Guarantee Text */}
            <div className="mt-8 rounded-lg bg-muted/50 p-6 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Garantia total:</span> Se não sentir mudança em 7 dias,
                devolvemos seu dinheiro. Sem perguntas, sem complicações.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;

