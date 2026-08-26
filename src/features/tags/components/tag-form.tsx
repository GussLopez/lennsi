"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { createTag, fetchTags, updateTag } from "@/features/tags/api/tags-client"
import { tagSchema, type TagFormValues } from "@/features/tags/schemas/tag-schema"
import FormMessage from "@/components/ui/form-message"

type TagFormProps = {
  branchId: number
  tagId?: number
}

export function TagForm({ branchId, tagId }: TagFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const tagsQuery = useQuery({
    queryKey: ["tags", branchId],
    queryFn: fetchTags,
  })
  const tag = tagsQuery.data?.tags.find((item) => item.id === tagId)

  if (tagsQuery.isPending) {
    return <div className="flex min-h-48 items-center justify-center"><Spinner /></div>
  }

  if (tagsQuery.isError) {
    return <FormMessage message={tagsQuery.error.message} />
  }

  if (tagId && !tag) {
    return <FormMessage message="El tag no existe en la sucursal activa." />
  }

  return (
    <TagFormFields
      key={tag?.id ?? "new"}
      tagId={tagId}
      initialValues={{
        id: tag?.id,
        label: tag?.label ?? "",
        touchpointId: tag?.touchpoint_id ?? tagsQuery.data.touchpoints[0]?.id ?? 0,
        isActive: tag?.is_active ?? true,
      }}
      touchpoints={tagsQuery.data.touchpoints}
      onSaved={async () => {
        await queryClient.invalidateQueries({ queryKey: ["tags", branchId] })
        router.push("/dashboard/tags")
      }}
    />
  )
}

type TagFormFieldsProps = {
  tagId?: number
  initialValues: TagFormValues
  touchpoints: Array<{ id: number; name: string; number: number | null }>
  onSaved: () => Promise<void>
}

function TagFormFields({ tagId, initialValues, touchpoints, onSaved }: TagFormFieldsProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: initialValues,
  })
  const isActive = useWatch({ control, name: "isActive" })
  const mutation = useMutation({
    mutationFn: (values: TagFormValues) => tagId
      ? updateTag({ ...values, id: tagId })
      : createTag(values),
    onSuccess: onSaved,
  })

  return (
    <form className="space-y-6" onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
      <section className="rounded-xl border bg-background shadow-xs">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Información del tag</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Asigna una etiqueta descriptiva y el touchpoint donde se utilizará.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="tag-label">Etiqueta</Label>
            <Input
              id="tag-label"
              placeholder="NFC Mesa 01"
              disabled={mutation.isPending}
              aria-invalid={Boolean(errors.label)}
              {...register("label")}
            />
            {errors.label && <p className="text-sm text-destructive">{errors.label.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-touchpoint">Touchpoint</Label>
            <Controller
              control={control}
              name="touchpointId"
              render={({ field }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(Number(value))}
                  disabled={mutation.isPending || !touchpoints.length}
                >
                  <SelectTrigger id="tag-touchpoint" className="w-full" aria-invalid={Boolean(errors.touchpointId)}>
                    <SelectValue placeholder="Selecciona un touchpoint">
                      {touchpoints.find((item) => item.id === field.value)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {touchpoints.map((touchpoint) => (
                      <SelectItem key={touchpoint.id} value={touchpoint.id}>
                        {touchpoint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.touchpointId && <p className="text-sm text-destructive">{errors.touchpointId.message}</p>}
            {!touchpoints.length && (
              <p className="text-sm text-destructive">Crea un touchpoint antes de registrar un tag.</p>
            )}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between gap-6 rounded-xl border bg-background p-5 shadow-xs sm:p-6">
        <div>
          <h2 className="font-semibold">Tag activo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isActive ? "La URL pública está habilitada." : "La URL pública está desactivada."}
          </p>
        </div>
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={mutation.isPending}
              aria-label={field.value ? "Desactivar tag" : "Activar tag"}
              className="scale-120"
            />
          )}
        />
      </section>

      {mutation.isError && <FormMessage message={mutation.error.message} />}

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending || !touchpoints.length}>
          {mutation.isPending ? <Spinner /> : <Save />}
          {mutation.isPending ? "Guardando" : tagId ? "Guardar cambios" : "Crear tag"}
        </Button>
      </div>
    </form>
  )
}

