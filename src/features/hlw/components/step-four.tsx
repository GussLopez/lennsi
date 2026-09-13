import { NumberTicker } from "@/components/animate/number-ticker";
import {
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  MousePointer2,
  Utensils,
} from "lucide-react";
import * as motion from 'motion/react-client'

const activity = [
  { day: "L", value: 36 },
  { day: "M", value: 58 },
  { day: "M", value: 44 },
  { day: "J", value: 72 },
  { day: "V", value: 60 },
  { day: "S", value: 84 },
  { day: "D", value: 100 },
];

export default function StepFour() {
  return (
    <div
      role="img"
      aria-label="Ejemplo ilustrativo con datos de muestra: un panel de interacciones semanales y los enlaces más utilizados, filtrados por sucursal."
      className="relative flex min-h-120 w-full flex-col overflow-hidden rounded-[24px] bg-sand p-5 text-charcoal sm:p-7"
    >
      <div
        aria-hidden="true"
        className="relative flex flex-1 flex-col items-center justify-center py-6"
      >
        <div
          data-part="analytics-card"
          className="w-full max-w-96 rounded-[24px] bg-white/60 p-2 shadow-xl shadow-charcoal/10"
        >
          <div className="rounded-[18px] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Así conecta tu espacio</p>
              <ChartNoAxesColumnIncreasing className="size-4 shrink-0 text-primary" />
            </div>
            <div
              data-part="filters"
              className="mt-3 flex flex-wrap gap-2 text-[9px] text-neutral-500"
            >
              <span className="flex items-center gap-2 rounded-full bg-neutral-100 px-2.5 py-1.5">
                Sucursal Centro
                <ChevronDown className="size-3" />
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1.5">
                Últimos 7 días
              </span>
            </div>
            <div
              data-part="total"
              className="mt-5 flex items-end justify-between"
            >
              <div>
                <p className="text-[10px] text-neutral-500">
                  Interacciones totales
                </p>
                <NumberTicker value={1284} className="block mt-1 text-4xl font-semibold tracking-tighter" />
              </div>
              <MousePointer2 className="mb-1 size-5 text-neutral-300" />
            </div>
            <div data-part="chart" className="mt-5 grid grid-cols-7 gap-3">
              {activity.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="flex h-22 w-full items-end border-b border-neutral-100">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${item.value}%` }}
                      transition={{ duration: .5, type: "spring", delay: .1 * index }}
                      viewport={{ once: true }}
                      data-part={`bar-${index}`}
                      className={`w-full origin-bottom rounded-t-md ${index === 6 ? "bg-primary" : "bg-primary/15"}`}
                    />
                  </div>
                  <span className="text-[9px] text-neutral-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
            <div data-part="popular-links" className="mt-5 space-y-2.5">
              {[
                { label: "Menú", value: 64 },
                { label: "Promociones", value: 24 },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 text-[10px]"
                >
                  <span className="w-18 text-neutral-500">{item.label}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-neutral-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      transition={{ duration: .5, type: "spring", delay: .2 * i }}
                      viewport={{ once: true }}
                      data-part="link-bar"
                      className="h-full origin-left rounded-full bg-charcoal"
                    />
                  </div>
                  <span>
                    <NumberTicker value={item.value} />
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .5, type: "spring", delay: .2 }}
          viewport={{ once: true }}
          data-part="insight-card"
          className="z-10 -mt-2 flex w-[85%] max-w-80 items-center gap-3 rounded-2xl bg-charcoal p-3 text-white shadow-xl shadow-charcoal/15"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Utensils className="size-4" />
          </span>
          <div>
            <p className="text-[10px] font-medium">
              Tu menú despierta más interés
            </p>
            <p className="mt-0.5 text-[9px] text-white/55">
              El enlace más utilizado esta semana
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
