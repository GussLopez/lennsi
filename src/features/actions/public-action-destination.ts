import type { ResolvePublicActionDestinationOptions } from "./types/types"


export function resolvePublicActionDestination({
  type,
  url,
  branch,
  getPublicMenuUrl,
}: ResolvePublicActionDestinationOptions) {
  if (url) {
    if (type === "whatsapp" && !isHttpUrl(url)) {
      return createWhatsAppUrl(url)
    }

    return isHttpUrl(url) ? url : null
  }

  if (type === "whatsapp" && branch.whatsapp) {
    return createWhatsAppUrl(branch.whatsapp)
  }

  if (type === "google_review" && branch.googleReviewUrl) {
    return isHttpUrl(branch.googleReviewUrl) ? branch.googleReviewUrl : null
  }

  if (type === "menu" && branch.menuUrl) {
    const publicUrl = getPublicMenuUrl(branch.menuUrl)
    return isHttpUrl(publicUrl) ? publicUrl : null
  }

  if (type === "wifi" && branch.wifiSsid) {
    return createWifiUrl(branch.wifiSsid, branch.wifiPassword)
  }

  return null
}

function createWhatsAppUrl(value: string) {
  const digits = value.replace(/\D/g, "")
  return digits ? `https://wa.me/${digits}` : null
}

function createWifiUrl(ssid: string, rawPassword: string | null) {
  const escapeWifi = (value: string) => value.replace(/([\\;,:"])/g, "\\$1")
  const password = rawPassword ? `P:${escapeWifi(rawPassword)};` : ""
  const security = password ? "WPA" : "nopass"

  return `WIFI:T:${security};S:${escapeWifi(ssid)};${password};`
}

function isHttpUrl(value: string) {
  try {
    const protocol = new URL(value).protocol
    return protocol === "http:" || protocol === "https:"
  } catch {
    return false
  }
}
