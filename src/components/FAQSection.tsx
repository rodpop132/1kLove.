import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como recebo o webook?",
    answer:
      "Você recebe o acesso por e-mail imediatamente após a confirmação do pagamento via Stripe. O conteúdo fica disponível para sempre e pode ser acessado em qualquer dispositivo.",
  },
  {
    question: "Posso usar sozinho(a)?",
    answer:
      "Sim. O material ajuda a desenvolver empatia e autoconhecimento, mesmo que seu parceiro(a) ainda não participe. Muitos alunos começam sozinhos e depois envolvem o parceiro.",
  },
  {
    question: "Preciso instalar algo?",
    answer:
      "Não. O acesso é 100% online via navegador. Funciona em computadores, tablets e smartphones. Basta fazer login na dashboard exclusiva com o mesmo e-mail usado na compra.",
  },
  {
    question: "Quanto tempo leva para ver resultados?",
    answer:
      "A maioria dos casais relata melhorias na comunicação em 7 dias seguindo os rituais diários de 10 minutos. Os resultados variam conforme o comprometimento do casal.",
  },
  {
    question: "E se não funcionar para nós?",
    answer:
      "Oferecemos garantia total de 7 dias. Se você não sentir que o webook está ajudando, basta solicitar o reembolso completo, sem perguntas ou complicações.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12 animate-fade-up text-center sm:mb-16">
          <div className="mb-6 inline-block rounded-full border border-border bg-accent/50 px-4 py-2 text-sm font-semibold text-foreground">
            Dúvidas comuns
          </div>

          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="text-foreground">Perguntas</span>{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              frequentes
            </span>
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Tudo que você precisa saber antes de{" "}
            <span className="font-semibold text-foreground">começar sua transformação</span>
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="space-y-4 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="rounded-lg border border-border bg-card px-4 py-2 data-[state=open]:border-primary/50 sm:px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
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

