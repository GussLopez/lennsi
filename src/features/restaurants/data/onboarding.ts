export const discoverySourceOptions = [
  { value: "google_search", label: "Búsqueda en Google" },
  { value: "social_media", label: "Redes sociales" },
  { value: "recommendation", label: "Recomendación de alguien" },
  { value: "event", label: "Evento o feria" },
  { value: "other", label: "Otro" },
] as const

export const discoverySourceValues = discoverySourceOptions.map(
  ({ value }) => value,
) as [
  "google_search",
  "social_media",
  "recommendation",
  "event",
  "other",
]
