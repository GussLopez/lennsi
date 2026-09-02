'use client'

import { googleOAuthAction, loginAction } from '@/features/auth/actions/auth-actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'
import { LoginFormValues, MessageType } from '../types'
import { useForm } from 'react-hook-form'
import FormMessage from '@/components/ui/form-message'
import { OAuthSubmitButton } from './oauth-submit-button'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

type LoginFormProps = {
  initialError?: string
}

export default function LoginForm({ initialError }: LoginFormProps) {
  const router = useRouter()
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(
    initialError ? { message: initialError, success: false } : null,
  );

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleLogin = async (formData: LoginFormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await loginAction(formData);

      if (res.redirectTo) {
        router.replace(res.redirectTo)
        router.refresh()
        return
      }

      if (res.error) setMessage({
        message: res.error,
        success: false
      });

    } catch {
      setMessage({
        success: false,
        message: "No se pudo completar la solicitud.",
      })
    } finally {
      setLoading(false);
    }
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
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
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
              href={'/forgot-password'}
              className='text-sm font-medium text-primary hover:underline'
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className='relative'>
            <Input
              id="password"
              type={viewPassword ? "text" : "password"}
              autoComplete="current-password"
              className="h-10 w-full"
              maxLength={128}
              aria-invalid={Boolean(errors.password)}
              {...register("password", {
                required: "La contraseña es requerida"
              })}
            />
            <button
              className='absolute top-1/2 -translate-y-1/2 right-4 text-muted-foreground'
              onClick={() => setViewPassword(prev => !prev)}
              type='button'
            >
              {viewPassword ? <EyeOff className='size-4.5' />  : <Eye className='size-4.5' />}
            </button>
          </div>
          {errors.password?.message && <FormMessage message={errors.password.message} />}
        </div>

        {message && !message.success && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {message?.message}
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
        <OAuthSubmitButton label="Acceder con Google" />
      </form>
    </>
  )
}
