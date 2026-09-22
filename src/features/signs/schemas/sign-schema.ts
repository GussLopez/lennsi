import { z } from "zod"

import { getSignDestination } from "@/features/signs/sign-destination"
import { getPublicSignUrl } from "@/features/signs/public-sign-url"

export const signTokenSchema = z.string().regex(/^[a-f0-9]{32}$/)
export const signIdSchema = z.coerce.number().int().positive().max(Number.MAX_SAFE_INTEGER)

export const signSchema = z.object({
  label: z.string().trim().min(2, "Escribe al menos 2 caracteres.").max(120, "Máximo 120 caracteres."),
  businessName: z.string().trim().max(160, "Máximo 160 caracteres."),
  destinationUrl: z.string().trim().max(2048, "El enlace es demasiado largo.").refine(
    (value) => !value || getSignDestination(value, getPublicSignUrl("")) !== null,
    "Introduce un enlace externo HTTP o HTTPS, sin credenciales ni enlaces a Lennsi.",
  ),
  isActive: z.boolean(),
})

export type SignFormValues = z.infer<typeof signSchema>

export const signRowSchema = z.object({
  id: signIdSchema,
  restaurant_id: signIdSchema,
  token: signTokenSchema,
  label: z.string(),
  business_name: z.string().nullable(),
  destination_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Sign = z.infer<typeof signRowSchema>

export const signsResponseSchema = z.object({
  signs: z.array(signRowSchema),
  canManage: z.boolean(),
})

export const publicSignSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("active"), destinationUrl: z.string() }),
  z.object({ status: z.literal("pending") }),
  z.object({ status: z.literal("inactive") }),
])
