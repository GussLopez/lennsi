import { NextResponse } from "next/server"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  use_case: z.enum(["google_reviews", "menu", "whatsapp", "social_media", "link_page"]),
  use_case_value: z.string().trim().min(1).max(2048),
}).superRefine(({ use_case, use_case_value }, context) => {
  if (use_case === "whatsapp") {
    const digits = use_case_value.replace(/\D/g, "")
    if (digits.length < 7 || digits.length > 15) {
      context.addIssue({ code: "custom", path: ["use_case_value"], message: "WhatsApp inválido" })
    }
  } else if (!z.url().safeParse(use_case_value).success) {
    context.addIssue({ code: "custom", path: ["use_case_value"], message: "URL inválida" })
  }
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No tienes una sesión activa." }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "La solicitud no es válida." }, { status: 400 })
  }

  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? "Revisa los datos ingresados." }, { status: 400 })
  }

  const { error } = await supabase.rpc("create_restaurant_onboarding", {
    p_name: result.data.name,
    p_use_case: result.data.use_case,
    p_use_case_value: result.data.use_case_value,
  })

  if (error) {
    const duplicateMembership = error.message.includes("already belongs")
    return NextResponse.json(
      { error: duplicateMembership ? "Ya perteneces a un restaurante." : "No se pudo crear el restaurante." },
      { status: duplicateMembership ? 409 : 500 }
    )
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
