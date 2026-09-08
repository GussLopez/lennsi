import { Star, Utensils } from "lucide-react";
import AnalyticsBackground from "./analitics-background";

export default function Analytics() {
  return (
    <section className="bg-charcoal relative">
      <div
        aria-hidden={true}
        className="w-fit px-4 py-1 flex items-center gap-4 rounded-full border absolute top-[15%] right-[18%] border-input/10 text-sm text-white pointer-events-none">
        <p className="font-medium text-[13px]">Clics a reseñas de Google</p>
        <span className="font-bold">34%</span>
        <div className="flex items-center gap-0.5">
          <Star className="relative size-3 text-yellow-500" />
        </div>
      </div>
      <div
        aria-hidden={true}
        className="w-fit px-4 py-1 flex items-center gap-4 rounded-full border absolute top-[21%] right-[16%] border-input/10 text-sm text-white pointer-events-none">
        <p className="font-medium text-[13px]">Clics al menú</p>
        <span className="font-bold">55%</span>
        <div className="flex items-center gap-0.5">
          <Utensils className="relative size-3 text-yellow-500" />
        </div>
      </div>
      <div className="max-w-7xl min-h-screen mx-auto px-4 flex justify-center items-center">
        <div className="max-w-2xl">
          <h2 className="text-6xl text-center font-bold tracking-tight text-white">
            Descubre qué despierta el interés de tus clientes.
          </h2>
        </div>
      </div>
      <AnalyticsBackground />
    </section>
  )
}
