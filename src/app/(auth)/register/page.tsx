'use client'

import Link from 'next/link'
import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthState, googleOAuthAction, registerAction } from '../action'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import Image from 'next/image'

const initialState: AuthState = {}

function RegisterForm() {
  const searchParams = useSearchParams()
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState
  )

  return (
    <main className="grid grid-cols-2 min-h-screen">
      <div className='bg-black'></div>

      <div className="flex justify-center items-center">
        <div className="w-full max-w-sm p-6">
          <div className="mb-8">
            <h1 className="text-xl font-semibold tracking-tight">
              Crear cuenta
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Administra tu restaurante y tus NFC desde un solo lugar.
            </p>
          </div>

          <form action={formAction} className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="fullName">
                Nombre
              </Label>

              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Juan Pérez"
                className="h-10 w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Correo electrónico
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="correo@restaurante.com"
                className="h-10 w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Contraseña
              </Label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                className="h-10 w-full"
              />
            </div>

            {(state.error || searchParams.get('error')) && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {state.error ?? searchParams.get('error')}
              </div>
            )}

            {state.success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {state.success}
              </div>
            )}

            <Button
              type="submit"
              disabled={pending || Boolean(state.success)}
              className="h-10 w-full"
            >
              {pending ? (
                <>
                  <Spinner />
                  Creando
                </>
              ) : 'Crear cuenta'}
            </Button>

          </form>
          <div className="relative bg-zinc-300 max-w-full h-px my-5 mx-3">
            <span className='absolute px-2.5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground bg-white left-1/2 top-1/2'>o</span>
          </div>
          <form action={googleOAuthAction}>
            <input type="hidden" name="authPage" value="register" />
            <Button
              type="submit"
              variant={'outline'}
              className='h-10 w-full'
            >
              <Image
                src="/icons/google.svg"
                alt="Google Logo"
                className='w-4 h-4'
                width={16}
                height={16}
              />
              Acceder con Google
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{' '}

            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>

        </div>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
