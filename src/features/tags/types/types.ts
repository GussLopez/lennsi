export type Tag = {
  id: number
  touchpoint_id: number
  token: string
  label: string
  is_active: boolean
  created_at: string
  touchpoint_name: string
}

export type TagTouchpoint = {
  id: number
  name: string
  number: number | null
}

export type TagsResponse = {
  tags: Tag[]
  touchpoints: TagTouchpoint[]
  branch: { id: number; name: string }
  canManage: boolean
}
