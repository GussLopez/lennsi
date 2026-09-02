export function getDeviceType(userAgent: string | null) {
  if (!userAgent) return null
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return "tablet"
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "mobile"
  return "desktop"
}
