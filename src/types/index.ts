export interface Branches {
  id: number;
  name: string
  phone: string | null;
  timezone: string;
  restaurant_id: number;
  is_active: boolean;
  google_review_url: string | null;
  whatsapp: string | null;
  wifi_ssid: string | null;
  wifi_password: string | null;
  created_at: string;
  updated_at: string;
  address: string | null;
}