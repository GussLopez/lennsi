"use client";
import { Save, Store } from "lucide-react";
import { useState } from "react";

import {
  type RestaurantSettingsState,
  updateRestaurantSettings,
} from "@/features/restaurants/actions/update-restaurant-settings"
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

type RestaurantSettingsFormProps = {
  restaurant: {
    name: string
    description: string
    isActive: boolean
  }
  canEdit: boolean
}

const initialRestaurantSettingsState: RestaurantSettingsState = {
  status: "idle",
  message: "",
}

export function RestaurantSettingsForm({
  restaurant,
  canEdit,
}: RestaurantSettingsFormProps) {

  const { register, handleSubmit, watch, formState: { errors }, control } = useForm<RestaurantForm>({
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description,
      isActive: true
    }
  });
  const isActive = watch("isActive")
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: RestaurantForm) => {
      const response = await updateRestaurantSettings(formData);
      if (response.status === "error") throw new Error("Error al actualizar los datos");
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
