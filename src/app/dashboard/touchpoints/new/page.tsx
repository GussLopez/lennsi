import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateTouchpointPage() {

  return (
    <div>
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
            Agregar un Touchpoint
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agrega un touchpoint a tu sucursal.
          </p>
        </div>
      </div>
    </div>
  )
}
