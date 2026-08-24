import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const tokenHash = searchParams.get('token_hash')

  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')

  const redirectTo = request.nextUrl.clone()

  redirectTo.pathname = '/dashboard'

  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  redirectTo.searchParams.delete('code')

  const supabase = await createClient()

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    })

    if (!error) {
      return NextResponse.redirect(redirectTo)
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(redirectTo)
    }
  }

  redirectTo.pathname = '/login'

  redirectTo.searchParams.set(
    'error',
    'No se pudo confirmar tu correo.'
  )

  return NextResponse.redirect(redirectTo)
}
