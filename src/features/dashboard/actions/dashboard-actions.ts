'use server'

import { createClient } from '@/lib/supabase/server'
import { ACTIVE_BRANCH_COOKIE, ACTIVE_RESTAURANT_COOKIE } from '@/features/dashboard/constants'
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

  const { data: firstBranch } = await supabase
    .from('branches')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (firstBranch) {
    cookieStore.set(ACTIVE_BRANCH_COOKIE, String(firstBranch.id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/dashboard',
      maxAge: 60 * 60 * 24 * 365,
    })
  } else {
    cookieStore.delete(ACTIVE_BRANCH_COOKIE)
  }
}

export async function setActiveBranch(branchId: number) {
  if (!Number.isSafeInteger(branchId) || branchId <= 0) {
    throw new Error('Sucursal inválida.')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: branch } = await supabase
    .from('branches')
    .select('id, restaurant_id')
    .eq('id', branchId)
    .maybeSingle()

  if (!branch) throw new Error('No tienes acceso a esta sucursal.')

  const { data: membership } = await supabase
    .from('restaurant_members')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .eq('restaurant_id', branch.restaurant_id)
    .maybeSingle()

  if (!membership) throw new Error('No tienes acceso a esta sucursal.')

  const cookieStore = await cookies()
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/dashboard',
    maxAge: 60 * 60 * 24 * 365,
  }
  cookieStore.set(ACTIVE_RESTAURANT_COOKIE, String(branch.restaurant_id), cookieOptions)
  cookieStore.set(ACTIVE_BRANCH_COOKIE, String(branch.id), cookieOptions)
}

export async function logoutAction() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error('No se pudo cerrar la sesión. Intenta de nuevo.')
  }

  redirect('/login')
}
