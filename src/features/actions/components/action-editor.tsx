import { ChevronDown, GripVertical, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { typeDetails } from "../data"
import type { ActionItem, ActionType, BranchActionData } from "../types/types"
import { ActionTypeIcon } from "./action-type-icon"

type ActionEditorProps = {
  item: ActionItem
  canManage: boolean
  urlError?: string
  onUpdate: (clientId: string, patch: Partial<ActionItem>) => void
  onDelete: () => void
  branchData: BranchActionData
  branchId: number | null
}

const branchBackedTypes = ["menu", "wifi", "google_review", "whatsapp"] as const
const socialTypes = ["instagram", "facebook", "tiktok", "whatsapp"] as const

function hasBranchValue(type: ActionType, data: BranchActionData) {
  if (type === "menu") return Boolean(data.menuUrl)
  if (type === "wifi") return Boolean(data.wifiSsid)
  if (type === "google_review") return Boolean(data.googleReviewUrl)
  if (type === "whatsapp") return Boolean(data.whatsapp)
  return false
}

function branchValueLabel(type: ActionType, data: BranchActionData) {
  if (type === "menu") return data.menuUrl ? "Menú configurado" : "Menú no configurado"
  if (type === "wifi") return data.wifiSsid ?? "Wi-Fi no configurado"
  if (type === "google_review") return data.googleReviewUrl ?? "Enlace no configurado"
  if (type === "whatsapp") return data.whatsapp ?? "WhatsApp no configurado"
  return ""
}


export default function ActionEditor({
  item,
  canManage,
  urlError,
  onUpdate,
  onDelete,
  branchData,
  branchId,
}: ActionEditorProps) {
  const isWhatsApp = item.type === "whatsapp"
  const canUseBranch = branchBackedTypes.includes(item.type as typeof branchBackedTypes[number])
  const canDisplayAsIcon = socialTypes.includes(item.type as typeof socialTypes[number])
  const branchValueExists = hasBranchValue(item.type, branchData)

  return (
    <Collapsible>
      <div
        className={cn("flex gap-3 p-4 items-start sm:px-5 rounded-lg border border-input shadow-xs bg-background",
          item.isEnabled ? 'opacity-100' : 'opacity-60')}
      >
        <GripVertical className="mt-2 hidden size-4 text-muted-foreground sm:block cursor-grab" />
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <ActionTypeIcon type={item.type} className="size-4" />
              </span>
              <Select<ActionType>
                value={item.type}
                items={typeDetails}
                disabled={!canManage}
                onValueChange={(value) => {
                  const type = value as ActionType
                  const linked = branchBackedTypes.includes(type as typeof branchBackedTypes[number])
                  const social = socialTypes.includes(type as typeof socialTypes[number])
                  onUpdate(item.clientId, {
                    type,
                    source: linked ? "branch" : "custom",
                    displayMode: social ? item.displayMode : "link",
                    url: "",
                  })
                }}
              >
                <SelectTrigger size="sm" className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {typeDetails.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id={`enabled-${item.clientId}`}
                checked={item.isEnabled}
                disabled={!canManage}
                onCheckedChange={(isEnabled) =>
                  onUpdate(item.clientId, { isEnabled })
                }
              />
              <Button
                variant={'ghost'}
                size={'icon-sm'}
                onClick={onDelete}
              >
                <Trash2 className="size-4"/>
              </Button>
              <CollapsibleTrigger
                render={
                  <Button variant={'ghost'} size={'icon-sm'}>
                    <ChevronDown className="size-4 in-data-open:rotate-180 transition-transform" />
                    <span className="sr-only">Ver más opciones</span>
                  </Button>
                }
              />
            </div>
          </div>

          <CollapsibleContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`label-${item.clientId}`}>Label</Label>
                <Input
                  id={`label-${item.clientId}`}
                  value={item.label}
                  maxLength={80}
                  disabled={!canManage}
                  onChange={(event) =>
                    onUpdate(item.clientId, { label: event.target.value })
                  }
                />
              </div>
              {item.source === "branch" ? (
                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="text-sm font-medium">{branchValueLabel(item.type, branchData)}</p>
                  {!branchValueExists && (
                    <p className="mt-1 text-xs text-destructive">
                      Esta acción no aparecerá hasta que configures el dato en la sucursal.{' '}
                      {branchId && <Link className="underline" href={`/dashboard/branches/${branchId}/edit`}>Configurar sucursal</Link>}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor={`url-${item.clientId}`}>
                    {isWhatsApp ? "Número o enlace de WhatsApp" : "URL"}
                  </Label>
                  <Input
                    id={`url-${item.clientId}`}
                    type={isWhatsApp ? "tel" : "url"}
                    required
                    placeholder={isWhatsApp ? "+529981234567" : "https://..."}
                    value={item.url}
                    disabled={!canManage}
                    aria-invalid={Boolean(urlError)}
                    aria-describedby={urlError ? `url-error-${item.clientId}` : undefined}
                    onChange={(event) =>
                      onUpdate(item.clientId, { url: event.target.value })
                    }
                  />
                  {urlError && (
                    <p
                      id={`url-error-${item.clientId}`}
                      className="text-xs text-destructive"
                    >
                      {urlError}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {canUseBranch && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Origen de la información</Label>
                  <Select
                    value={item.source}
                    items={[
                      { value: "branch", label: "Usar información de la sucursal" },
                      { value: "custom", label: "Usar otro enlace" },
                    ]}
                    disabled={!canManage}
                    onValueChange={(source) =>
                      onUpdate(item.clientId, { source: source as ActionItem["source"] })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectItem value="branch">Usar información de la sucursal</SelectItem>
                      <SelectItem value="custom">Usar otro enlace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {canDisplayAsIcon && (
                <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/20 p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor={`display-mode-${item.clientId}`}>
                      Mostrar como icono
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Se agrupará con los iconos de redes sociales.
                    </p>
                  </div>
                  <Switch
                    id={`display-mode-${item.clientId}`}
                    checked={item.displayMode === "icon"}
                    disabled={!canManage}
                    onCheckedChange={(showAsIcon) =>
                      onUpdate(item.clientId, {
                        displayMode: showAsIcon ? "icon" : "link",
                      })
                    }
                  />
                </div>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  )
}
