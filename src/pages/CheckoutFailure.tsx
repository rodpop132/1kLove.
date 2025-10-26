import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const CheckoutFailure = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto flex max-w-3xl flex-col items-center justify-center gap-10 px-4 py-16 text-center sm:px-6 sm:py-20">
        <Card className="w-full border border-destructive/40 bg-destructive/5">
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <span className="rounded-full bg-destructive/20 p-4 text-destructive">
              <AlertTriangle size={40} />
            </span>
            <CardTitle className="text-3xl font-bold text-foreground sm:text-4xl">Pagamento não concluído</CardTitle>
            <CardDescription className="text-base text-muted-foreground sm:text-lg">
              Parece que houve um problema ao finalizar a cobrança. Sem o pagamento, o acesso ao webook ainda não foi
              liberado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-destructive/30 bg-background/60 p-6 text-left text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>• Confirme os dados do cartão ou tente outro método de pagamento.</p>
              <p className="mt-3">
                • Se o problema continuar, fale conosco pelo e-mail{" "}
                <span className="font-semibold text-foreground">contato@receitasdeamor.com</span> para receber suporte
                imediato.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/#offer">Tentar novamente</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Voltar para a página inicial</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CheckoutFailure;

