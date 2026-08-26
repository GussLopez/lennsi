"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { saveTouchpoint, type SaveTouchpointResult } from "@/features/touchpoints/actions/save-touchpoint"
import {
  TOUCHPOINT_TYPES,
  touchpointSchema,
  touchpointTypeLabels,
  type TouchpointFormValues,
} from "@/features/touchpoints/schemas/touchpoint-schema"

type TouchpointFormProps = {
  initialValues: TouchpointFormValues
}

export function TouchpointForm({ initialValues }: TouchpointFormProps) {
  const [result, setResult] = useState<SaveTouchpointResult | null>(null)
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<TouchpointFormValues>({
    resolver: zodResolver(touchpointSchema),
    defaultValues: initialValues,
  })

  const isActive = useWatch({ control, name: "isActive" })

  const onSubmit = handleSubmit(async (values) => {
    setResult(null)
    const nextResult = await saveTouchpoint(values)
    setResult(nextResult)

    if (nextResult.errors) {
      for (const [field, message] of Object.entries(nextResult.errors)) {
        if (message) setError(field as keyof TouchpointFormValues, { message })
      }
    }
  })

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      <section className="rounded-xl border bg-background shadow-xs">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Información general</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Identifica el lugar físico donde estará colocado el NFC.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="touchpoint-name">Nombre</Label>
            <Input
              id="touchpoint-name"
              placeholder="Mesa 01"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "touchpoint-name-error" : undefined}
              {...register("name")}
            />
            <FieldError id="touchpoint-name-error" message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="touchpoint-type">Tipo</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="touchpoint-type"
                    className="w-full"
                    aria-invalid={Boolean(errors.type)}
                    aria-describedby={errors.type ? "touchpoint-type-error" : undefined}
                  >
                    <SelectValue placeholder="Selecciona un tipo">
                      {touchpointTypeLabels[field.value]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {TOUCHPOINT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {touchpointTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="touchpoint-type-error" message={errors.type?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="touchpoint-number">Número (opcional)</Label>
            <Input
              id="touchpoint-number"
              type="number"
              min={1}
              step={1}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.number)}
              aria-describedby={errors.number ? "touchpoint-number-error" : undefined}
              {...register("number", {
                setValueAs: (value: string | number | null | undefined) =>
                  value === "" || value === null || value === undefined
                    ? null
                    : Number(value),
              })}
            />
            <FieldError id="touchpoint-number-error" message={errors.number?.message} />
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between gap-6 rounded-xl border bg-background p-5 shadow-xs sm:p-6">
        <div>
          <h2 className="font-semibold">Touchpoint activo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isActive ? "El touchpoint está habilitado." : "El touchpoint está desactivado."}
          </p>
        </div>
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
              aria-label={field.value ? "Desactivar touchpoint" : "Activar touchpoint"}
              className="scale-120"
            />
          )}
        />
      </section>

      {result?.message && (
        <p
          role="status"
          aria-live="polite"
          className={result.status === "success" ? "text-sm text-emerald-600" : "text-sm text-destructive"}
        >
          {result.message}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : <Save />}
          {isSubmitting ? "Guardando" : initialValues.id ? "Guardar cambios" : "Crear touchpoint"}
        </Button>
      </div>
    </form>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return <p id={id} className="text-sm text-destructive">{message}</p>
}
