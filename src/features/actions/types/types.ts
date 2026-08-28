import { Link2 } from "lucide-react"

export const ACTION_TYPES = [
  "menu", "wifi", "google_review", "instagram", "whatsapp",
  "promotion", "website", "custom",
] as const

export type ActionType = (typeof ACTION_TYPES)[number]

export const ACTION_TEMPLATE_IDS = ["classic", "social", "minimal"] as const

export type ActionTemplateId = (typeof ACTION_TEMPLATE_IDS)[number]

export type ActionItem = {
  id: number | null
  type: ActionType
  label: string
  url: string
  isEnabled: boolean
  sortOrder: number
  branchId: number | null
  clientId: string
}

export type ActionScope = "global" | "branch"



export type ActionTypeDetails = {
  label: string
  icon: typeof Link2
  defaultLabel: string
}

export type ActionTemplate = {
  id: ActionTemplateId
  name: string
  description: string
  className: string
  types: ActionType[]
}
