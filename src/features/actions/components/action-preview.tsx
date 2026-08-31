import { Iphone } from "@/components/ui/iphone-mock"
import { cn } from "@/lib/utils"

import type {
  ActionItem,
  ActionScope,
  ActionTemplate,
} from "../types/types"

type ActionPreviewProps = {
  restaurantName: string
  branchName: string | null
  scope: ActionScope
  items: ActionItem[]
  template: ActionTemplate
}

export default function ActionPreview({
  restaurantName,
  branchName,
  scope,
  items,
  template,
}: ActionPreviewProps) {
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
              <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-current/10 text-2xl font-bold shadow-sm">
                {restaurantName.slice(0, 1).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold">{restaurantName}</h3>
              {scope === "branch" && (
                <p className="mt-1 text-sm opacity-70">{branchName}</p>
              )}
            </div>

            <div className="space-y-3 pb-5">
              {items.length ? (
                items.map((item) => (
                  <div
                    key={item.clientId}
                    className={cn("flex min-h-12 items-center justify-center", template.linkStyle)}
                  >
                    <span className="text-center text-sm font-medium">
                      {item.label || "Sin label"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-10 text-center text-sm opacity-60">
                  Activa una acción para verla aquí.
                </p>
              )}
            </div>

            <p className="mt-auto pt-8 text-center text-[11px] opacity-50">
              Powered by Gus
            </p>
          </div>
        </div>
      </Iphone>
    </aside>
  )
}
