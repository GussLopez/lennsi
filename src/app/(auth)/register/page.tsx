'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { AuthState, registerAction } from '../action'

const initialState: AuthState = {}

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState
  )

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Crear cuenta
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Administra tu restaurante y tus NFC desde un solo lugar.
            </p>
          </div>

          <form action={formAction} className="space-y-5">

            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium"
              >
                Nombre
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Juan Pérez"
                required
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
            </div>

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
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Confirmar contraseña
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                minLength={8}
                required
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            {state.error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            {state.success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {state.success}
              </div>
            )}

            <button
              type="submit"
              disabled={pending || Boolean(state.success)}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{' '}

            <Link
              href="/login"
              className="font-medium text-zinc-950 hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>

        </div>
      </div>
    </main>
  )
}