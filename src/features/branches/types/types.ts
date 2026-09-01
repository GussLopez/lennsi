export interface Branch {
  id: number
  name: string
  phone: string | null
  is_active: boolean
  address: string | null
  menu_url: string  | null;
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
  menu_url: string | null
  is_active: boolean
}