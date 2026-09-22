import { redirect } from "next/navigation"
import { getSignContext } from "@/features/signs/api/sign-context"
import { SignsModule } from "@/features/signs/components/signs-module"

export default async function SignsPage() {
  const context = await getSignContext()
  if (!context) redirect("/dashboard")

  return (
    <SignsModule
      key={context.restaurant.id}
      restaurantId={context.restaurant.id}
      restaurantName={context.restaurant.name}
    />
  )
}
