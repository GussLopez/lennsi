'use client'

import { googleOAuthAction, registerAction } from '@/features/auth/actions/auth-actions';
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useForm } from 'react-hook-form'
import FormMessage from '@/components/ui/form-message'
import { MessageType, RegisterFormValues } from '../types'
import { useState } from 'react';
import { OAuthSubmitButton } from './oauth-submit-button'
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation'


type RegisterFormProps = {
  initialError?: string
}

export default function RegisterForm({ initialError }: RegisterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(
    initialError ? { message: initialError, success: false } : null,
  );

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  })

  const handleRegister = async (formData: RegisterFormValues) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await registerAction(formData);

      if (res.redirectTo) {
        router.replace(res.redirectTo)
        router.refresh()
        return
      }

      if (res.error) setMessage({
        message: res.error,
        success: false
      });

      if (res.success) setMessage({
        message: res.success,
        success: true
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
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Nombre
          </Label>

          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Juan Pérez"
            className="h-10 w-full"
            maxLength={100}
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName", {
              required: "El nombre es requerido"
            })}
          />
          {errors.fullName?.message && <FormMessage message={errors.fullName.message} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
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
            {...register('email', {
              required: "El correo es requerido"
            })}
          />
          {errors.email?.message && <FormMessage message={errors.email.message} />}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium"
          >
            Contraseña
          </Label>

          <div className='relative'>
            <Input
              id="password"
              type={viewPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              maxLength={128}
              className="h-10 w-full"
              aria-invalid={Boolean(errors.password)}
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 8,
                  message: "Tu contraseña debe de tener 8 caracteres como mínimo"
                }
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
        <OAuthSubmitButton label="Registrarse con Google" />
      </form>
    </>
  )
}
