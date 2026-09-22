"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import FormMessage from "@/components/ui/form-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { fetchSigns, saveSign } from "@/features/signs/api/signs-client"
import { signSchema, type SignFormValues } from "@/features/signs/schemas/sign-schema"
import { getPublicSignUrl } from "@/features/signs/public-sign-url"

export default function SignForm({ restaurantId, signId }: { restaurantId: number; signId?: number }) {
  const query = useQuery({ queryKey: ["signs", restaurantId], queryFn: () => fetchSigns(restaurantId) })
  if (query.isPending) return <div className="flex min-h-48 items-center justify-center"><Spinner /></div>
  if (query.isError) return <FormMessage message={query.error.message} />
  if (!query.data.canManage) return <FormMessage message="No tienes permiso para administrar carteles." />
  const sign = query.data.signs.find((item) => item.id === signId)
  if (signId && !sign) return <FormMessage message="El cartel no existe en el restaurante activo." />

  return <SignFormFields key={`${restaurantId}:${signId ?? "new"}`} restaurantId={restaurantId}
    signId={signId} token={sign?.token} initialValues={{
      label: sign?.label ?? "", businessName: sign?.business_name ?? "",
      destinationUrl: sign?.destination_url ?? "", isActive: sign?.is_active ?? true,
    }} />
}

function SignFormFields({ restaurantId, signId, token, initialValues }: {
  restaurantId: number; signId?: number; token?: string; initialValues: SignFormValues
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { register, control, handleSubmit, formState: { errors } } = useForm<SignFormValues>({
    resolver: zodResolver(signSchema), defaultValues: initialValues,
  })
  const mutation = useMutation({
    mutationFn: (values: SignFormValues) => saveSign(restaurantId, values, signId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["signs", restaurantId] })
      router.push("/dashboard/signs")
    },
  })

  return (
    <form className="space-y-6" onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
      <section className="rounded-xl border bg-background shadow-xs">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Información del cartel</h2>
          <p className="mt-1 text-sm text-muted-foreground">Puedes imprimirlo ahora y asignar su destino más adelante.</p>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="sign-label">Etiqueta interna</Label>
            <Input id="sign-label" placeholder="Cartel 001" disabled={mutation.isPending}
              aria-invalid={Boolean(errors.label)} {...register("label")} />
            {errors.label && <FormMessage message={errors.label.message ?? "Revisa la etiqueta."} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sign-business">Negocio destinatario (opcional)</Label>
            <Input id="sign-business" placeholder="Cafetería Central" disabled={mutation.isPending}
              aria-invalid={Boolean(errors.businessName)} {...register("businessName")} />
            {errors.businessName && <FormMessage message={errors.businessName.message ?? "Revisa el negocio."} />}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="sign-destination">Enlace de destino (opcional)</Label>
            <Input id="sign-destination" type="url" placeholder="https://g.page/r/.../review"
              disabled={mutation.isPending} aria-invalid={Boolean(errors.destinationUrl)}
              aria-describedby="sign-destination-help" {...register("destinationUrl")} />
            <p id="sign-destination-help" className="text-sm text-muted-foreground">
              Al escanear se abrirá este enlace. Si lo dejas vacío, el cartel quedará pendiente de activación.
            </p>
            {errors.destinationUrl && <FormMessage message={errors.destinationUrl.message ?? "Revisa el enlace."} />}
          </div>
        </div>
      </section>
      {token && <section className="space-y-2 rounded-xl border bg-background p-5 sm:p-6">
        <h2 className="font-semibold">Enlace permanente del QR y NFC</h2>
        <a href={getPublicSignUrl(token)} target="_blank" rel="noreferrer"
          className="block break-all text-sm text-primary hover:underline">{getPublicSignUrl(token)}</a>
        <p className="text-sm text-muted-foreground">Conservarás este enlace y el mismo QR aunque cambies el destino.</p>
      </section>}
      <section className="flex items-center justify-between gap-6 rounded-xl border bg-background p-5 sm:p-6">
        <div>
          <h2 className="font-semibold">Cartel habilitado</h2>
          <p className="mt-1 text-sm text-muted-foreground">Al desactivarlo dejará de redirigir, conservando su QR.</p>
        </div>
        <Controller control={control} name="isActive" render={({ field }) => (
          <Switch checked={field.value} onCheckedChange={field.onChange}
            disabled={mutation.isPending} aria-label="Cartel habilitado" />
        )} />
      </section>
      {mutation.isError && <FormMessage message={mutation.error.message} />}
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner /> : <Save />}
          {mutation.isPending ? "Guardando" : signId ? "Guardar cambios" : "Crear cartel"}
        </Button>
      </div>
    </form>
  )
}
