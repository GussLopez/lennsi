'use client'

import Link from 'next/link'
import { googleOAuthAction, loginAction } from '@/features/auth/actions/auth-actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import Image from 'next/image'
import { useState } from 'react'
import { LoginFormValues, messageType } from '../types'
import { useForm } from 'react-hook-form'
import FormMessage from '@/components/ui/form-message'

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<messageType | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleLogin = async (formData: LoginFormValues) => {
    setLoading(true);
    const res = await loginAction(formData);

    if (res.error) setMessage({
      message: res.error,
      success: false
    });
    
    if (res.success) setMessage({
      message: res.success,
      success: true
    });
    setLoading(false);
  }
  return (
    <>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="space-y-2">
          <Label
            htmlFor="email"
          >
            Correo electrónico
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="correo@restaurante.com"
            className="h-10 w-full"
            {...register("email", {
              required: "El correo es requerido"
            })}
          />
           {errors.email?.message && <FormMessage message={errors.email.message} />}
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
            type="password"
            autoComplete="current-password"
            className="h-10 w-full"
            {...register("password", {
              required: "La contraseña es requerida"
            })}
          />
           {errors.password?.message && <FormMessage message={errors.password.message} />}
        </div>

        {message && !message.success && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {message?.message}
          </div>
        )}

        {message && message.success && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {message.message}
          </div>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="h-10 w-full"
        >
          {loading ? (
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
    </>
  )
}