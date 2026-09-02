import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { OnboardingSchema } from "../schemas/onboarding-schema";

const schema = OnboardingSchema;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "No tienes una sesión activa." },
      { status: 401 },
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "La solicitud no es válida." },
      { status: 400 },
    );
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error:
          result.error.issues[0]?.message ?? "Revisa los datos ingresados.",
      },
      { status: 400 },
    );
  }

  // Los tipos generados se actualizarán después de aplicar la migración y
  // regenerar database.types.ts. El cast mantiene esta migración local compilable.
  const { error } = await supabase.rpc(
    "create_restaurant_onboarding",
    {
      p_name: result.data.name,
      p_discovery_source: result.data.discovery_source,
    } as never,
  );

  if (error) {
    const duplicateMembership = error.message.includes("already belongs");
    return NextResponse.json(
      {
        error: duplicateMembership
          ? "Ya perteneces a un restaurante."
          : "No se pudo crear el restaurante.",
      },
      { status: duplicateMembership ? 409 : 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
