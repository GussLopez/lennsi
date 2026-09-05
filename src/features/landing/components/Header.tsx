import Link from "next/link";
import CtaButton from "./cta-button";

export default function Header() {
  const links = [
    { label: "Products", path: "/products" },
    { label: "Solutions", path: "/solutions" },
    { label: "How it works", path: "/how-lennsi-works" },
    { label: "Insights", path: "/insights" },
    { label: "Precios", path: "/pricing" },
  ]
  return (
    <header className="fixed inset-0 top-0 h-16 flex items-center backdrop-blur-sm bg-background/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-5">
          <Link href='/'>
            <img
              src="/img/lennsi-logo.svg"
              alt="Lennsi Logo"
              className="w-30 h-"
            />
          </Link>
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-9 group">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-[15px] font-medium group-has-[a:hover]:not-hover:opacity-50 transition-opacity duration-200 ease-in-out"
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