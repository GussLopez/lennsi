import {
  ArrowUpRight,
  Check,
  Coffee,
  Nfc,
  Tag,
  Utensils,
  Wifi,
} from "lucide-react";
import * as motion from 'motion/react-client'

export default function StepThree() {
  return (
    <div
      role="img"
      aria-label="Ejemplo ilustrativo de una etiqueta NFC en la Mesa 04 junto a un teléfono que muestra el contenido del restaurante."
      className="relative flex min-h-120 w-full flex-col overflow-hidden rounded-[24px] bg-primary p-5 text-white sm:p-7"
    >
      <div
        aria-hidden="true"
        className="relative flex flex-1 items-center justify-center py-6"
      >
        <div className="relative isolate h-80 w-full max-w-92">
          <div
            data-part="signal-outer"
            className="absolute top-10 left-0 size-60 rounded-full border border-white/15"
          />
          <div
            data-part="signal-inner"
            className="absolute top-18 left-8 size-44 rounded-full border border-white/25"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, x: -10 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: .5, type: "spring" }}
            viewport={{ once: true }}
            data-part="nfc-tag"
            className="absolute top-22 left-0 z-20 flex h-40 w-[43%] rotate-[-10deg] flex-col items-center justify-center rounded-[20px] border border-white/30 bg-sand text-charcoal shadow-2xl shadow-charcoal/25"
          >
            <span className="text-[10px] font-semibold tracking-widest">
              LENNSI
            </span>
            <Nfc className="my-3 size-10 stroke-[1.5]" />
            <span className="text-xs font-semibold">Acerca tu teléfono</span>
            <span className="mt-1 text-[9px] text-neutral-500">
              Terraza · Mesa 04
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, x: 10 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: .5, type: "spring", delay: .2 }}
            viewport={{ once: true }}
            data-part="phone"
            className="absolute top-0 right-1 w-[56%] rotate-[8deg] rounded-[30px] border-4 border-charcoal bg-white p-2 text-charcoal shadow-2xl shadow-charcoal/30"
          >
            <div className="mx-auto mb-3 h-3 w-16 rounded-full bg-charcoal" />
            <div className="flex items-center justify-between px-2 text-[8px] text-neutral-400">
              <span>9:41</span>
              <Wifi className="size-3" />
            </div>
            <div className="flex flex-col items-center px-2 pt-4 pb-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-sand/70">
                <Coffee className="size-5" />
              </span>
              <p className="mt-2 text-sm font-semibold">Casa · Café</p>
              <p className="mt-1 text-[9px] text-neutral-500">
                Qué gusto tenerte aquí
              </p>
            </div>
            <div className="space-y-2 px-1 pb-4">
              <div
                data-part="phone-menu"
                className="flex items-center gap-2 rounded-xl bg-charcoal p-3 text-white"
              >
                <Utensils className="size-3 shrink-0" />
                <span className="flex-1 text-[10px]">Ver menú</span>
                <ArrowUpRight className="size-3" />
              </div>
              <div
                data-part="phone-promotion"
                className="flex items-center gap-2 rounded-xl bg-sand/60 p-3"
              >
                <Tag className="size-3 shrink-0" />
                <span className="flex-1 text-[10px]">Promociones</span>
                <ArrowUpRight className="size-3" />
              </div>
            </div>
            <div className="mx-auto mb-1 h-1 w-14 rounded-full bg-charcoal/15" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, x: 10 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: .5, type: "spring", delay: .4 }}
            viewport={{ once: true }}
            data-part="connection-badge"
            className="absolute right-3 bottom-0 z-30 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-charcoal shadow-lg"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Check className="size-3" />
            </span>
            <span className="text-[10px] font-medium">
              De la mesa a tu contenido
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
