export interface Branch {
  id: number
  name: string
  phone: string | null
  is_active: boolean
  address: string | null
}

export type BranchFormValues = {
  id?: number
  name: string
  address: string
  branchId: number | undefined;
  phone: string
  whatsapp: string
  googleReviewUrl: string
  wifiSsid: string
  wifiPassword: string
  timezone: string
  is_active: boolean
}