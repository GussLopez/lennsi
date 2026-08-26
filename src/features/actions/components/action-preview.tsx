import { Iphone } from "@/components/ui/iphone-mock"
import { ActionItem, ActionScope, ActionTemplate } from "../types/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { typeDetails } from "./actions-module"
import { ExternalLink } from "lucide-react"


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
    <aside className="lg:sticky lg:top-24">
      <Iphone>
        <div className="mx-auto w-full max-w-85 h-full z-9">
          <div
            className={cn(
              "h-full overflow-hidden rounded-[2rem] p-6",
              template.className
            )}
          >
            <div className="mx-auto mb-6 h-1.5 w-20 rounded-full bg-current opacity-20" />

            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-current/10 text-2xl font-bold">
                {restaurantName.slice(0, 1).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold">{restaurantName}</h3>
              {scope === "branch" && (
                <p className="mt-1 text-sm opacity-70">{branchName}</p>
              )}
            </div>

            <div className="space-y-3">
              {items.length ? (
                items.map((item) => {
                  const Icon = typeDetails[item.type].icon

                  return (
                    <a
                      key={item.clientId}
                      href={item.url || undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-12 items-center gap-3 rounded-xl border border-current/10 bg-current/10 px-4 backdrop-blur"
                    >
                      <Icon className="size-5" />
                      <span className="flex-1 text-sm font-medium">
                        {item.label || "Sin label"}
                      </span>
                    </a>
                  )
                })
              ) : (
                <p className="py-10 text-center text-sm opacity-60">
                  Activa una acción para verla aquí.
                </p>
              )}
            </div>
          </div>
        </div>
      </Iphone>
    </aside>
  )
}