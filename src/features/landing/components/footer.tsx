import Link from "next/link";
import CtaButton from "./cta-button";

export default function Footer() {
  const appLinks = [
    { text: 'Product', link: '/' },
    { text: 'Solutions', link: '/' },
    { text: 'How it works', link: '/' },
    { text: 'Insights', link: '/' },
    { text: 'Precios', link: '/' },
  ]

  const privacyLinks = [
    { text: 'Privacy Policy', link: '/' },
    { text: 'Terms of Use', link: '/' },
    { text: 'Trust Site', link: '/' },
  ]
  const year = new Date().getFullYear();
  return (
    <footer className="pt-20 pb-6 rounded-t-[60px] bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-5">
          <Link href='/'>
            <img
              src="/img/lennsi-logo.svg"
              alt="Lennsi Logo"
              className="w-40 h-auto"
            />
          </Link>
          <div className="flex gap-3">
            <CtaButton
              link="/"
              text="Acceder"
            />
            <CtaButton
              link="/"
              text="Ver como funciona"
              className="border border-transparent text-charcoal hover:text-charcoal bg-muted hover:bg-muted hover:border-input"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-5">
            <p className="font-medium text-charcoal/50">Grow online discovery</p>
            <ul className="flex flex-col gap-3 text-lg font-semibold text-charcoal">
              {appLinks.map((link) => (
                <li key={link.text} className="relative">
                  <Link href={link.link} className="group">
                    {link.text}
                    <span className="bg-primary absolute top-1/2 -translate-y-1/2 -left-3 hidden size-1.5 scale-0 transition-[scale] duration-300 group-hover:scale-100 md:block"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-medium text-charcoal/50">Grow online discovery</p>
            <ul className="flex flex-col gap-3 text-lg font-semibold text-charcoal">
              {appLinks.map((link) => (
                <li key={link.text} className="relative">
                  <Link href={link.link} className="group">
                    {link.text}
                    <span className="bg-primary absolute top-1/2 -translate-y-1/2 -left-3 hidden size-1.5 scale-0 transition-[scale] duration-300 group-hover:scale-100 md:block"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-medium text-charcoal/50">Grow online discovery</p>
            <ul className="flex flex-col gap-3 text-lg font-semibold text-charcoal">
              {appLinks.map((link) => (
                <li key={link.text} className="relative">
                  <Link href={link.link} className="group">
                    {link.text}
                    <span className="bg-primary absolute top-1/2 -translate-y-1/2 -left-3 hidden size-1.5 scale-0 transition-[scale] duration-300 group-hover:scale-100 md:block"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row justify-between items-center text-xs text-muted-foreground">
          <p className="text-center lg:text-start">{year} © Lennsi Todos los derechos reservados.</p>

          <nav>
            <ul className="flex items-center gap-4">
              {privacyLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.link}
                  className="hover:text-charcoal transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
