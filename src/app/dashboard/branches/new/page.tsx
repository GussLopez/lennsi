import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { BranchForm } from "@/features/branches/components/branch-form"
import { Button } from "@/components/ui/button"

export default function CreateBranchPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/dashboard/branches">
              <ArrowLeft />
              <span className="sr-only">Volver atrás</span>
            </Link>
          }
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Crear sucursal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agrega una nueva ubicación al restaurante seleccionado.
          </p>
        </div>
      </div>

      <BranchForm
        initialValues={{
          name: "",
          address: "",
          phone: "",
          whatsapp: "",
          googleReviewUrl: "",
          wifiSsid: "",
          wifiPassword: "",
          timezone: "America/Cancun",
          is_active: true,
        }}
      />
    </div>
  )
}
