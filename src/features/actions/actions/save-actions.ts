"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import {
  ACTION_TEMPLATE_IDS,
  ACTION_TYPES,
} from "@/features/actions/types/types";
import {
  ACTIVE_BRANCH_COOKIE,
  ACTIVE_RESTAURANT_COOKIE,
} from "@/features/dashboard/constants";
import { createClient } from "@/lib/supabase/server";
import {
  isValidHttpUrl,
  isValidWhatsAppValue,
} from "@/features/actions/validation";

const itemSchema = z
  .object({
    id: z.number().int().positive().nullable(),
    type: z.enum(ACTION_TYPES),
    label: z.string().trim().min(1).max(80),
    url: z.string().trim(),
    source: z.enum(["branch", "custom"]),
    displayMode: z.enum(["link", "icon"]),
    isEnabled: z.boolean(),
    sortOrder: z.number().int().min(0),
  })
  .superRefine((item, context) => {
    if (
      item.displayMode === "icon" &&
      !["instagram", "facebook", "tiktok", "whatsapp"].includes(item.type)
    ) {
      context.addIssue({
        code: "custom",
        path: ["displayMode"],
        message: "Esta acción no se puede mostrar como icono.",
      });
    }

    if (item.source === "branch") {
      if (!["menu", "wifi", "google_review", "whatsapp"].includes(item.type)) {
        context.addIssue({ code: "custom", path: ["source"], message: "Esta acción no admite datos de sucursal." })
      }
      return
    }
    const isValid =
      item.type === "whatsapp"
        ? isValidWhatsAppValue(item.url)
        : isValidHttpUrl(item.url);

    if (!isValid) {
      context.addIssue({
        code: "custom",
        path: ["url"],
        message: "El enlace o número no es válido.",
      });
    }
  });

const payloadSchema = z.object({
  scope: z.enum(["global", "branch"]),
  templateId: z.enum(ACTION_TEMPLATE_IDS),
  items: z.array(itemSchema).max(40),
});

export type SaveActionsResult = { ok: boolean; message: string };

export async function saveActions(
  payload: unknown,
): Promise<SaveActionsResult> {
  try {
    return await saveActionsImpl(payload);
  } catch {
    return {
      ok: false,
      message: "Ocurrió un error inesperado al guardar la configuració.",
    };
  }
}

async function saveActionsImpl(payload: unknown): Promise<SaveActionsResult> {
  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success)
    return {
      ok: false,
      message: "Revisa los labels, enlaces y números antes de guardar.",
    };

  const cookieStore = await cookies();
  const requestedRestaurantId = Number(
    cookieStore.get(ACTIVE_RESTAURANT_COOKIE)?.value,
  );
  const requestedBranchId = Number(
    cookieStore.get(ACTIVE_BRANCH_COOKIE)?.value,
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { ok: false, message: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const { data: memberships } = await supabase
    .from("restaurant_members")
    .select("restaurant_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const membership =
    memberships?.find(
      (item) => item.restaurant_id === requestedRestaurantId,
    ) ?? memberships?.[0];

  if (!membership || !["owner", "admin", "manager"].includes(membership.role)) {
    return {
      ok: false,
      message: "No tienes permiso para administrar acciones.",
    };
  }

  const restaurantId = membership.restaurant_id;
  const { data: branches } = await supabase
    .from("branches")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: true });

  const activeBranch =
    branches?.find((item) => item.id === requestedBranchId) ?? branches?.[0];

  if (!activeBranch) {
    return {
      ok: false,
      message: "Crea o selecciona una sucursal antes de guardar.",
    };
  }

  const activeBranchId = activeBranch.id;
  const branchId = parsed.data.scope === "branch" ? activeBranchId : null;

  persistActiveContext(cookieStore, restaurantId, activeBranchId);

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
        url: item.source === "branch" ? null : item.url,
        display_mode: item.displayMode,
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
      url: item.source === "branch" ? null : item.url,
      display_mode: item.displayMode,
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

  if (Number.isSafeInteger(activeBranchId) && activeBranchId > 0) {
    const { error } = await supabase
      .from("branches")
      .update({
        template_id: parsed.data.templateId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeBranchId)
      .eq("restaurant_id", restaurantId);
    if (error) {
      const migrationIsMissing =
        error.code === "PGRST204" ||
        error.message.toLowerCase().includes("template_id");

      return {
        ok: false,
        message: migrationIsMissing
          ? "Falta aplicar la migración que agrega template_id a las sucursales."
          : "Las acciones se guardaron, pero no se pudo guardar la plantilla.",
      };
    }
  }

  revalidatePath("/dashboard/actions");
  revalidatePath("/go/[token]", "page");
  return { ok: true, message: "Configuración guardada." };
}

function persistActiveContext(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  restaurantId: number,
  branchId: number,
) {
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };

  for (const name of [ACTIVE_RESTAURANT_COOKIE, ACTIVE_BRANCH_COOKIE]) {
    cookieStore.set(name, "", {
      ...options,
      path: "/dashboard",
      maxAge: 0,
    });
  }

  cookieStore.set(ACTIVE_RESTAURANT_COOKIE, String(restaurantId), options);
  cookieStore.set(ACTIVE_BRANCH_COOKIE, String(branchId), options);
}
