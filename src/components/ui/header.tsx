import Link from "next/link";
import CtaButton from "../../features/landing/components/cta-button";

export default function Header() {
  const links = [
    { label: "Productos", path: "/products" },
    { label: "Como funciona", path: "/how-lennsi-works" },
    { label: "Precios", path: "/pricing" },
  ]
  return (
    <header className="fixed inset-0 top-0 h-16 flex items-center z-50 backdrop-blur-sm bg-background">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-5">
          <Link href='/'>
            <img
              src="/img/lennsi-logo.svg"
              alt="Lennsi Logo"
              className="w-30 h-auto"
            />
          </Link>
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-9 group">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm font-medium hover:text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-4 items-center">
            <CtaButton
              link="/login"
              className="bg-charcoal hover:bg-primary cursor-pointer"
              text="Acceder"
            />
          </div>
        </div>
      </div>
    </header>
  )
}