'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { AuthState, loginAction } from '../action'

const initialState: AuthState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  )

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">

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

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="correo@restaurante.com"
                required
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Contraseña
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            {state.error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {state.error}
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