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

export type BranchFormValues = {
  id?: number
  name: string
  address: string
  phone: string
  whatsapp: string
  googleReviewUrl: string
  wifiSsid: string
  wifiPassword: string
  timezone: string
  is_active: boolean
}

type BranchFormProps = {
  initialValues: BranchFormValues
}

const initialState: BranchFormState = {
  status: "idle",
  message: "",
}

export function BranchForm({ initialValues }: BranchFormProps) {
  const [state, formAction, pending] = useActionState(saveBranch, initialState)
  const [hideWifi, setHideWifi] = useState(false);
  const [isActive, setIsActive] = useState(initialValues.is_active)

  return (
    <form action={formAction} className="space-y-6">
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
          <FormField
            id="branch-name"
            label="Nombre"
            name="name"
            defaultValue={initialValues.name}
            placeholder="Sucursal centro"
            error={state.errors?.name}
            required
            disabled={pending}
          />
          <FormField
            id="branch-timezone"
            label="Zona horaria"
            name="timezone"
            defaultValue={initialValues.timezone}
            placeholder="America/Cancun"
            error={state.errors?.timezone}
            required
            disabled={pending}
          />
          <div className="sm:col-span-2">
            <FormField
              id="branch-address"
              label="Dirección"
              name="address"
              defaultValue={initialValues.address}
              placeholder="Calle, número, colonia, ciudad"
              error={state.errors?.address}
              disabled={pending}
            />
          </div>
          <FormField
            id="branch-phone"
            label="Teléfono"
            name="phone"
            type="tel"
            defaultValue={initialValues.phone}
            placeholder="+52 998 123 4567"
            error={state.errors?.phone}
            disabled={pending}
          />
          <FormField
            id="branch-whatsapp"
            label="WhatsApp"
            name="whatsapp"
            type="tel"
            defaultValue={initialValues.whatsapp}
            placeholder="+52 998 123 4567"
            error={state.errors?.whatsapp}
            disabled={pending}
          />
          <div className="sm:col-span-2">
            <FormField
              id="branch-google-review"
              label="Enlace de reseñas de Google"
              name="googleReviewUrl"
              type="url"
              defaultValue={initialValues.googleReviewUrl}
              placeholder="https://g.page/r/.../review"
              error={state.errors?.googleReviewUrl}
              disabled={pending}
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
          <FormField
            id="branch-wifi-ssid"
            label="Nombre de red"
            name="wifiSsid"
            defaultValue={initialValues.wifiSsid}
            placeholder="WiFi Restaurante"
            error={state.errors?.wifiSsid}
            disabled={pending || hideWifi}
          />
          <FormField
            id="branch-wifi-password"
            label="Contraseña"
            name="wifiPassword"
            defaultValue={initialValues.wifiPassword}
            placeholder="Contraseña de la red"
            error={state.errors?.wifiPassword}
            disabled={pending || hideWifi}
          />
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
        <Switch 
          name="isActive"
          value="true"
          uncheckedValue="false"
          checked={isActive}
          aria-label={isActive ? "Desactivar sucursal" : "Activar sucursal"}
          disabled={pending}
          onCheckedChange={setIsActive}
          className={'scale-120'}
        />
      </section>

      {state.message && (
        <p
          className={
            state.status === "success"
              ? "text-sm text-emerald-600"
              : "text-sm text-destructive"
          }
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : <Save />}
          {pending
            ? "Guardando"
            : initialValues.id
              ? "Guardar cambios"
              : "Crear sucursal"}
        </Button>
      </div>
    </form>
  )
}

type FormFieldProps = {
  id: string
  label: string
  name: string
  defaultValue: string
  error?: string
  placeholder?: string
  type?: "text" | "tel" | "url"
  required?: boolean
  disabled?: boolean
}

function FormField({
  id,
  label,
  name,
  defaultValue,
  error,
  placeholder,
  type = "text",
  required,
  disabled,
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        inputMode={type === "url" ? "url" : undefined}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
