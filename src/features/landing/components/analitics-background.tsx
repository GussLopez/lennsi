'use client'

import { NumberTicker } from "@/components/animate/number-ticker";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical, MessageCircleMore, Nfc, Utensils } from "lucide-react";
import { motion, type Variants } from "motion/react";

export default function AnalyticsBackground() {
  const animateVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: .4,
        type: "spring",
        delay: .5
      }
    }
  }
  return (
    <>
      {/* Chart */}
      <motion.div
        aria-hidden={true}
        variants={animateVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-80 p-4 rounded-2xl space-y-4 border absolute top-[4%] left-[20%] border-input/10 pointer-events-none"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-white">
            <span className="text-[10px]">Sucursal:</span>
            <p className="text-xs font-medium">Sucursal Centro</p>
          </div>
          <div className="flex items-center gap-3 text-white">
            <div>
              <span className="text-[10px]">Clics al menú</span>
              <div className="flex items-center gap-0.5">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-red-500" />
              </div>
            </div>
            <span className="text-2xl tracking-tighter font-semibold">
              <NumberTicker
                value={55}
                delay={1}
              />
              %
            </span>
          </div>
        </div>
        <div className="p-2 space-y-3 border border-input/10 rounded-md">
          <p className="text-[11px] text-white">Menú: % del total de clics</p>
          <div className="min-h-30 grid grid-cols-2 gap-10 py-3 px-5 relative text-white">
            <Separator className="absolute top-4.5 z-10 w-full bg-input/10" />
            <Separator className="absolute bottom-7.5 z-10 w-full bg-input/10" />

            <div className="flex flex-col justify-end items-center gap-1 z-30">
              <motion.div
                initial={{ height: "0.5rem" }}
                whileInView={{ height: "4rem" }}
                transition={{
                  duration: 1.5,
                  type: "spring",
                  bounce: .15,
                  delay: 1
                }}
                viewport={{ once: true }}
                className="w-18 mx-auto overflow-hidden rounded-lg text-sm font-semibold bg-amber-500"
              >
                <div className="p-2">
                  <NumberTicker
                    value={40}
                    delay={1}
                    className="tracking-tighter"
                  />{"%"}
                </div>
              </motion.div>
              <span className="text-[9px] text-center">Mes anterior</span>
            </div>
            <div className="flex flex-col justify-end items-center gap-1 z-30">
              <motion.div
                initial={{ height: "0.5rem" }}
                whileInView={{ height: "5.5rem" }}
                transition={{
                  duration: 1.5,
                  type: "spring",
                  bounce: .15,
                  delay: 1
                }}
                viewport={{ once: true }}
                className="w-18 mx-auto overflow-hidden rounded-lg text-sm font-semibold bg-red-500"
              >
                <div className="p-2">
                  <NumberTicker
                    value={55}
                    delay={1}
                    className="tracking-tighter"
                  />{"%"}
                </div>
              </motion.div>
              <span className="text-[9px] text-center">Este mes</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Month Taps */}
      <motion.div
        variants={animateVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-55 p-4 rounded-2xl border absolute bottom-[30%] left-[10%] border-input/10 pointer-events-none"
      >
        <NumberTicker
          value={3582}
          className="text-2xl font-semibold tracking-tighter text-white"
        />
        <p className="text-sm font-medium text-muted/90">Accesos del mes</p>
      </motion.div>

      {/* Today Taps */}
      <motion.div
        variants={animateVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-55 p-4 rounded-2xl border absolute bottom-[15%] left-[15%] border-input/10 pointer-events-none"
      >
        <NumberTicker
          value={102}
          className="text-2xl font-semibold tracking-tighter text-white"
        />
        <p className="text-sm font-medium text-muted/90">Accesos de hoy</p>
      </motion.div>
      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: .8,
          type: "spring",
          delay: .6
        }}
        viewport={{ once: true }}
        className="w-full max-w-80 space-y-3 p-4 rounded-xl border absolute z-30 bottom-[10%] right-1/2 translate-x-1/2 border-input/10 bg-charcoal pointer-events-none"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <div className="w-7 h-7 flex justify-center font-medium items-center text-xs rounded-sm bg-primary">
              CT
            </div>
            <p className="text-[13px] font-medium">Café Tarti</p>
          </div>
          <div>
            <EllipsisVertical className="size-3 text-white/50" />
          </div>
        </div>
        <div className="w-full grid grid-cols-3 gap-3 p-2 rounded-md bg-input/10 text-white">
          <div>
            <span className="text-base font-medium">3</span>
            <div className="flex items-center gap-1 text-[10px]">
              <Utensils className="size-2.5 shrink-0 text-red-500" />
              <span>Sucursales</span>
            </div>
          </div>
          <div>
            <span className="text-base font-medium">4,238</span>
            <div className="flex items-center gap-1 text-[10px]">
              <MessageCircleMore className="size-2.5 shrink-0 text-red-500" />
              <span>Clics del mes</span>
            </div>
          </div>
          <div>
            <span className="text-base font-medium">24</span>
            <div className="flex items-center gap-1 text-[10px]">
              <Nfc className="size-2.5 shrink-0 text-red-500" />
              <span>Etiquetas NFC</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: .4, type: "spring", delay: .5 }}
        viewport={{ once: true }}
        className="w-full max-w-73 space-y-3 p-4 rounded-lg border absolute z-20 bottom-[9%] right-1/2 translate-x-1/2 border-input/10 bg-charcoal pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: .4, type: "spring", delay: .6 }}
        viewport={{ once: true }}
        className="w-full max-w-60 space-y-3 p-4 rounded-lg border absolute z-10 bottom-[8%] right-1/2 translate-x-1/2 border-input/10 pointer-events-none"
      />

      {/* Interactions */}
      <motion.div
        variants={animateVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        aria-hidden={true}
        className="w-full max-w-68 p-4 flex flex-col gap-5 rounded-2xl border absolute bottom-[24%] right-[10%] border-input/10 pointer-events-none"
      >
        <span className="text-sm font-medium text-muted/90">Clics por acción · Este mes</span>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] text-white">
              <span>Ver menú</span>
              <span>55%</span>
            </div>
            <div className="w-[55%] h-1 rounded-full bg-red-500" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] text-white">
              <span>Ir a reseñas de Google</span>
              <span>34%</span>
            </div>
            <div className="w-[34%] h-1 rounded-full bg-amber-500" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] text-white">
              <span>Redes sociales</span>
              <span>11%</span>
            </div>
            <div className="w-[11%] h-1 rounded-full bg-lime-500" />
          </div>
        </div>
      </motion.div>
    </>
  )
}
