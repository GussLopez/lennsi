export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export function isValidWhatsAppValue(value: string) {
  if (isValidHttpUrl(value)) return true
  if (!/^[+\d\s().-]+$/.test(value)) return false

  const digits = value.replace(/\D/g, "")
  return digits.length >= 7 && digits.length <= 15
}
