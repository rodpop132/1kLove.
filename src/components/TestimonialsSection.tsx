import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Marina e Lucas",
    years: "10 anos juntos",
    quote: "Voltamos a conversar com calma depois de anos tentando sem sucesso.",
  },
  {
    name: "Juliana S.",
    years: "5 anos de casamento",
    quote: "As atividades sao simples, mas o efeito na nossa rotina foi gigante.",
  },
  {
    name: "Pedro e Ana",
    years: "3 anos juntos",
    quote: "O material ajudou a transformar discussoes em combinados claros.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            Depoimentos reais
          </div>

          <h2 className="text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Casais que transformaram a rotina em momentos especiais
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Mais de 95% relatam melhora na comunicacao em sete dias seguindo os rituais propostos.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-border bg-card/80 p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={18} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-lg leading-relaxed text-foreground">"{testimonial.quote}"</blockquote>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.years}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="inline-flex items-center gap-3 rounded-full border border-secondary/20 bg-secondary/10 px-6 py-3 text-sm font-medium text-secondary">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            Conteudo criado com base em psicologia positiva e comunicacao nao violenta.
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
