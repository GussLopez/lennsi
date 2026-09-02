export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T00:00:00`))
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`))
}

export function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value
}