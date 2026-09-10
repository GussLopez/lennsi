'use client'

import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Coffee,
  GripVertical,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Nfc,
  Tag,
  Utensils,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { NumberTicker } from "@/components/animate/number-ticker";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const scenes = [
  {
    label: "Tu contenido",
    caption: "Todo lo que buscan. En un solo lugar.",
    background: "bg-charcoal text-white",
  },
  {
    label: "Tus espacios",
    caption: "Una etiqueta. Un lugar. Tu experiencia.",
    background: "bg-primary text-white",
  },
  {
    label: "Tu actividad",
    caption: "Entiende qué conecta con tus clientes.",
    background: "bg-[#eeeae4] text-charcoal",
  },
];

const lennsiLinks = [
  {
    icon: Utensils,
    label: "Nuestro menú",
    detail: "Encuentra tu próximo favorito",
    selected: true,
  }, {
    icon: Tag,
    label: "Promociones",
    detail: "Algo especial para hoy",
    selected: false,
  }, {
    icon: MessageCircle,
    label: "Hablemos por WhatsApp",
    detail: "Estamos cerca de ti",
    selected: false,
  },
]

const menuPromotions = [
  {
    label: "Menú",
    value: "64",
    width: "64%",
  }, {
    label: "Promociones",
    value: "24",
    width: "24%",
  },
]
function ContentPreview() {
  return (
    <div className="w-full max-w-92 rounded-[24px] bg-white/15 p-2 shadow-2xl">
      <div className="rounded-[18px] bg-white p-5 text-charcoal sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f3ede4]">
            <Coffee className="size-6" />
          </div>
          <div>
            <p className="font-semibold">Casa - Café</p>
            <p className="text-xs text-neutral-500">Un buen momento empieza aquí</p>
          </div>
        </div>
        <div className="space-y-2">
          {lennsiLinks.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 20, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: .3, type: "spring", delay: .1 * (i + 1) }}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3",
                link.selected ? "bg-charcoal text-white" : "bg-neutral-50",
              )}
            >
              <GripVertical className="size-3 shrink-0 opacity-35" />
              <link.icon className="size-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">{link.label}</p>
                <p
                  className={cn("mt-0.5 text-[10px]", link.selected ? "text-white/65" : "text-neutral-500")}
                >
                  {link.detail}
                </p>
              </div>
              <ChevronRight className="size-3 shrink-0" />
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-neutral-500">
          <Check className="size-3 text-emerald-700" />
          Listo para compartir con tus clientes
        </div>
      </div>
    </div>
  );
}

function SpacesPreview() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full max-w-96 rounded-[24px] bg-white/25 p-2 shadow-2xl">
      <div className="rounded-[18px] p-5 text-charcoal sm:p-6 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase text-neutral-500">Tus puntos de contacto</p>
            <p className="mt-1 font-semibold">Sucursal Centro</p>
          </div>
          <MapPin className="size-5 text-primary" />
        </div>
        <div className="my-3 flex gap-2 text-[10px]">
          <span className="px-3 py-1.5 rounded-full bg-charcoal text-white">Terraza</span>
          <span className="px-3 py-1.5 rounded-full bg-neutral-100">Interior</span>
          <span className="px-3 py-1.5 rounded-full bg-neutral-100">Barra</span>
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-[#f8f6f3] p-4">
          {["01", "02", "03", "04", "05", "06"].map((table, i) => (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .4, type: "spring", delay: .1 * (i + 2) }}
              key={table}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 rounded-xl border text-[10px]",
                table === "04" ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" : "border-neutral-200 bg-white text-neutral-500",
              )}>
              {table === "04"
                ? <Nfc className="size-4" />
                : <span className="h-1 w-5 rounded-full bg-neutral-200" />
              }
              Mesa {table}
            </motion.div>
          ))}
        </div>
        <div
          className="mt-4 flex items-center gap-3 rounded-xl border border-neutral-100 p-3">
          <div
            className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-primary">
            <Nfc className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">{isLoading ? 'Vinculando etiqueta' : 'Etiqueta vinculada'}</p>
            <p className="text-[10px] text-neutral-500">Terraza · Mesa 04</p>
          </div>
          <div className="flex size-5 shrink-0 items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {isLoading ? (
                <motion.span
                  key="loading"
                  className="flex items-center justify-center text-neutral-400"
                  exit={{ opacity: 0, scale: .7 }}
                  transition={{ duration: .15, type: "spring" }}
                >
                  <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
                </motion.span>
              ) : (
                <motion.span
                  key="success"
                  className="flex size-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
                  initial={{ opacity: 0, scale: .5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15
                  }}
                >
                  <Check className="size-3" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityPreview() {
  return (
    <div
      className="w-full max-w-96 rounded-[24px] bg-white/60 p-2 shadow-xl shadow-charcoal/10">
      <div className="rounded-[18px] bg-white p-5 text-charcoal sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Actividad de tu espacio</p>
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px]">Últimos 7 días</span>
        </div>
        <p className="mt-5 text-[10px] text-neutral-500">Interacciones totales</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-4xl font-semibold tracking-tighter">
            <NumberTicker value={1284} />
          </span>
          <span className="flex items-center text-[10px] font-medium text-emerald-700">
            <ArrowUpRight className="size-3" />
            <NumberTicker value={18.6} decimalPlaces={1} />%
          </span>
        </div>
        <div className="mt-5 flex h-24 items-end gap-3 border-b border-neutral-100 px-1">
          {[36, 58, 44, 72, 60, 84, 100].map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: .3, delay: .1 * index }}
              className={cn("flex-1 rounded-t-md", index === 6 ? "bg-primary" : "bg-red-100")}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-around text-[9px] text-neutral-400">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
            <span key={index}>
              {day}
            </span>
          ))}
        </div>
        <div className="mt-5 space-y-2">
          {menuPromotions.map((item, i) => (
            <div key={item.label} className="flex items-center gap-3 text-[10px]">
              <span className="w-18 text-neutral-500">
                {item.label}
              </span>
              <div className="h-1.5 flex-1 rounded-full bg-neutral-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: item.width }}
                  transition={{ duration: .8, type: "spring", delay: 0.3 * (i + 1) }}
                  className="h-full rounded-full bg-charcoal"
                />
              </div>
              <span>
                <NumberTicker value={Number(item.value)} />%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScrollSliderCanvas({ index }: { index: number }) {
  const scene = scenes[index] ?? scenes[0];

  return (
    <div
      role="img"
      aria-label={`Ejemplo ilustrativo: ${scene.label}. ${scene.caption}`}
      className={cn(
        "relative flex min-h-112 w-full flex-col overflow-hidden rounded-[22px] p-5 sm:min-h-125 sm:p-7",
        scene.background,
      )}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: .6, type: "spring", bounce: .15 }}
        aria-hidden="true"
        className="relative flex flex-1 items-center justify-center py-6">
        {index === 0 ? <ContentPreview /> : index === 1 ? <SpacesPreview /> : <ActivityPreview />}
      </motion.div>
      <div aria-hidden="true" className="flex items-center justify-between gap-3">
        <p className="text-xs opacity-80">
          {scene.caption}
        </p>
        <div className="flex gap-1.5">
          {scenes.map((item, step) => <span
            key={item.label}
            className={cn("h-1 rounded-full bg-current", index === step ? "w-5" : "w-1 opacity-25")} />)}
        </div>
      </div>
    </div>
  );
}
