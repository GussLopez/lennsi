"use client"

import { Plus, Save } from "lucide-react";
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
import type { ActionItem, ActionScope, ActionType } from "@/features/actions/types/types";
import { cn } from "@/lib/utils"
import ActionPreview from "./action-preview"
import ActionEditor from "./action-editor"
import { Reorder } from "motion/react"
import { templates, typeDetails } from "../data";

type ActionModulesProps = {
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
  const [template, setTemplate] = useState("classic")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{
    ok: boolean
    text: string
  } | null>(null)

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
          items={scopeOptions}
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
                      damping: 30
                    }}
                    whileDrag={{ scale: 1.08 }}
                  >
                    <ActionEditor
                      item={item}
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

          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
