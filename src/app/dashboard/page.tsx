import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">
        Bienvenido, {profile?.full_name ?? 'Usuario'}
      </h1>

      <p className="mt-2 text-zinc-500">
        {user.email}
      </p>
    </main>
  )
}