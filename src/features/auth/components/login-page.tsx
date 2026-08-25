'use client'

import Link from 'next/link'
import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthState, googleOAuthAction, loginAction } from '@/features/auth/actions/auth-actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import Image from 'next/image'

const initialState: AuthState = {}

function LoginForm() {
  const searchParams = useSearchParams()
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  )

  return (
    <main className="grid grid-cols-2 min-h-screen">
      <div className='bg-black'></div>

      <div className="flex justify-center items-center">
        <div className="w-full max-w-sm p-6">
          <div className="mb-8">
            <h1 className="text-xl font-semibold tracking-tight">
              Iniciar sesión
            </h1>

            <p className="mt-0.5 text-sm text-zinc-500">
              Accede al panel de tu restaurante.
            </p>
          </div>

          <form action={formAction} className="space-y-6">

            <div className="space-y-2">
              <Label
                htmlFor="email"
              >
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
              <div className='flex justify-between items-center'>
                <Label htmlFor="password">
                  Contraseña
                </Label>
                <Link
                  href={'/'}
                  className='text-sm font-medium text-primary hover:underline'
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-10 w-full"
              />
            </div>

            {(state.error || searchParams.get('error')) && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {state.error ?? searchParams.get('error')}
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="h-10 w-full"
            >
              {pending ? (
                <>
                  <Spinner />
                  Accediendo
                </>
              ) : 'Acceder'}
            </Button>

          </form>
          <div className="relative bg-zinc-300 max-w-full h-px my-5 mx-3">
            <span className='absolute px-2.5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground bg-white left-1/2 top-1/2'>o</span>
          </div>
          <form action={googleOAuthAction}>
            <input type="hidden" name="authPage" value="login" />
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
            ¿No tienes cuenta?{' '}

            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
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
