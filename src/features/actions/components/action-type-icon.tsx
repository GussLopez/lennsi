import type { CSSProperties } from "react"

import { typeDetails } from "@/features/actions/data"
import type { ActionType } from "@/features/actions/types/types"
import { cn } from "@/lib/utils"

const socialIconPaths: Partial<Record<ActionType, string>> = {
  instagram: "/icons/instagram-logo.svg",
  facebook: "/icons/facebook-logo.svg",
  tiktok: "/icons/tiktok-logo.svg",
  whatsapp: "/icons/whatsapp-logo.svg",
}

type ActionTypeIconProps = {
  type: ActionType
  className?: string
}

export function ActionTypeIcon({ type, className }: ActionTypeIconProps) {
  const socialIconPath = socialIconPaths[type]

  if (socialIconPath) {
    const maskStyles = {
      maskImage: `url(${socialIconPath})`,
      WebkitMaskImage: `url(${socialIconPath})`,
    } satisfies CSSProperties

    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-5 shrink-0 bg-current mask-center mask-no-repeat mask-contain",
          className,
        )}
        style={maskStyles}
      />
    )
  }

  const details = typeDetails.find((item) => item.value === type) ?? typeDetails[0]
  const Icon = details.icon

  return <Icon aria-hidden="true" className={cn("size-5", className)} />
}
