'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { LoginFormValues, RegisterFormValues } from '../types'

export type AuthState = {
  error?: string
  success?: string
}

export async function googleOAuthAction(formData: FormData) {
  const supabase = await createClient()
  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin')
  const authPage = formData.get('authPage') === 'register' ? '/register' : '/login'

  if (!origin) {
    redirect(`${authPage}?error=${encodeURIComponent('No se pudo determinar la URL de la aplicación.')}`)
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/confirm`,
    },
  })

  if (error || !data.url) {
    redirect(`${authPage}?error=${encodeURIComponent('No se pudo iniciar sesión con Google.')}`)
  }

  redirect(data.url)
}

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, 'El correo electrónico es demasiado largo.')
    .email('Ingresa un correo electrónico válido.'),

  password: z
    .string()
    .max(128, 'La contraseña es demasiado larga.')
    .min(1, 'Ingresa tu contraseña.'),
})

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Ingresa tu nombre.')
      .max(100, 'El nombre es demasiado largo.'),

    email: z
      .string()
      .trim()
      .max(254, 'El correo electrónico es demasiado largo.')
      .email('Ingresa un correo electrónico válido.'),

    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .max(128, 'La contraseña es demasiado larga.'),
  })


export async function loginAction(
  formData: LoginFormValues
): Promise<AuthState> {
  const result = loginSchema.safeParse({
    email: formData.email,
    password: formData.password,
  })

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? 'Datos inválidos.',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    return {
      error: 'Correo electrónico o contraseña incorrectos.',
    }
  }

  redirect('/dashboard')
}


export async function registerAction(
  formData: RegisterFormValues
): Promise<AuthState> {
  const result = registerSchema.safeParse({
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password,
  })

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? 'Datos inválidos.',
    }
  }

  const supabase = await createClient()
  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin')

  if (!origin) {
    return {
      error: 'No se pudo determinar la URL de la aplicación. Intenta de nuevo.',
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,

    options: {
      emailRedirectTo: `${origin}/confirm`,
      data: {
        full_name: result.data.fullName,
      },
    },
  })

  if (error) {
    return {
      error: 'No se pudo crear la cuenta. Revisa los datos e intenta nuevamente.',
    }
  }

  /*
   * Si desactivaste la confirmación de email,
   * Supabase crea inmediatamente una sesión.
   */
  if (data.session) {
    redirect('/dashboard')
  }

  /*
   * Con confirmación de email habilitada
   * normalmente session será null.
   */
  return {
    success:
      'Cuenta creada. Revisa tu correo electrónico para confirmar tu cuenta.',
  }
}
