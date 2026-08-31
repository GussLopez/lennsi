const PUBLIC_TAG_ORIGIN =
  (process.env.NEXT_PUBLIC_PUBLIC_TAG_ORIGIN ?? "https://go.lennsi.com").replace(
    /\/+$/,
    "",
  )

export function getPublicTagUrl(token: string) {
  return `${PUBLIC_TAG_ORIGIN}/${encodeURIComponent(token)}`
}
