import { createClient } from "@/lib/supabase/server";
import { ACTIVE_RESTAURANT_COOKIE } from "@/lib/dashboard";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    const cookieStore = await cookies();
    const requestedRestaurantId = Number(
      cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value,
    );
    const { data: memberships } = await supabase
      .from("restaurant_members")
      .select("restaurant_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    const membership = memberships?.find(
      (item) => item.restaurant_id === requestedRestaurantId,
    ) ?? memberships?.[0];

    if (!membership) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("branches")
      .select("id, name, address, phone, is_active")
      .eq("restaurant_id", membership.restaurant_id)
      .order("created_at", { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
