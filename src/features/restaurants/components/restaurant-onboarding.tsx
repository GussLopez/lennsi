"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { discoverySourceOptions } from "../data/onboarding"
import { OnboardingSchema } from "../schemas/onboarding-schema"
import type { OnboardingValues } from "../types"
import { Confetti, ConfettiRef } from "@/components/ui/confetti"
import { ConfettiSideCannons, ConfettiSideCannonsRef } from "@/components/ui/confetti-side-cannons"

export default function RestaurantOnboarding() {
  const confettiRef = useRef<ConfettiSideCannonsRef>(null);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    trigger,
  } = useForm<OnboardingValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: "",
      discovery_source: undefined,
    },
    mode: "onTouched",
  })

  async function goForward() {
    const field = step === 1 ? "name" : "discovery_source"
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
      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear el restaurante.")
      }
      await confettiRef.current?.fire();
      router.refresh();
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      })
    }
  }

  return (
    <>
     {/*  <Confetti 
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed inset-0 z-100 size-full"
      /> */}
      <ConfettiSideCannons ref={confettiRef} />
      <Dialog open>
        <DialogContent
          className="sm:max-w-md"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Crea tu restaurante</DialogTitle>
            <DialogDescription>
              Para comenzar, configura tu primer restaurante.
            </DialogDescription>
          </DialogHeader>

          <div
            className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2"
            aria-label={`Paso ${step} de 3`}
          >
            {[1, 2, 3].map((number) => (
              <React.Fragment key={number}>
                {number > 1 && (
                  <div
                    className={cn(
                      "h-0.5",
                      step >= number ? "bg-primary" : "bg-zinc-300",
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs",
                    step >= number && "bg-primary text-primary-foreground",
                    step === number && "ring-1 ring-primary ring-offset-1",
                  )}
                >
                  {step > number ? <Check className="size-3.5" /> : number}
                </div>
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
            {step === 1 && (
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Nombre del restaurante</Label>
                <Input
                  id="restaurant-name"
                  placeholder="Ej. Los Chilaquiles"
                  autoComplete="organization"
                  autoFocus
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <Label htmlFor="restaurant-discovery-source">
                  ¿Cómo conociste Lennsi?
                </Label>
                <Controller
                  name="discovery_source"
                  control={control}
                  render={({ field }) => (
                    <Select
                      items={discoverySourceOptions}
                      value={field.value ?? null}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="restaurant-discovery-source"
                        className="w-full"
                        aria-invalid={Boolean(errors.discovery_source)}
                      >
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {discoverySourceOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.discovery_source && (
                  <p className="text-sm text-destructive">
                    {errors.discovery_source.message}
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2 py-5 text-center">
                <p className="text-2xl font-semibold">¡Todo listo!</p>
                <span className="text-muted-foreground">
                  Empieza a controlar tu negocio con Lennsi
                </span>
              </div>
            )}

            {errors.root && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}

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
                {step === 3 ? (
                  isSubmitting ? (
                    <>
                      <Spinner />
                      Creando
                    </>
                  ) : (
                    "Crear restaurante"
                  )
                ) : (
                  "Siguiente"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
