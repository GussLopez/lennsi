'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ touchpointId: string }>
}

export default async function EditTouchpointPage({ params }: PageProps) {
  const { touchpointId } = await params;
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
            Editar Touchpoint
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualiza la información de tu Touchpoint.
          </p>
        </div>
      </div>
    </div>
  )
}
