"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const useCases = [
  { value: "google_reviews", label: "Reseñas de Google" },
  { value: "menu", label: "Mostrar menú" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "social_media", label: "Redes sociales" },
  { value: "link_page", label: "Sitio web" },
] as const

type UseCase = (typeof useCases)[number]["value"]

const onboardingSchema = z.object({
  name: z.string().trim().min(2, "Ingresa el nombre de tu restaurante."),
  use_case: z.enum(["google_reviews", "menu", "whatsapp", "social_media", "link_page"], {
    error: "Selecciona qué quieres configurar primero.",
  }),
  use_case_value: z.string().trim().min(1, "Completa este campo."),
}).superRefine(({ use_case, use_case_value }, context) => {
  if (use_case === "whatsapp") {
    const digits = use_case_value.replace(/\D/g, "")
    if (digits.length < 7 || digits.length > 15) {
      context.addIssue({ code: "custom", path: ["use_case_value"], message: "Ingresa un número de WhatsApp válido." })
    }
  } else if (!z.url().safeParse(use_case_value).success) {
    context.addIssue({
      code: "custom",
      path: ["use_case_value"],
      message: "Ingresa una URL completa, por ejemplo https://...",
    })
  }
})

type OnboardingValues = z.infer<typeof onboardingSchema>

const dynamicFields: Record<UseCase, { label: string; placeholder: string; type: string }> = {
  google_reviews: { label: "Enlace para dejar una reseña", placeholder: "https://g.page/r/.../review", type: "url" },
  menu: { label: "Enlace de tu menú", placeholder: "https://tu-restaurante.com/menu", type: "url" },
  whatsapp: { label: "Número de WhatsApp", placeholder: "+529981234567", type: "tel" },
  social_media: { label: "Enlace de tu red social principal", placeholder: "https://instagram.com/tu-restaurante", type: "url" },
  link_page: { label: "Enlace de tu sitio web", placeholder: "https://tu-restaurante.com", type: "url" },
}

export default function RestaurantOnboarding() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
    trigger,
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", use_case: undefined, use_case_value: "" },
    mode: "onTouched",
  })

  const useCase = useWatch({ control, name: "use_case" })
  const dynamicField = useCase ? dynamicFields[useCase] : null

  async function goForward() {
    const field = step === 1 ? "name" : "use_case"
    if (await trigger(field)) setStep((current) => Math.min(current + 1, 3))
  }

  async function submit(values: OnboardingValues) {
    try {
      const response = await fetch("/api/restaurants/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data: { error?: string } = await response.json()
      console.log(data.error);
      if (!response.ok) throw new Error(data.error || "No se pudo crear el restaurante.")
      router.refresh()
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      })
    }
  }

  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Crea tu restaurante</DialogTitle>
          <DialogDescription>Para comenzar, configura tu primer restaurante.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2" aria-label={`Paso ${step} de 3`}>
          {[1, 2, 3].map((number) => (
            <React.Fragment key={number}>
              {number > 1 && <div className={cn("h-0.5", step >= number ? "bg-primary" : "bg-zinc-300")} />}
              <div className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs",
                step >= number && "bg-primary text-primary-foreground",
                step === number && "ring-1 ring-primary ring-offset-1"
              )}>
                {step > number ? <Check className="size-3.5" /> : number}
              </div>
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Nombre del restaurante</Label>
              <Input id="restaurant-name" placeholder="Ej. Los Chilaquiles" autoComplete="organization" autoFocus
                aria-invalid={Boolean(errors.name)} {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="restaurant-use-case">¿Qué quieres configurar primero?</Label>
              <Controller name="use_case" control={control} render={({ field }) => (
                <Select items={useCases} value={field.value ?? null} onValueChange={(value) => {
                  field.onChange(value)
                  setValue("use_case_value", "")
                }}>
                  <SelectTrigger id="restaurant-use-case" className="w-full" aria-invalid={Boolean(errors.use_case)}>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {useCases.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
              {errors.use_case && <p className="text-sm text-destructive">{errors.use_case.message}</p>}
            </div>
          )}

          {step === 3 && dynamicField && (
            <div className="space-y-2">
              <Label htmlFor="restaurant-use-case-value">{dynamicField.label}</Label>
              <Input id="restaurant-use-case-value" type={dynamicField.type} placeholder={dynamicField.placeholder}
                autoFocus aria-invalid={Boolean(errors.use_case_value)} {...register("use_case_value")} />
              {errors.use_case_value && <p className="text-sm text-destructive">{errors.use_case_value.message}</p>}
            </div>
          )}

          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

          <div className="mt-10 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              className={cn(step === 1 && "invisible")}
              disabled={step === 1 || isSubmitting}
              onClick={() => setStep((current) => Math.max(current - 1, 1))}
            >
              Atrás
            </Button>
            <Button
              type={step === 3 ? "submit" : "button"}
              disabled={isSubmitting}
              onClick={step === 3 ? undefined : goForward}
            >
              {step === 3 ?
                (isSubmitting
                  ?
                  <>
                    <Spinner />
                    Creando
                  </>
                  : "Crear restaurante")
                : "Siguiente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
