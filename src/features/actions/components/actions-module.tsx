"use client"

import {
  ArrowDown,
  ArrowUp,
  AtSign,
  ExternalLink,
  Globe2,
  GripVertical,
  Link2,
  MessageCircle,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  Utensils,
  Wifi,
} from "lucide-react"
import { startTransition, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { saveActions } from "@/features/actions/actions/save-actions"
import type {
  ActionItem,
  ActionScope,
  ActionTemplate,
  ActionType,
  ActionTypeDetails,
} from "@/features/actions/types/types"
import { cn } from "@/lib/utils"
import { Iphone } from "@/components/ui/iphone-mock"
import { Badge } from "@/components/ui/badge"
import ActionPreview from "./action-preview"
import ActionEditor from "./action-editor"


export const typeDetails: Record<ActionType, ActionTypeDetails> = {
  menu: { label: "Menú", icon: Utensils, defaultLabel: "Ver menú" },
  wifi: { label: "Wi-Fi", icon: Wifi, defaultLabel: "Conectarse al Wi-Fi" },
  google_review: {
    label: "Google Review",
    icon: Star,
    defaultLabel: "Déjanos una reseña",
  },
  instagram: {
    label: "Instagram",
    icon: AtSign,
    defaultLabel: "Síguenos en Instagram",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    defaultLabel: "Escríbenos por WhatsApp",
  },
  promotion: {
    label: "Promoción",
    icon: Sparkles,
    defaultLabel: "Ver promoción",
  },
  website: {
    label: "Sitio web",
    icon: Globe2,
    defaultLabel: "Visitar sitio web",
  },
  custom: {
    label: "Personalizada",
    icon: Link2,
    defaultLabel: "Nuevo enlace",
  },
}

const templates: ActionTemplate[] = [
  {
    id: "classic",
    name: "Clásica",
    description: "Todo lo esencial",
    className: "bg-zinc-950 text-white",
    types: ["menu", "wifi", "google_review", "instagram", "whatsapp", "website"],
  },
  {
    id: "social",
    name: "Social",
    description: "Conversación y comunidad",
    className:
      "bg-gradient-to-br from-fuchsia-600 to-orange-400 text-white",
    types: ["instagram", "whatsapp", "google_review", "website"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Directa y elegante",
    className: "bg-stone-100 text-stone-950",
    types: ["menu", "google_review", "website"],
  },
]

type Props = {
  restaurantName: string
  branchName: string | null
  activeBranchId: number | null
  canManage: boolean
  initialGlobal: ActionItem[]
  initialBranch: ActionItem[]
}

function newAction(
  type: ActionType,
  branchId: number | null,
  index: number
): ActionItem {
  return {
    id: null,
    type,
    label: typeDetails[type].defaultLabel,
    url: "",
    isEnabled: true,
    sortOrder: index,
    branchId,
    clientId: crypto.randomUUID(),
  }
}

export function ActionsModule(props: Props) {
  const [scope, setScope] = useState<ActionScope>("global")
  const [globalItems, setGlobalItems] = useState(props.initialGlobal)
  const [branchItems, setBranchItems] = useState(props.initialBranch)
  const [template, setTemplate] = useState("classic")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{
    ok: boolean
    text: string
  } | null>(null)

  const items = scope === "global" ? globalItems : branchItems
  const setItems = scope === "global" ? setGlobalItems : setBranchItems
  const selectedTemplate =
    templates.find((item) => item.id === template) ?? templates[0]
  const enabledItems = useMemo(
    () => items.filter((item) => item.isEnabled),
    [items]
  )

  function update(clientId: string, patch: Partial<ActionItem>) {
    setItems((current) =>
      current.map((item) =>
        item.clientId === clientId ? { ...item, ...patch } : item
      )
    )
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
      ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next.map((item, sortOrder) => ({ ...item, sortOrder })))
  }

  function applyTemplate(id: string) {
    setTemplate(id)
    const preset = templates.find((item) => item.id === id)
    if (!preset) return
    const existingByType = new Map(items.map((item) => [item.type, item]))
    setItems(
      preset.types.map((type, index) => ({
        ...(existingByType.get(type) ??
          newAction(
            type,
            scope === "branch" ? props.activeBranchId : null,
            index
          )),
        isEnabled: true,
        sortOrder: index,
      }))
    )
  }

  function submit() {
    setPending(true)
    setMessage(null)

    startTransition(async () => {
      const result = await saveActions({
        scope,
        items: items.map((item, sortOrder) => ({ ...item, sortOrder })),
      })

      setMessage({ ok: result.ok, text: result.message })
      setPending(false)
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Acciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Diseña la página que verán tus clientes al tocar un punto NFC.
          </p>
        </div>

        <Select
          value={scope}
          onValueChange={(value) => setScope(value as ActionScope)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="global">Configuración global</SelectItem>
            {props.activeBranchId && (
              <SelectItem value="branch">
                Sucursal: {props.branchName}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">Elige una plantilla</h2>
          <p className="text-sm text-muted-foreground">
            Puedes personalizarla después de aplicarla.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {templates.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={!props.canManage}
              onClick={() => applyTemplate(item.id)}
              className={cn(
                "rounded-xl border-2 p-3 text-left transition",
                template === item.id
                  ? "border-primary ring-2 ring-primary/15"
                  : "border-transparent bg-background hover:border-border"
              )}
            >
              <div
                className={cn(
                  "mb-3 flex h-24 flex-col justify-center gap-2 rounded-lg p-4",
                  item.className
                )}
              >
                <span className="h-2 w-full rounded-full bg-current opacity-90" />
                <span className="h-2 w-full rounded-full bg-current opacity-60" />
                <span className="h-2 w-full rounded-full bg-current opacity-40" />
              </div>
              <span className="font-medium">{item.name}</span>
              <span className="block text-xs text-muted-foreground">
                {item.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="">
          <div className="flex items-center justify-between p-4 sm:px-5">
            <div>
              <h2 className="font-semibold">Enlaces</h2>
              <p className="text-sm text-muted-foreground">
                Activa, edita y ordena cada acción.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!props.canManage || items.length >= 40}
              onClick={() =>
                setItems((current) => [
                  ...current,
                  newAction(
                    "custom",
                    scope === "branch" ? props.activeBranchId : null,
                    current.length
                  ),
                ])
              }
            >
              <Plus />
              Agregar
            </Button>
          </div>

          <div className="flex flex-col gap-5">
            {items.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No hay acciones. Aplica una plantilla o agrega un enlace.
              </div>
            ) : (
              items.map((item, index) => (
                <ActionEditor
                  key={item.clientId}
                  item={item}
                  index={index}
                  itemCount={items.length}
                  canManage={props.canManage}
                  onUpdate={update}
                  onMove={move}
                  onDelete={() =>
                    setItems((current) =>
                      current.filter(
                        (entry) => entry.clientId !== item.clientId
                      )
                    )
                  }
                />
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {message ? (
              <p
                role="status"
                className={cn(
                  "text-sm",
                  message.ok ? "text-emerald-600" : "text-destructive"
                )}
              >
                {message.text}
              </p>
            ) : (
              <span />
            )}

            {props.canManage ? (
              <Button onClick={submit} disabled={pending}>
                {pending ? <Spinner /> : <Save />}
                {pending ? "Guardando" : "Guardar cambios"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tu rol solo permite consultar.
              </p>
            )}
          </div>
        </section>

        <ActionPreview
          restaurantName={props.restaurantName}
          branchName={props.branchName}
          scope={scope}
          items={enabledItems}
          template={selectedTemplate}
        />
      </div>
    </div>
  )
}