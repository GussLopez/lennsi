import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSignContext } from "@/features/signs/api/sign-context";
import SignForm from "@/features/signs/components/sign-form";

export default async function CreateSignPage() {
  const context = await getSignContext();
  if (!context?.canManage) redirect("/dashboard/signs");

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/dashboard/signs">
              <ArrowLeft />
              <span className="sr-only">Volver atrás</span>
            </Link>
          }
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Crear cartel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agrega un nuevo cartel al restaurante seleccionado.
          </p>
        </div>
      </div>
      <SignForm restaurantId={context.restaurant.id} />
    </div>
  )
}
