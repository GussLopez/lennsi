import { getSignDestination } from "./sign-destination"

type PublicSign = { status: "active"; destinationUrl: string } | { status: "pending" | "inactive" }

export function publicSignResponse(sign: PublicSign | null, publicOrigin: string, unavailable = false): Response {
  const headers = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  }
  if (sign?.status === "active") {
    const destination = getSignDestination(sign.destinationUrl, publicOrigin)
    if (destination) return new Response(null, { status: 302, headers: { ...headers, Location: destination } })
    unavailable = true
  }

  const title = unavailable ? "Servicio temporalmente no disponible"
    : !sign ? "Cartel no encontrado"
    : sign.status === "pending" ? "Cartel pendiente de activación" : "Cartel no disponible"
  const description = unavailable ? "Inténtalo de nuevo en unos minutos."
    : sign?.status === "pending" ? "Este cartel todavía no tiene un enlace configurado."
    : "Consulta con el negocio para obtener más información."

  return new Response(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | Lennsi</title><style>body{margin:0;min-height:100dvh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#fafafa;color:#171717}main{max-width:32rem;padding:2rem;text-align:center}h1{font-size:1.5rem}p{color:#525252}footer{margin-top:3rem;font-size:.875rem}</style></head><body><main><h1>${title}</h1><p>${description}</p><footer>Lennsi</footer></main></body></html>`, {
    status: unavailable ? 503 : !sign ? 404 : 200,
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'" },
  })
}
