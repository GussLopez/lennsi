'use server'

import { createClient } from '@/lib/supabase/server'
import { ACTIVE_RESTAURANT_COOKIE } from '@/lib/dashboard'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function setActiveRestaurant(restaurantId: number) {
  if (!Number.isSafeInteger(restaurantId) || restaurantId <= 0) {
    throw new Error('Restaurante inválido.')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('restaurant_members')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .eq('restaurant_id', restaurantId)
    .maybeSingle()

  if (!membership) throw new Error('No tienes acceso a este restaurante.')

  const cookieStore = await cookies()
  cookieStore.set(ACTIVE_RESTAURANT_COOKIE, String(restaurantId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/dashboard',
    maxAge: 60 * 60 * 24 * 365,
  })
}

export async function logoutAction() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error('No se pudo cerrar la sesión. Intenta de nuevo.')
  }

  redirect('/login')
}
