import { z } from "zod"

export const TOUCHPOINT_TYPES = [
  "table",
  "bar",
  "entrance",
  "terrace",
  "reception",
  "counter",
  "other",
] as const

export const touchpointTypeLabels: Record<(typeof TOUCHPOINT_TYPES)[number], string> = {
  table: "Mesa",
  bar: "Barra",
  entrance: "Entrada",
  terrace: "Terraza",
  reception: "Recepción",
  counter: "Mostrador",
  other: "Otro",
}

export const touchpointSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre no puede exceder 120 caracteres."),
  type: z.enum(TOUCHPOINT_TYPES, "Selecciona un tipo válido."),
  number: z
    .number("Ingresa un número válido.")
    .int("El número debe ser entero.")
    .positive("El número debe ser mayor que cero.")
    .nullable(),
  isActive: z.boolean(),
})

export type TouchpointFormValues = z.infer<typeof touchpointSchema>
