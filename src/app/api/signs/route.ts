import { randomBytes } from "node:crypto"
import { NextResponse } from "next/server"

import { getSignContext } from "@/features/signs/api/sign-context"
import { signIdSchema, signSchema } from "@/features/signs/schemas/sign-schema"
import { getSignDestination } from "@/features/signs/sign-destination"
import { getPublicSignUrl } from "@/features/signs/public-sign-url"

export async function GET(request: Request) {
  const context = await getSignContext()
  if (!context) return failure("No tienes un restaurante activo.", 401)
  const restaurantId = signIdSchema.safeParse(new URL(request.url).searchParams.get("restaurantId"))
  if (!restaurantId.success || restaurantId.data !== context.restaurant.id) {
    return failure("El restaurante activo cambió. Recarga la página.", 409)
  }

  const { data, error } = await context.supabase.from("signs")
    .select("id, restaurant_id, token, label, business_name, destination_url, is_active, created_at, updated_at")
    .eq("restaurant_id", context.restaurant.id)
    .order("created_at", { ascending: false })

  if (error) return failure("No se pudieron cargar los carteles.", 500)
  return NextResponse.json({ signs: data, canManage: context.canManage }, {
    headers: { "Cache-Control": "no-store" },
  })
}

export async function POST(request: Request) {
  return save(request, false)
}

export async function PATCH(request: Request) {
  return save(request, true)
}

async function save(request: Request, updating: boolean) {
  const context = await getSignContext()
  if (!context?.canManage) return failure("No tienes permiso para administrar carteles.", 403)

  const schema = signSchema.extend({
    restaurantId: signIdSchema,
    id: updating ? signIdSchema : signIdSchema.optional(),
  })
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return failure("Revisa los campos del formulario.", 400)
  if (parsed.data.restaurantId !== context.restaurant.id) {
    return failure("El restaurante activo cambió. Recarga la página antes de guardar.", 409)
  }

  const values = {
    label: parsed.data.label,
    business_name: parsed.data.businessName || null,
    destination_url: parsed.data.destinationUrl
      ? getSignDestination(parsed.data.destinationUrl, getPublicSignUrl(""))
      : null,
    is_active: parsed.data.isActive,
  }

  if (updating && parsed.data.id) {
    const { data, error } = await context.supabase.from("signs")
      .update(values).eq("id", parsed.data.id)
      .eq("restaurant_id", context.restaurant.id).select("id").maybeSingle()
    if (error) return failure("No se pudo actualizar el cartel.", 500)
    if (!data) return failure("Cartel no encontrado.", 404)
    return NextResponse.json(data)
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await context.supabase.from("signs").insert({
      ...values,
      restaurant_id: context.restaurant.id,
      token: randomBytes(16).toString("hex"),
    }).select("id").single()
    if (data) return NextResponse.json(data, { status: 201 })
    if (error?.code !== "23505") break
  }
  return failure("No se pudo crear el cartel.", 500)
}

function failure(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } })
}
