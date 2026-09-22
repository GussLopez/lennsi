/** Accept external web destinations only. Never follow these URLs on the server. */
export function getSignDestination(value: string, publicOrigin?: string): string | null {
  if (!value.trim() || /[\u0000-\u001f\u007f]/.test(value)) return null

  try {
    const url = new URL(value.trim())
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null

    const hostname = url.hostname.toLowerCase().replace(/\.$/, "")
    const configuredHostname = publicOrigin
      ? new URL(publicOrigin).hostname.toLowerCase().replace(/\.$/, "")
      : null
    if (
      hostname === "lennsi.com" || hostname.endsWith(".lennsi.com") ||
      hostname === "localhost" || hostname.endsWith(".localhost") ||
      hostname === configuredHostname
    ) return null

    return url.href
  } catch {
    return null
  }
}
