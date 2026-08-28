"use client"

import { Plus, Save } from "lucide-react"
import { startTransition, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { saveActions } from "@/features/actions/actions/save-actions"
import type {
  ActionItem,
  ActionScope,
  ActionTemplateId,
  ActionType,
} from "@/features/actions/types/types"
import { cn } from "@/lib/utils"
import { Reorder } from "motion/react"
import { templates, typeDetails } from "../data"
import { isValidHttpUrl, isValidWhatsAppValue } from "../validation"
import ActionEditor from "./action-editor"
import ActionPreview from "./action-preview"
import toast from "react-hot-toast"

type ActionModulesProps = {
  restaurantName: string
  branchName: string | null
  activeBranchId: number | null
  canManage: boolean
  initialBranchTemplateId: ActionTemplateId
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
    label:
      typeDetails.find((detail) => detail.value === type)?.defaultLabel ??
      "Nuevo enlace",
    url: "",
    isEnabled: true,
    sortOrder: index,
    branchId,
    clientId: crypto.randomUUID(),
  }
}

export function ActionsModule(props: ActionModulesProps) {
  const [scope, setScope] = useState<ActionScope>("global")
  const [globalItems, setGlobalItems] = useState(props.initialGlobal)
  const [branchItems, setBranchItems] = useState(props.initialBranch)
  const [templateId, setTemplateId] = useState<ActionTemplateId>(
    props.initialBranchTemplateId,
  )
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)

  const scopeOptions = [
    { value: "global", label: "Configuración global" },
    {
      value: "branch",
      label: `Sucursal: ${props.branchName ?? "Sin sucursal"}`,
    },
  ] satisfies Array<{ value: ActionScope; label: string }>

  const items = scope === "global" ? globalItems : branchItems
  const setItems = scope === "global" ? setGlobalItems : setBranchItems
  const selectedTemplate =
    templates.find((item) => item.id === templateId) ?? templates[0]
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
    if (patch.url !== undefined) {
      setUrlErrors((current) => {
        const next = { ...current }
        delete next[clientId]
        return next
      })
    }
  }

  function applyTemplate(id: ActionTemplateId) {
    setTemplateId(id)
  }

  function submit() {
    const errors = Object.fromEntries(
      items.flatMap((item) => {
        const url = item.url.trim()
        if (!url) return [[item.clientId, "El enlace es obligatorio."]]
        if (item.type === "whatsapp" && !isValidWhatsAppValue(url)) {
          return [[item.clientId, "Ingresa un número de WhatsApp válido o un enlace."]]
        }
        if (item.type !== "whatsapp" && !isValidHttpUrl(url)) {
          return [[item.clientId, "Ingresa una URL válida con http:// o https://."]]
        }
        return []
      })
    )

    if (Object.keys(errors).length > 0) {
      setUrlErrors(errors)
      toast.error("Revisa los enlaces antes de guardar.")
      return
    }
    setPending(true);

    startTransition(async () => {
      try {
        const result = await saveActions({
          scope,
          templateId: selectedTemplate.id,
          items: items.map((item, sortOrder) => ({ ...item, sortOrder })),
        })

        if (result.ok) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch {
        toast.error("El servidor no pudo procesar la solicitud. Reinicia el servidor de desarrollo e intenta nuevamente.")
      } finally {
        setPending(false)
      }
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
          items={scopeOptions}
          onValueChange={(value) => setScope(value as ActionScope)}
        >
          <SelectTrigger className="w-full sm:w-64 bg-background">
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
            Cambiar el diseño no modifica tus enlaces configurados.
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
                templateId === item.id
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
          <div className="flex items-center justify-between py-4">
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

          <div>
            {items.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No hay acciones. Aplica una plantilla o agrega un enlace.
              </div>
            ) : (
              <Reorder.Group
                as="div"
                values={items}
                onReorder={setItems}
                aria-label="Reorable list"
                className="flex flex-col gap-5"
              >

                {items.map((item) => (
                  <Reorder.Item
                    as="div"
                    key={item.clientId}
                    value={item}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                    whileDrag={{ scale: 1.08 }}
                  >
                    <ActionEditor
                      item={item}
                      urlError={urlErrors[item.clientId]}
                      canManage={props.canManage}
                      onUpdate={update}
                      onDelete={() =>
                        setItems((current) =>
                          current.filter(
                            (entry) => entry.clientId !== item.clientId
                          )
                        )
                      }
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-end">
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
