import z from "zod"
import { discoverySourceValues } from "../data/onboarding"

export const OnboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre de tu restaurante.")
    .max(120, "El nombre del restaurante es demasiado largo."),
  discovery_source: z.enum(discoverySourceValues, {
    error: "Selecciona cómo conociste Lennsi.",
  }),
})
