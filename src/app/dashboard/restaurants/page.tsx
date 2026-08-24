import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function RestaurantsPage() {

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Restaurantes</h1>
        <div>
          <Button render={
            <Link href={'/dashboard/restaurants/create'}>
              <Plus />
              Agregar restaurante
            </Link>
          } />
        </div>
      </div>
    </div>
  )
}
