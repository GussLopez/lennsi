import z from "zod"

export const OnboardingSchema = z.object({
  name: z.string().trim().min(2, "Ingresa el nombre de tu restaurante."),
  use_case: z.enum(["google_reviews", "menu", "whatsapp", "social_media", "link_page"], {
    error: "Selecciona qué quieres configurar primero.",
  }),
  use_case_value: z.string().trim().min(1, "Completa este campo."),
}).superRefine(({ use_case, use_case_value }, context) => {
  if (use_case === "whatsapp") {
    const digits = use_case_value.replace(/\D/g, "")
    if (digits.length < 7 || digits.length > 15) {
      context.addIssue({ code: "custom", path: ["use_case_value"], message: "Ingresa un número de WhatsApp válido." })
    }
  } else if (!z.url().safeParse(use_case_value).success) {
    context.addIssue({
      code: "custom",
      path: ["use_case_value"],
      message: "Ingresa una URL completa, por ejemplo https://...",
    })
  }
})