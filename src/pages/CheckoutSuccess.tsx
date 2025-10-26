import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto flex max-w-3xl flex-col items-center justify-center gap-10 px-4 py-16 text-center sm:px-6 sm:py-20">
        <Card className="w-full border border-primary/40 bg-primary/5">
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <span className="rounded-full bg-primary/20 p-4 text-primary">
              <CheckCircle2 size={40} />
            </span>
            <CardTitle className="text-3xl font-bold text-foreground sm:text-4xl">Pagamento confirmado!</CardTitle>
            <CardDescription className="text-base text-muted-foreground sm:text-lg">
              Seu acesso ao webook 1000 Receitas de Amor foi liberado. Em instantes voce recebe um e-mail com os detalhes
              e instrucoes de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-primary/30 bg-background/60 p-6 text-left text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>- O pagamento foi processado com seguranca pela Stripe.</p>
              <p className="mt-3">
                - Voce ja pode acessar o dashboard e explorar as primeiras experiencias para colocar em pratica hoje
                mesmo.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/dashboard">Ir para o dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Voltar para a pagina inicial</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CheckoutSuccess;
