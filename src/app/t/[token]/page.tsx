'use client'

import Link from "next/link";
import { useParams } from "next/navigation"

export default function TokenPage() {
  const params = useParams();
  const token = params.token as string;

  const links = [
    "Menú",
    "Bebidads",
    "Página Web",
    "Instagram",
    "Facebook",
    "Reseña"
  ]
  return (
    <div className="w-full min-h-screen max-w-xl flex flex-col items-center gap-12  mx-auto px-4 py-12 bg-accent">
      <div className="flex flex-col items-center gap-5">
        <div className="w-30 h-30 flex justify-center items-center rounded-full font-bold bg-primary text-white">LOGO</div>
        <h1 className="text-2xl font-semibold">Restaurant Name</h1>
      </div>

      <div className="w-full flex flex-col gap-5">
        {links.map(link => (
          <Link
            key={link}
            href={'/'}
            className="p-4 text-center border border-input rounded-2xl text-xl font-medium bg-primary/90 text-white"
          >
            {link}
          </Link>
        ))}
      </div>
    </div>
  )
}
