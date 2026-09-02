import { Iphone } from "@/components/ui/iphone-mock"
import { cn } from "@/lib/utils"

import type {
  ActionItem,
  ActionScope,
  ActionTemplate,
} from "../types/types"
import { useRestaurantStore } from "@/store/restaurant-store-provider"

import { ActionTypeIcon } from "./action-type-icon"

type ActionPreviewProps = {
  branchName: string | null
  scope: ActionScope
  items: ActionItem[]
  template: ActionTemplate
}

export default function ActionPreview({
  branchName,
  scope,
  items,
  template,
}: ActionPreviewProps) {
  const restaurantName =
    useRestaurantStore((state) => state.name) ?? "Restaurante"
  const restaurantLogo = useRestaurantStore((state) => state.logoUrl)
  const iconItems = items.filter((item) => item.displayMode === "icon")
  const linkItems = items.filter((item) => item.displayMode === "link")

  return (
    <aside className="mx-auto w-full max-w-90 lg:sticky lg:top-24">
      <Iphone className="block">
        <div
          className={cn(
            "h-full overflow-y-auto px-5 pb-10 pt-16",
            template.background
          )}
        >
          <div className="mx-auto flex min-h-full max-w-sm flex-col">
            <div className="mb-7 text-center">
              {restaurantLogo ? (
                <img
                  src={restaurantLogo}
                  alt={`Logo del Restaurante`}
                  className="w-full h-26 mb-3 object-contain"
                />
              ) : (
                <div className={cn("mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-sm", template.bgColor)}>
                  {restaurantName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <h3 className={cn(template.textColor, "text-xl font-semibold")}>{restaurantName}</h3>
              {scope === "branch" && (
                <p className="mt-1 text-sm opacity-70">{branchName}</p>
              )}
            </div>

            <div className="space-y-3 pb-5">
              {linkItems.map((item) => (
                  <div
                    key={item.clientId}
                    className={cn("flex min-h-12 items-center justify-center", template.linkStyle)}
                  >
                    <span className="text-center text-sm font-medium">
                      {item.label || "Sin label"}
                    </span>
                  </div>
              ))}

              {iconItems.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {iconItems.map((item) => (
                    <div
                      key={item.clientId}
                      title={item.label}
                      className={cn(
                        "flex size-11 items-center justify-center",
                        template.textColor,
                      )}
                    >
                      <ActionTypeIcon type={item.type} className="size-7" />
                    </div>
                  ))}
                </div>
              )}

              {!items.length && (
                <p className="py-10 text-center text-sm opacity-60">
                  Activa una acción para verla aquí.
                </p>
              )}
            </div>

            <p className="mt-auto pt-8 text-center text-[11px] text-muted-foreground">
              Powered by Lennsi
            </p>
          </div>
        </div>
      </Iphone>
    </aside>
  )
}
