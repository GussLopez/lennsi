'use client'

import Link from 'next/link'
import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthState, loginAction } from '../action'
import { Input } from '@/components/ui/input'

const initialState: AuthState = {}

function LoginForm() {
  const searchParams = useSearchParams()
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  )

  return (
    <main className="grid grid-cols-2 min-h-screen">
      <div className='bg-black'>

      </div>
      <div className="flex justify-center items-center ">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Iniciar sesión
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Accede al panel de tu restaurante.
            </p>
          </div>

          <form action={formAction} className="space-y-5">

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Correo electrónico
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="correo@restaurante.com"
                className="h-11 w-full"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Contraseña
              </label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 w-full"
              />
            </div>

            {(state.error || searchParams.get('error')) && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {state.error ?? searchParams.get('error')}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿No tienes cuenta?{' '}

            <Link
              href="/register"
              className="font-medium text-zinc-950 hover:underline"
            >
              Crear cuenta
            </Link>
          </p>

        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
