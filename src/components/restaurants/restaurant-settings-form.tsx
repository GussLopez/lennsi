"use client"

import { AtSign, Globe2, Link2, Save, Store } from "lucide-react"
import { useActionState, useState } from "react"

import {
  type RestaurantSettingsState,
  updateRestaurantSettings,
} from "@/app/dashboard/settings/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "../ui/switch"

type RestaurantSettingsFormProps = {
  restaurant: {
    name: string
    instagramUrl: string
    facebookUrl: string
    website: string
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
  const [state, formAction, pending] = useActionState(
    updateRestaurantSettings,
    initialRestaurantSettingsState
  )
  const [isActive, setIsActive] = useState(restaurant.isActive)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)

  function changeActive(nextValue: boolean) {
    if (!nextValue) {
      setShowDeactivateDialog(true)
      return
    }
    setIsActive(true)
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Restaurante</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta y administra la información general del restaurante seleccionado.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
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
                  name="name"
                  defaultValue={restaurant.name}
                  className="pl-9"
                  maxLength={120}
                  required
                  disabled={!canEdit || pending}
                  aria-invalid={Boolean(state.errors?.name)}
                  aria-describedby={
                    state.errors?.name ? "restaurant-name-error" : undefined
                  }
                />
              </div>
              {state.errors?.name && (
                <p
                  id="restaurant-name-error"
                  className="text-sm text-destructive"
                >
                  {state.errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-instagram">Instagram</Label>
              <div className="relative">
                <AtSign
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="restaurant-instagram"
                  name="instagramUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://instagram.com/tu-restaurante"
                  defaultValue={restaurant.instagramUrl}
                  className="pl-9"
                  disabled={!canEdit || pending}
                  aria-invalid={Boolean(state.errors?.instagramUrl)}
                  aria-describedby={
                    state.errors?.instagramUrl
                      ? "restaurant-instagram-error"
                      : undefined
                  }
                />
              </div>
              {state.errors?.instagramUrl && (
                <p
                  id="restaurant-instagram-error"
                  className="text-sm text-destructive"
                >
                  {state.errors.instagramUrl}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-facebook">Facebook</Label>
              <div className="relative">
                <Link2
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="restaurant-facebook"
                  name="facebookUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://facebook.com/tu-restaurante"
                  defaultValue={restaurant.facebookUrl}
                  className="pl-9"
                  disabled={!canEdit || pending}
                  aria-invalid={Boolean(state.errors?.facebookUrl)}
                  aria-describedby={
                    state.errors?.facebookUrl
                      ? "restaurant-facebook-error"
                      : undefined
                  }
                />
              </div>
              {state.errors?.facebookUrl && (
                <p
                  id="restaurant-facebook-error"
                  className="text-sm text-destructive"
                >
                  {state.errors.facebookUrl}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-website">Sitio Web</Label>
              <div className="relative">
                <Globe2
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="restaurant-website"
                  name="website"
                  type="url"
                  inputMode="url"
                  placeholder="https://tu-restaurante.com"
                  defaultValue={restaurant.website}
                  className="pl-9"
                  disabled={!canEdit || pending}
                  aria-invalid={Boolean(state.errors?.website)}
                  aria-describedby={
                    state.errors?.website
                      ? "restaurant-website-error"
                      : undefined
                  }
                />
              </div>
              {state.errors?.website && (
                <p
                  id="restaurant-website-error"
                  className="text-sm text-destructive"
                >
                  {state.errors.website}
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
          <input type="hidden" name="isActive" value={String(isActive)} />
          <Switch
            className={'scale-120'}
            aria-label={
              isActive ? "Desactivar restaurante" : "Activar restaurante"
            }
            onCheckedChange={changeActive}
            checked={isActive}
          />
        </section>

        {!canEdit && (
          <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Puedes consultar esta información, pero solo propietarios y
            administradores pueden editarla.
          </p>
        )}

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

        {canEdit && (
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner /> : <Save />}
              {pending ? "Guardando" : "Guardar cambios"}
            </Button>
          </div>
        )}
      </form>

      <Dialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Desactivar restaurante?</DialogTitle>
            <DialogDescription>
              El restaurante aparecerá como inactivo hasta que vuelvas a
              activarlo. Esta acción se aplicará cuando guardes los cambios.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeactivateDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setIsActive(false)
                setShowDeactivateDialog(false)
              }}
            >
              Desactivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
