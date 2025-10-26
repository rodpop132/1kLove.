import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { healthCheck } from "@/lib/api";

const marketingLinks = [
  { label: "Beneficios", href: "/#hero" },
  { label: "Oferta", href: "/#offer" },
  { label: "FAQ", href: "/#faq" },
];

export const SiteHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, admin, logout } = useAuth();
  const [health, setHealth] = useState<"loading" | "online" | "offline">("loading");

  useEffect(() => {
    healthCheck()
      .then((response) => setHealth(response.ok ? "online" : "offline"))
      .catch(() => setHealth("offline"));
  }, []);

  const closeMobileMenu = () => setIsOpen(false);
  const isHome = location.pathname === "/";

  const marketingHref = (href: string) => (isHome ? href.replace("/#", "#") : href);

  const appLinks = useMemo(() => {
    const links: Array<{ label: string; to: string }> = [];
    if (user) links.push({ label: "Dashboard", to: "/dashboard" });
    if (admin) links.push({ label: "Admin", to: "/admin" });
    return links;
  }, [admin, user]);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    if (!isHome) {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground">
          <span className="rounded-lg bg-primary/10 px-2 py-1 text-primary">1000</span>
          <span>Receitas de Amor</span>
          <span
            className={`hidden items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium md:flex ${
              health === "online"
                ? "border-emerald-500/40 text-emerald-400"
                : health === "offline"
                  ? "border-destructive/40 text-destructive"
                  : "border-border text-muted-foreground"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                health === "online"
                  ? "bg-emerald-400"
                  : health === "offline"
                    ? "bg-destructive"
                    : "bg-muted-foreground"
              }`}
            />
            {health === "online" ? "API online" : health === "offline" ? "API offline" : "Verificando..."}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {marketingLinks.map((item) => (
            <a key={item.label} href={marketingHref(item.href)} className="transition-colors hover:text-primary">
              {item.label}
            </a>
          ))}
          {appLinks.map((item) => (
            <Link key={item.label} to={item.to} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {user.hasPaid ? (
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link to="/#offer">Finalizar pagamento</Link>
                </Button>
              )}
              {admin && (
                <Button variant="ghost" asChild>
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/cadastro">Criar conta</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Abrir menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {isOpen && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {marketingLinks.map((item) => (
              <a
                key={item.label}
                href={marketingHref(item.href)}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                onClick={closeMobileMenu}
              >
                {item.label}
              </a>
            ))}
            {appLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            {user ? (
              <>
                {user.hasPaid ? (
                  <Button variant="ghost" asChild onClick={closeMobileMenu}>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button variant="outline" asChild onClick={closeMobileMenu}>
                    <Link to="/#offer">Finalizar pagamento</Link>
                  </Button>
                )}
                {admin && (
                  <Button variant="ghost" asChild onClick={closeMobileMenu}>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild onClick={closeMobileMenu}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="hero" asChild onClick={closeMobileMenu}>
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;

