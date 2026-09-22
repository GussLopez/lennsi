import type { Database, Json } from "@/lib/supabase/database.types"
import type { Sign } from "@/features/signs/schemas/sign-schema"

/**
 * Contract for the local add_signs migration, not a claim about the remote schema.
 * Replace this extension with regenerated database types after applying the migration.
 * Keep the existing generated database.types.ts untouched while MCP is unavailable.
 */
export type SignsDatabase = Database & {
  public: {
    Tables: {
      signs: {
        Row: Sign
        Insert: {
          restaurant_id: number
          token: string
          label: string
          business_name?: string | null
          destination_url?: string | null
          is_active?: boolean
        }
        Update: {
          label?: string
          business_name?: string | null
          destination_url?: string | null
          is_active?: boolean
        }
        Relationships: [{
          foreignKeyName: "signs_restaurant_id_fkey"
          columns: ["restaurant_id"]
          isOneToOne: false
          referencedRelation: "restaurants"
          referencedColumns: ["id"]
        }]
      }
    }
    Functions: {
      get_public_sign: { Args: { p_token: string }; Returns: Json }
    }
  }
}
