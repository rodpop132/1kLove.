import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como recebo o webook?",
    answer:
      "Voce recebe o acesso por e-mail imediatamente apos a confirmacao do pagamento via Stripe. O conteudo fica disponivel para sempre e pode ser acessado em qualquer dispositivo.",
  },
  {
    question: "Posso usar sozinho(a)?",
    answer:
      "Sim. O material ajuda a desenvolver empatia e autoconhecimento mesmo que seu parceiro ainda nao participe. Muitos alunos comecam sozinhos e depois envolvem o parceiro.",
  },
  {
    question: "Preciso instalar algo?",
    answer:
      "Nao. O acesso e 100% online via navegador. Funciona em computadores, tablets e smartphones. Basta fazer login na dashboard exclusiva com o mesmo e-mail usado na compra.",
  },
  {
    question: "Quanto tempo leva para ver resultados?",
    answer:
      "A maioria dos casais relata melhorias na comunicacao em sete dias seguindo os rituais diarios de dez minutos. Os resultados variam conforme o comprometimento do casal.",
  },
  {
    question: "E se nao funcionar para nos?",
    answer:
      "Oferecemos garantia total de sete dias. Se voce nao sentir que o webook esta ajudando, basta solicitar o reembolso completo, sem perguntas ou complicacoes.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12 text-center sm:mb-16 animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-accent/20 px-4 py-2 text-sm font-semibold text-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Duvidas comuns
          </div>

          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Perguntas frequentes
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Tudo que voce precisa saber antes de iniciar a transformacao do relacionamento.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="rounded-lg border border-border bg-card/60 px-4 py-2 data-[state=open]:border-primary/50 sm:px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
