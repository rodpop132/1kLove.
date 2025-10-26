import { Button } from "@/components/ui/button";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { CreditCard, Heart, Loader2, Shield } from "lucide-react";

const OfferSection = () => {
  const { redirectToCheckout, isRedirecting, error } = useStripeCheckout();

  return (
    <section id="offer" className="bg-card/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto max-w-5xl px-0 sm:px-0">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card to-background p-6 shadow-xl sm:p-10 animate-fade-up">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-destructive">
            <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
            Oferta de lancamento por tempo limitado
          </div>

          <header className="space-y-4 text-center animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
              Receba o ebook e a dashboard completa hoje mesmo
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              Todo o conteudo chega ao seu e-mail assim que o pagamento for confirmado. Comece em menos de cinco
              minutos.
            </p>
          </header>

          <div className="mt-10 flex flex-col gap-8 md:grid md:grid-cols-[1.2fr_1fr] md:gap-12">
            <div
              className="space-y-6 text-center md:text-left animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex flex-col items-center gap-1 md:items-start">
                <span className="text-lg text-muted-foreground line-through sm:text-xl md:text-2xl">R$ 97,00</span>
              </div>
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-end sm:justify-start">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl md:text-6xl">
                  R$ 49
                </span>
                <div className="leading-none">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                    ,99
                  </span>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">valor promocional</p>
                </div>
              </div>
              <p className="mx-auto max-w-xs text-sm text-muted-foreground sm:max-w-none sm:text-base md:mx-0">
                Em ate 12x de R$ 4,16 no cartao ou a vista no boleto/PIX.
              </p>

              <Button
                variant="hero"
                size="lg"
                className="group w-full sm:w-auto"
                onClick={redirectToCheckout}
                disabled={isRedirecting}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Redirecionando para checkout seguro...
                  </>
                ) : (
                  <>
                    <Heart
                      size={24}
                      fill="currentColor"
                      className="mr-2 transition-transform duration-300 group-hover:scale-110"
                    />
                    Quero garantir meu acesso agora
                  </>
                )}
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div
              className="space-y-5 rounded-xl border border-border/60 bg-background/80 p-6 text-left text-sm leading-relaxed text-muted-foreground md:text-base animate-fade-up"
              style={{ animationDelay: "0.18s" }}
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <p>Pagamento 100% seguro processado pela Stripe.</p>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <p>Garantia total de 7 dias: devolucao sem burocracia.</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center md:text-left">
                <p className="font-semibold text-foreground">Bonus</p>
                <p>
                  Receba atualizacoes vitalicias da biblioteca, novos desafios mensais e acesso prioritario a todos os
                  modulos futuros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
