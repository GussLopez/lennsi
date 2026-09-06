import Link from "next/link";

export default function Footer() {
  const privacyLinks = [
    { text: 'Cookie Settings', link: '/' },
    { text: 'Privacy', link: '/' },
    { text: 'Disclaimer', link: '/' },
    { text: 'Platform Terms', link: '/' },
    { text: 'Accessibility', link: '/' },
  ]

  return (
    <footer className="pt-20 rounded-t-[60px] bg-accent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-5">
          <Link href='/'>
            <img
              src="/img/lennsi-logo.svg"
              alt="Lennsi Logo"
              className="w-30 h-auto"
            />
          </Link>
        </div>
        <div className="flex justify-between items-center text-xs text-charcoal">
          <p>2026 © Lennsi.com | All rights reserved.</p>

          <nav>
            <ul className="flex items-center gap-3">
              {privacyLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.link}
                  className="hover:text-charcoal/50"
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
