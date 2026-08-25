import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateBranchPage() {

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="flex items-center gap-5">
        <Button
          size={'icon'}
          variant={'outline'}
          nativeButton={false}
          render={
            <Link href={'/dashboard/branches'}>
              <ArrowLeft />
              <span className="sr-only">Volver atras</span>
            </Link>
          }
        />
        <h1 className="text-2xl font-semibold">Crear Sucursal</h1>
      </div>
    </div>
  )
}
