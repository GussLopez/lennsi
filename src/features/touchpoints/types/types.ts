import type { TOUCHPOINT_TYPES } from "@/features/touchpoints/schemas/touchpoint-schema"

export type Touchpoint = {
  id: number
  branch_id: number
  name: string
  type: (typeof TOUCHPOINT_TYPES)[number]
  number: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type TouchPoint = Touchpoint
