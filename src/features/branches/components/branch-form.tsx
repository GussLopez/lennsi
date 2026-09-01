"use client"

import { File, FileUp, Image, Save, Trash2, Upload } from "lucide-react"
import { useRef, useState } from "react";
import { saveBranch } from "@/features/branches/actions/save-branch";
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
import { cn } from "@/lib/utils"

type BranchFormProps = {
  initialValues: BranchFormValues
}

export function BranchForm({ initialValues }: BranchFormProps) {
  const [hideWifi, setHideWifi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
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

  const handleMenuDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingPdf(false);

    const file = Array.from(e.dataTransfer.files).find(
      item => item.type.startsWith("application/"),
    )

    if (file) selectMenu(file);
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectMenu(file);
  }
  const handleMenuDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingPdf(true);
  }
  const handleMenuDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingPdf(false);
  }

  const selectMenu = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El logo no puede superar 5 MB");
      return;
    }
    setMenuFile(file);
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

      <section className="rounded-xl border bg-background shadow-xs">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Menú para clientes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Agrega el menú de la sucursal.
          </p>
        </div>
        <div className="p-4">
          <label
            htmlFor="branch-menu"
            onDrop={handleMenuDrop}
            onDragOver={handleMenuDragOver}
            onDragLeave={handleMenuDragLeave}
            className={cn("flex flex-col justify-center items-center gap-2 border border-dashed p-4 rounded-lg overflow-hidden transition-all",
              isDraggingPdf
                ? "outline-3 outline-primary/20 border-primary bg-primary/5"
                : "border-input"
            )}
          >
            <div className="w-10 h-10 flex justify-center items-center rounded-full text-primary bg-primary/10">
              <FileUp className="size-5" />
            </div>
            <p className="text-sm">
              <span className="font-medium text-primary cursor-pointer">
                Click aquí{" "}
              </span>
              para subir tu menú o arrastralo.
            </p>
            <span className="text-xs font-light text-muted-foreground">Formato soportado: PDF (5mb)</span>
            <input
              type="file"
              id="branch-menu"
              ref={menuInputRef}
              accept="application/pdf"
              onChange={handleLogoChange}
              className="sr-only"
            />
          </label>
          {menuFile && (
            <div className="relative w-full mt-4 border border-muted rounded-lg shadow-xs bg-white">
              <div className="flex items-center gap-4 p-2">
                <div className="w-10 h-10 flex justify-center items-center">
                  <img
                    src={'/icons/pdf.svg'}
                    alt="Icono Archivo PDF"
                    className="size-10"
                  />
                </div>
                <div className="flex gap-2">
                  <p className="text-sm font-medium">{menuFile.name}</p>
                  <span className="text-sm text-muted-foreground">
                    · {(menuFile.size / 1000000).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <Button
                variant={'ghost'}
                size={'icon'}
                className={'absolute top-2 right-3 text-destructive hover:bg-destructive/10 hover:text-destructive'}
                onClick={() => {
                  setMenuFile(null);
                  setValue("menu_url", null);
                }}
              >
                <Trash2 />
                <span className="sr-only">Eliminar menú del restaurante</span>
              </Button>
            </div>
          )}
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