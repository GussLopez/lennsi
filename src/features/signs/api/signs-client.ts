import { z } from "zod"

import { signIdSchema, signsResponseSchema, type SignFormValues } from "@/features/signs/schemas/sign-schema"

async function request(input: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(input, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const error = z.object({ error: z.string() }).safeParse(payload)
    throw new Error(error.success ? error.data.error : "No se pudo completar la operación.")
  }
  return payload
}

export async function fetchSigns(restaurantId: number) {
  return signsResponseSchema.parse(await request(`/api/signs?restaurantId=${restaurantId}`))
}

export async function saveSign(restaurantId: number, values: SignFormValues, id?: number) {
  return z.object({ id: signIdSchema }).parse(await request("/api/signs", {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify({ ...values, restaurantId, ...(id ? { id } : {}) }),
  }))
}
