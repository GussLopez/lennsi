"use client";
import { FileUp, Save, Store, Trash2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

import { updateRestaurantSettings, uploadRestaurantLogo } from "@/features/restaurants/actions/update-restaurant-settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Controller, useForm } from "react-hook-form"
import { RestaurantForm } from "../types"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type RestaurantSettingsFormProps = {
  restaurant: {
    id: number
    name: string
    description: string
    logo_url: string | null;
    isActive: boolean
  }
  canEdit: boolean
}

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
]

export function RestaurantSettingsForm({
  restaurant,
  canEdit,
}: RestaurantSettingsFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors }, control } = useForm<RestaurantForm>({
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description,
      logo_url: restaurant.logo_url || null,
      isActive: true
    }
  });
  const isActive = watch("isActive")
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: RestaurantForm) => {
      let uploadedPath: string | null = null;
      if (logoFile) {
        uploadedPath = await uploadRestaurantLogo(
          restaurant.id,
          logoFile
        )
      }

      const response = await updateRestaurantSettings({
        ...formData,
        logo_url: uploadedPath
      });

      if (response.status === "error") {
        if (uploadedPath) {
          const supabase = createClient()

          await supabase.storage
            .from("restaurants-logos")
            .remove([uploadedPath])
        }

        throw new Error(response.message)
      }

      return response
    },
    onSuccess: () => {
      toast.success('Información actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar la información');
    }
  })

  const onSave = (data: RestaurantForm) => {
    mutate(data)
  }

  const handleLogoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingImg(false);

    const file = Array.from(e.dataTransfer.files).find(
      item => item.type.startsWith("image/"),
    )

    if (file) selectLogo(file);
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectLogo(file);
  }
  const handleLogoDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingImg(true);
  }
  const handleLogoDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingImg(false);
  }

  const selectLogo = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error("Solo se permiten JPG, PNG y WEBP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El logo no puede superar 5 MB");
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Restaurante</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta y administra la información general del restaurante seleccionado.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <section className="rounded-xl border bg-background shadow-xs">
          <div className="border-b px-5 py-4 sm:px-6">
            <h2 className="font-semibold">Información general</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Datos visibles y enlaces principales de tu negocio.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Nombre</Label>
              <div className="relative">
                <Store
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="restaurant-name"
                  className="pl-9"
                  disabled={!canEdit || isPending}
                  aria-invalid={Boolean(errors.name?.message)}
                  {...register('name', {
                    required: 'El nombre es requerido'
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-description">Descripción</Label>
              <Textarea
                id="restaurant-description"
                className="h-fit max-h-30"
                disabled={!canEdit || isPending}
                aria-invalid={Boolean(errors.description?.message)}
                {...register('description')}
              />
              {errors.description?.message && (
                <p
                  id="restaurant-instagram-error"
                  className="text-sm text-destructive"
                >
                  {errors.description.message}
                </p>
              )}
            </div>
            <label
              htmlFor="restaurant-logo"
              onDrop={handleLogoDrop}
              onDragOver={handleLogoDragOver}
              onDragLeave={handleLogoDragLeave}
              className={cn("flex flex-col justify-center items-center gap-2 border border-dashed p-4 rounded-lg overflow-hidden transition-all",
                isDraggingImg
                  ? "outline-3 outline-primary/20 border-primary bg-primary/5"
                  : "border-input",
                logoPreview && "bg-accent p-0 border-solid"
              )}
            >
              {logoPreview ? (
                <div className="w-full">
                  <img
                    src={logoPreview}
                    alt="Logo del restaurante"
                    className="w-40 h-auto mx-auto py-3"
                  />
                  <div className="grid grid-cols-2">
                    <Button
                      type="button"
                      variant={'outline'}
                      className={'rounded-none border-b-0 border-l-0'}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload />
                      Cambiar
                    </Button>
                    <Button
                      type="button"
                      variant={'outline'}
                      className={'rounded-none border-b-0 border-r-0'}
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                        setValue("logo_url", null);
                      }}
                    >
                      <Trash2 />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 flex justify-center items-center rounded-full text-primary bg-primary/10">
                    <FileUp className="size-5" />
                  </div>
                  <p className="text-sm">
                    <span className="font-medium text-primary cursor-pointer">
                      Click aquí{" "}
                    </span>
                    para subir tu logo o arrastralo.
                  </p>
                  <span className="text-xs font-light text-muted-foreground">Formato soportado: JPG, JPEG, PNG, WEBP (5mb)</span>
                </>
              )}
              <input
                type="file"
                id="restaurant-logo"
                ref={logoInputRef}
                accept="image/*"
                onChange={handleLogoChange}
                className="sr-only"
              />
            </label>
          </div>
        </section>

        <section
          className="flex items-center justify-between gap-6 rounded-xl border bg-background p-5 shadow-xs sm:p-6"
        >
          <div>
            <h2 className="font-semibold">Restaurante activo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isActive
                ? "El restaurante está habilitado."
                : "El restaurante está desactivado."}
            </p>
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                className={'scale-120'}
                aria-label={
                  isActive ? "Desactivar restaurante" : "Activar restaurante"
                }
                onCheckedChange={field.onChange}
                checked={field.value}
              />
            )}
          />
        </section>

        {!canEdit && (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Puedes consultar esta información, pero solo propietarios y
            administradores pueden editarla.
          </p>
        )}

        {canEdit && (
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : <Save />}
              {isPending ? "Guardando" : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
