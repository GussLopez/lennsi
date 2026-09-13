import { Check, ChevronDown, MapPin, Plus, Store } from "lucide-react";
import * as motion from 'motion/react-client'

export default function StepOne() {
  return (
    <div
      role="img"
      aria-label="Ejemplo ilustrativo de una sucursal con seis mesas y la Mesa 04 seleccionada como punto de contacto."
      className="relative flex min-h-120 w-full flex-col overflow-hidden rounded-[24px] bg-sand p-5 text-charcoal sm:p-7"
    >
      <div
        aria-hidden="true"
        className="relative flex flex-1 items-center justify-center py-6"
      >
        <div
          data-part="spaces-card"
          className="w-full max-w-96 rounded-[24px] bg-white/60 p-2 shadow-xl shadow-charcoal/10"
        >
          <div className="rounded-[18px] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sand/60">
                <Store className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Casa · Café</p>
                <p className="mt-0.5 text-[10px] text-neutral-500">
                  Tu restaurante, organizado
                </p>
              </div>
              <ChevronDown className="size-4 text-neutral-400" />
            </div>
            <div data-part="branch" className="mt-4 flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <p className="flex-1 text-xs font-semibold">Sucursal Centro</p>
              <Plus className="size-3 text-neutral-400" />
            </div>
            <div className="my-4 flex gap-2 text-[10px]">
              <span className="rounded-full bg-charcoal px-3 py-1.5 text-white">
                Terraza
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1.5">
                Interior
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1.5">
                Barra
              </span>
            </div>
            <div
              data-part="floor-plan"
              className="grid grid-cols-3 gap-x-4 gap-y-6 rounded-xl border border-dashed border-neutral-200 bg-sand/30 px-4 py-5"
            >
              {["01", "02", "03", "04", "05", "06"].map((table, i) => (
                <motion.div
                  key={table}
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: .3, type: "spring", delay: .1 * i }}
                  viewport={{ once: true }}
                  data-part={`table-${table}`}
                  className="relative py-1.5"
                >
                  <span
                    className={`absolute inset-x-4 top-0 h-1 rounded-full ${table === "04" ? "bg-primary/30" : "bg-neutral-200"}`}
                  />
                  <div
                    className={`flex h-12 items-center justify-center rounded-xl border text-[10px] ${table === "04" ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" : "border-neutral-200 bg-white text-neutral-500"}`}
                  >
                    Mesa {table}
                  </div>
                  <span
                    className={`absolute inset-x-4 bottom-0 h-1 rounded-full ${table === "04" ? "bg-primary/30" : "bg-neutral-200"}`}
                  />
                </motion.div>
              ))}
            </div>
            <div
              data-part="location-badge"
              className="mt-4 flex items-center gap-2 text-[10px] text-neutral-500"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Check className="size-3" />
              </span>
              Cada punto de contacto tiene su lugar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
