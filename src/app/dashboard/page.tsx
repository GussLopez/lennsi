import { BarChart3, Building2, MousePointerClick, Zap } from "lucide-react"

const summaryCards = [
  { title: "Taps hoy", value: "—", detail: "Aún no hay datos", icon: Zap },
  { title: "Sucursales", value: "—", detail: "Configura tus sucursales", icon: Building2 },
  { title: "Interacciones", value: "—", detail: "Aún no hay datos", icon: MousePointerClick },
  { title: "Últimos 7 días", value: "—", detail: "La actividad aparecerá aquí", icon: BarChart3 },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Resumen</h1><p className="mt-1 text-sm text-muted-foreground">Consulta la actividad principal de tus puntos NFC.</p></div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
            <div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">{card.title}</p><card.icon className="size-4 text-muted-foreground" /></div>
            <p className="mt-4 text-3xl font-semibold">{card.value}</p><p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="min-h-72 rounded-xl border bg-card p-6 shadow-xs">
          <h2 className="font-semibold">Actividad reciente</h2>
          <div className="flex min-h-56 flex-col items-center justify-center text-center"><BarChart3 className="mb-3 size-8 text-muted-foreground/60" /><p className="text-sm font-medium">Todavía no hay actividad</p><p className="mt-1 max-w-sm text-sm text-muted-foreground">Los taps e interacciones aparecerán cuando tus tags NFC estén activos.</p></div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-xs"><h2 className="font-semibold">Primeros pasos</h2><ol className="mt-5 space-y-4 text-sm">
          {["Completa los datos de tu sucursal", "Crea un punto NFC", "Configura las acciones de tu landing"].map((step, index) => (
            <li key={step} className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span><span className="pt-0.5 text-muted-foreground">{step}</span></li>
          ))}
        </ol></div>
      </section>
    </div>
  )
}
