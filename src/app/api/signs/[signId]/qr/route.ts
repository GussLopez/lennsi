import { NextResponse } from "next/server"
import QRCode from "qrcode"

import { getSignContext } from "@/features/signs/api/sign-context"
import { getPublicSignUrl } from "@/features/signs/public-sign-url"
import { signIdSchema } from "@/features/signs/schemas/sign-schema"

export async function GET(request: Request, { params }: { params: Promise<{ signId: string }> }) {
  const context = await getSignContext()
  const signId = signIdSchema.safeParse((await params).signId)
  const restaurantId = signIdSchema.safeParse(new URL(request.url).searchParams.get("restaurantId"))
  if (!context) return NextResponse.json({ error: "Inicia sesión para descargar el QR." }, { status: 401 })
  if (!signId.success) return new NextResponse(null, { status: 404 })
  if (!restaurantId.success || restaurantId.data !== context.restaurant.id) {
    return NextResponse.json({ error: "El restaurante activo cambió. Recarga la página." }, { status: 409 })
  }

  const { data: sign, error } = await context.supabase.from("signs").select("token")
    .eq("id", signId.data).eq("restaurant_id", context.restaurant.id).maybeSingle()
  if (error) return new NextResponse(null, { status: 503 })
  if (!sign) return new NextResponse(null, { status: 404 })

  const svg = await QRCode.toString(getPublicSignUrl(sign.token), {
    type: "svg", errorCorrectionLevel: "M", margin: 4,
  })
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="cartel-${sign.token}.svg"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
