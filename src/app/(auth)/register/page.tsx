import RegisterForm from "@/features/auth/components/register-form";
import Link from "next/link";

export default function RegisterPage() {

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

          <RegisterForm />
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

