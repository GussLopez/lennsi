import { z } from "zod"

export const tagSchema = z.object({
  id: z.number().int().positive().optional(),
  label: z
    .string()
    .trim()
    .min(2, "La etiqueta debe tener al menos 2 caracteres.")
    .max(120, "La etiqueta no puede exceder 120 caracteres."),
  touchpointId: z.number().int().positive("Selecciona un touchpoint."),
  isActive: z.boolean(),
})

export type TagFormValues = z.infer<typeof tagSchema>

export const tagIdsSchema = z
  .array(z.number().int().positive())
  .min(1)
  .max(100)
  .transform((ids) => [...new Set(ids)])
