"use client"

import { Save } from "lucide-react"
import { useActionState, useState } from "react"

import {
  saveBranch,
  type BranchFormState,
} from "@/features/branches/actions/save-branch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Controller, useForm } from "react-hook-form"
import FormMessage from "@/components/ui/form-message"
import { BranchFormValues } from "../types/types"
import toast from "react-hot-toast"



type BranchFormProps = {
  initialValues: BranchFormValues
}

export function BranchForm({ initialValues }: BranchFormProps) {
  const [hideWifi, setHideWifi] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: initialValues
  });
  const isActive = watch('is_active');

  const handleCreateBranch = async (formData: BranchFormValues) => {
    setLoading(true);
    const res = await saveBranch(formData);

    setLoading(false);
    if (res.status === "success") {
      toast.success("Datos actualizados");
    } else {
      toast.error("Error al editar la sucursal")
    }
  }
  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(handleCreateBranch)}
    >
      {initialValues.id && (
        <input type="hidden" name="branchId" value={initialValues.id} />
      )}

      <section className="rounded-xl border bg-background shadow-xs">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Información general</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Datos de contacto y ubicación de la sucursal.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="branch-name">Nombre</Label>
            <Input
              id="branch-name"
              placeholder="Sucursal centro"
              aria-invalid={Boolean(errors.name?.message)}
              disabled={loading}
              {...register('name', {
                required: 'El nombre es requerido'
              })}
            />
            {errors.name?.message && <FormMessage message={errors.name.message} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-timezone">Zona horaria</Label>
            <Input
              id="branch-timezone"
              placeholder="America/Cancun"
              aria-invalid={Boolean(errors.timezone?.message)}
              disabled={loading}
              {...register('timezone')}
            />
          </div>
          <div className="sm:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="branch-address">Dirección</Label>
              <Input
                id="branch-address"
                placeholder="Calle, número, colonia, ciudad"
                aria-invalid={Boolean(errors.address?.message)}
                disabled={loading}
                {...register('address')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-phone">Télefono</Label>
            <Input
              id="branch-phone"
              placeholder="+52 998 123 4567"
              aria-invalid={Boolean(errors.phone?.message)}
              disabled={loading}
              {...register('phone')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-whatsapp">Whatsapp</Label>
            <Input
              id="branch-whatsapp"
              placeholder="+52 998 123 4567"
              aria-invalid={Boolean(errors.whatsapp?.message)}
              disabled={loading}
              {...register('whatsapp')}
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="branch-google-review">Enlace de reseñas de Google</Label>
            <Input
              id="branch-google-review"
              placeholder="https://g.page/r/.../review"
              aria-invalid={Boolean(errors.googleReviewUrl?.message)}
              disabled={loading}
              {...register('googleReviewUrl')}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-background shadow-xs">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Wi-Fi para clientes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Credenciales opcionales que podrán utilizar las acciones NFC.
          </p>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="branch-wifi-ssid">Nombre de red</Label>
            <Input
              id="branch-wifi-ssid"
              placeholder="WiFi Restaurante"
              aria-invalid={Boolean(errors.wifiSsid?.message)}
              disabled={loading || hideWifi}
              {...register('wifiSsid')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-wifi-password">Contraseña</Label>
            <Input
              id="branch-wifi-password"
              placeholder="WiFi Restaurante"
              aria-invalid={Boolean(errors.wifiPassword?.message)}
              disabled={loading || hideWifi}
              {...register('wifiPassword')}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="hide-wifi"
              onCheckedChange={setHideWifi}
            />
            <Label htmlFor="hide-wifi">Ocultar Wi-Fi para clientes</Label>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between gap-6 rounded-xl border bg-background p-5 shadow-xs sm:p-6">
        <div>
          <h2 className="font-semibold">Sucursal activa</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isActive
              ? "La sucursal está habilitada."
              : "La sucursal está desactivada."}
          </p>
        </div>
        <Controller
          name="is_active"
          control={control}
          aria-label={isActive ? "Desactivar sucursal" : "Activar sucursal"}
          render={({ field }) => (
            <Switch
              checked={field.value}
              disabled={loading}
              onCheckedChange={field.onChange}
              className={'scale-120'}
            />
          )}

        />

      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : <Save />}
          {loading
            ? "Guardando"
            : initialValues.id
              ? "Guardar cambios"
              : "Crear sucursal"}
        </Button>
      </div>
    </form>
  )
}