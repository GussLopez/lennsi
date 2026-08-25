import type { LucideIcon } from "lucide-react"

export function ModulePlaceholder({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>
      <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center shadow-xs">
        <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-6" /></span>
        <h2 className="font-semibold">Módulo listo para continuar</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">La estructura y navegación ya están preparadas. Su funcionalidad se añadirá en el módulo correspondiente.</p>
      </div>
    </div>
  )
}
