"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { ACTION_TYPES } from "@/features/actions/types/types";
import {
  ACTIVE_BRANCH_COOKIE,
  ACTIVE_RESTAURANT_COOKIE,
} from "@/features/dashboard/constants";
import { createClient } from "@/lib/supabase/server";

const itemSchema = z.object({
  id: z.number().int().positive().nullable(),
  type: z.enum(ACTION_TYPES),
  label: z.string().trim().min(1).max(80),
  url: z.union([z.literal(""), z.url()]).transform((value) => value || null),
  isEnabled: z.boolean(),
  sortOrder: z.number().int().min(0),
});

const payloadSchema = z.object({
  scope: z.enum(["global", "branch"]),
  items: z.array(itemSchema).max(40),
});

export type SaveActionsResult = { ok: boolean; message: string };

export async function saveActions(
  payload: unknown,
): Promise<SaveActionsResult> {
  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success)
    return {
      ok: false,
      message: "Revisa los labels y las URLs antes de guardar.",
    };

  const cookieStore = await cookies();
  const restaurantId = Number(cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value);
  const branchId =
    parsed.data.scope === "branch"
      ? Number(cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value)
      : null;

  if (!Number.isSafeInteger(restaurantId) || restaurantId <= 0) {
    return {
      ok: false,
      message: "No se pudo identificar el restaurante activo.",
    };
  }
  if (
    parsed.data.scope === "branch" &&
    (!Number.isSafeInteger(branchId) || !branchId || branchId <= 0)
  ) {
    return {
      ok: false,
      message: "Selecciona una sucursal para guardar esta configuración.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { ok: false, message: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("role")
    .eq("restaurant_id", restaurantId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership || !["owner", "admin", "manager"].includes(membership.role)) {
    return {
      ok: false,
      message: "No tienes permiso para administrar acciones.",
    };
  }

  if (branchId) {
    const { data: branch } = await supabase
      .from("branches")
      .select("id")
      .eq("id", branchId)
      .eq("restaurant_id", restaurantId)
      .maybeSingle();
    if (!branch)
      return {
        ok: false,
        message: "La sucursal seleccionada no pertenece al restaurante.",
      };
  }

  const scopeQuery = supabase
    .from("actions")
    .select("id")
    .eq("restaurant_id", restaurantId);
  const { data: existing, error: readError } = branchId
    ? await scopeQuery.eq("branch_id", branchId)
    : await scopeQuery.is("branch_id", null);
  if (readError)
    return { ok: false, message: "No se pudo leer la configuración actual." };

  const existingIds = new Set((existing ?? []).map((row) => row.id));
  const submittedIds = new Set(
    parsed.data.items.flatMap((item) => (item.id ? [item.id] : [])),
  );
  if ([...submittedIds].some((id) => !existingIds.has(id))) {
    return {
      ok: false,
      message: "Una de las acciones no pertenece a esta configuración.",
    };
  }

  const removedIds = [...existingIds].filter((id) => !submittedIds.has(id));
  if (removedIds.length) {
    const { error } = await supabase
      .from("actions")
      .delete()
      .in("id", removedIds)
      .eq("restaurant_id", restaurantId);
    if (error)
      return {
        ok: false,
        message: "No se pudieron eliminar las acciones removidas.",
      };
  }

  const updates = parsed.data.items.filter((item) => item.id);
  for (const item of updates) {
    const { error } = await supabase
      .from("actions")
      .update({
        type: item.type,
        label: item.label,
        url: item.url,
        is_enabled: item.isEnabled,
        sort_order: item.sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id!)
      .eq("restaurant_id", restaurantId);
    if (error)
      return {
        ok: false,
        message: "No se pudieron actualizar todas las acciones.",
      };
  }

  const additions = parsed.data.items
    .filter((item) => !item.id)
    .map((item) => ({
      restaurant_id: restaurantId,
      branch_id: branchId,
      type: item.type,
      label: item.label,
      url: item.url,
      is_enabled: item.isEnabled,
      sort_order: item.sortOrder,
    }));
  if (additions.length) {
    const { error } = await supabase.from("actions").insert(additions);
    if (error)
      return {
        ok: false,
        message: "No se pudieron crear las acciones nuevas.",
      };
  }

  revalidatePath("/dashboard/actions");
  return { ok: true, message: "Configuración guardada correctamente." };
}
