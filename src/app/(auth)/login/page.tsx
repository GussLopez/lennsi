import LoginForm from "@/features/auth/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  
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
          <LoginForm />
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
