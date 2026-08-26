import { randomBytes } from "node:crypto"
import { NextResponse } from "next/server"

import { getTagContext } from "@/features/tags/api/tag-context"
import { tagIdsSchema, tagSchema } from "@/features/tags/schemas/tag-schema"

export async function GET() {
  const context = await getTagContext()
  if (!context) {
    return NextResponse.json({ error: "No tienes una sucursal activa." }, { status: 401 })
  }

  const { data: touchpoints, error: touchpointsError } = await context.supabase
    .from("touchpoints")
    .select("id, name, number")
    .eq("branch_id", context.branch.id)
    .order("created_at", { ascending: true })

  if (touchpointsError) {
    return NextResponse.json({ error: "No se pudieron cargar los touchpoints." }, { status: 500 })
  }

  const touchpointIds = (touchpoints ?? []).map((touchpoint) => touchpoint.id)
  const { data: tags, error: tagsError } = touchpointIds.length
    ? await context.supabase
        .from("tags")
        .select("id, touchpoint_id, token, label, is_active, created_at")
        .in("touchpoint_id", touchpointIds)
        .order("created_at", { ascending: false })
    : { data: [], error: null }

  if (tagsError) {
    return NextResponse.json({ error: "No se pudieron cargar los tags." }, { status: 500 })
  }

  const touchpointNames = new Map(
    (touchpoints ?? []).map((touchpoint) => [touchpoint.id, touchpoint.name]),
  )

  return NextResponse.json({
    tags: (tags ?? []).map((tag) => ({
      ...tag,
      touchpoint_name: touchpointNames.get(tag.touchpoint_id) ?? "Touchpoint",
    })),
    touchpoints: touchpoints ?? [],
    branch: context.branch,
    canManage: context.canManage,
  })
}

export async function POST(request: Request) {
  const context = await getTagContext()
  if (!context?.canManage) {
    return NextResponse.json({ error: "No tienes permiso para crear tags." }, { status: 403 })
  }

  const parsed = tagSchema.omit({ id: true }).safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los campos del formulario." }, { status: 400 })
  }

  const touchpoint = await findTouchpoint(context, parsed.data.touchpointId)
  if (!touchpoint) {
    return NextResponse.json({ error: "El touchpoint no pertenece a la sucursal activa." }, { status: 400 })
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = randomBytes(12).toString("base64url")
    const { data, error } = await context.supabase
      .from("tags")
      .insert({
        touchpoint_id: touchpoint.id,
        token,
        label: parsed.data.label,
        is_active: parsed.data.isActive,
      })
      .select("id")
      .maybeSingle()

    if (data) return NextResponse.json({ id: data.id }, { status: 201 })
    if (error?.code !== "23505") break
  }

  return NextResponse.json({ error: "No se pudo crear el tag." }, { status: 500 })
}

export async function PATCH(request: Request) {
  const context = await getTagContext()
  if (!context?.canManage) {
    return NextResponse.json({ error: "No tienes permiso para editar tags." }, { status: 403 })
  }

  const parsed = tagSchema.required({ id: true }).safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los campos del formulario." }, { status: 400 })
  }

  const touchpointIds = await getBranchTouchpointIds(context)
  if (!touchpointIds.includes(parsed.data.touchpointId)) {
    return NextResponse.json({ error: "El touchpoint no pertenece a la sucursal activa." }, { status: 400 })
  }

  const { data, error } = await context.supabase
    .from("tags")
    .update({
      touchpoint_id: parsed.data.touchpointId,
      label: parsed.data.label,
      is_active: parsed.data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .in("touchpoint_id", touchpointIds)
    .select("id")
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: "No se pudo actualizar el tag." }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}

export async function DELETE(request: Request) {
  const context = await getTagContext()
  if (!context?.canManage) {
    return NextResponse.json({ error: "No tienes permiso para eliminar tags." }, { status: 403 })
  }

  const parsed = tagIdsSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "La selección no es válida." }, { status: 400 })
  }

  const touchpointIds = await getBranchTouchpointIds(context)
  if (!touchpointIds.length) {
    return NextResponse.json({ error: "No hay touchpoints en la sucursal activa." }, { status: 400 })
  }

  const { data: existing } = await context.supabase
    .from("tags")
    .select("id")
    .in("id", parsed.data)
    .in("touchpoint_id", touchpointIds)

  if (existing?.length !== parsed.data.length) {
    return NextResponse.json({ error: "Uno o más tags no son válidos." }, { status: 400 })
  }

  const { data: deleted, error } = await context.supabase
    .from("tags")
    .delete()
    .in("id", parsed.data)
    .in("touchpoint_id", touchpointIds)
    .select("id")

  if (error || deleted?.length !== parsed.data.length) {
    return NextResponse.json({ error: "No se pudieron eliminar los tags." }, { status: 500 })
  }

  return NextResponse.json({ count: deleted.length })
}

type TagContext = NonNullable<Awaited<ReturnType<typeof getTagContext>>>

async function findTouchpoint(context: TagContext, touchpointId: number) {
  const { data } = await context.supabase
    .from("touchpoints")
    .select("id")
    .eq("id", touchpointId)
    .eq("branch_id", context.branch.id)
    .maybeSingle()
  return data
}

async function getBranchTouchpointIds(context: TagContext) {
  const { data } = await context.supabase
    .from("touchpoints")
    .select("id")
    .eq("branch_id", context.branch.id)
  return (data ?? []).map((touchpoint) => touchpoint.id)
}
