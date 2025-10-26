import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marina & Lucas",
      years: "10 anos juntos",
      quote: "Faz 10 anos que estamos juntos e nunca nos comunicamos tão bem.",
      rating: 5,
    },
    {
      name: "Juliana S.",
      years: "5 anos de casamento",
      quote: "As tarefas diárias são simples, mas o impacto é gigante.",
      rating: 5,
    },
    {
      name: "Pedro & Ana",
      years: "3 anos juntos",
      quote: "Conseguimos reacender a conexão que achávamos perdida.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-block px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-sm text-secondary mb-6 font-semibold">
            ⭐ Depoimentos Reais
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="text-foreground">Casais que</span>
            {" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                transformaram
              </span>
            </span>
            <br />
            <span className="text-muted-foreground text-2xl md:text-3xl">seus relacionamentos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
            Mais de <span className="text-foreground font-bold">95%</span> relatam melhora na comunicação em apenas <span className="text-foreground font-bold">7 dias</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" className="text-primary" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.years}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Authority Badge */}
        <div className="text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-secondary/10 border border-secondary/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <p className="text-sm font-medium">
              Baseado em estudos de psicologia positiva e comunicação não-violenta
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
