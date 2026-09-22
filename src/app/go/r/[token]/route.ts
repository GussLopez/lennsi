import { createClient } from "@/lib/supabase/server"
import { getPublicSignUrl } from "@/features/signs/public-sign-url"
import { publicSignSchema, signTokenSchema } from "@/features/signs/schemas/sign-schema"
import { publicSignResponse } from "@/features/signs/public-sign-response"
import type { SignsDatabase } from "@/features/signs/types/pending-database.types"

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const token = signTokenSchema.safeParse((await params).token)
  const origin = getPublicSignUrl("")
  if (!token.success) return publicSignResponse(null, origin)

  try {
    const supabase = await createClient<SignsDatabase>()
    const { data, error } = await supabase.rpc("get_public_sign", { p_token: token.data })
    if (error) return publicSignResponse(null, origin, true)
    if (data === null) return publicSignResponse(null, origin)
    const parsed = publicSignSchema.safeParse(data)
    return parsed.success ? publicSignResponse(parsed.data, origin) : publicSignResponse(null, origin, true)
  } catch {
    return publicSignResponse(null, origin, true)
  }
}
