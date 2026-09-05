import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  const links = [
    { label: "Products", path: "/products" },
    { label: "Solutions", path: "/solutions" },
    { label: "How it works", path: "/how-lennsi-works" },
    { label: "Insights", path: "/insights" },
    { label: "Precios", path: "/pricing" },
  ]
  return (
    <header className="h-16 lg:h-22 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-5">
          <Link href='/'>
            <img
              src="/img/lennsi-logo.svg"
              alt="Lennsi Logo"
              className="w-30 h-"
            />
          </Link>
          <nav>
            <ul className="flex items-center gap-9">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-[15px] font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-4 items-center">
            <Button
              size={'xl'}
              variant={'chunk'}
              nativeButton={false}
              className='bg-muted text-charcoal hover:bg-charcoal hover:text-muted font-medium duration-300 rounded-[12px]'
              render={
                <Link href={'/login'}>
                  Acceder
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </header>
  )
}
