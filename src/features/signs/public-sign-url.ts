import { getPublicTagUrl } from "@/features/tags/public-tag-url"

export function getPublicSignUrl(token: string) {
  return new URL(`/r/${encodeURIComponent(token)}`, getPublicTagUrl(token)).href
}
