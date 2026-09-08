import { Star } from "lucide-react";
import AnalyticsBackground from "./analitics-background";

export default function Analytics() {
  return (
    <section className="bg-charcoal relative">
      <div
        aria-hidden={true}
        className="w-fit px-4 py-1 flex items-center gap-4 rounded-full border absolute top-[15%] right-[20%] border-input/10 text-sm text-white pointer-events-none">
        <p className="font-medium text-[13px]">Promedio de Reseñas</p>
        <span className="font-bold">89%</span>
        <div className="flex items-center gap-0.5">
          <Star className="relative size-3 rounded-full text-yellow-500 fill-yellow-500" />
          <Star className="relative size-3 rounded-full text-yellow-500 fill-yellow-500" />
          <Star className="relative size-3 rounded-full text-yellow-500 fill-yellow-500" />
          <Star className="relative size-3 rounded-full text-yellow-500 fill-yellow-500" />
          <Star className="relative size-3 rounded-full text-yellow-500" />
        </div>
      </div>
      <div
        aria-hidden={true}
        className="w-fit px-4 py-1 flex items-center gap-4 rounded-full border absolute top-[20%] right-[16%] border-input/10 text-sm text-white pointer-events-none">
        <p className="font-medium text-[13px]">Promedio de Reseñas</p>
        <span className="font-bold">89%</span>
        <div className="flex items-center gap-0.5">
          <Star className="relative size-3 rounded-full text-yellow-500 fill-yellow-500" />
          <Star className="relative size-3 rounded-full text-yellow-500 fill-yellow-500" />
          <Star className="relative size-3 rounded-full text-yellow-500 fill-yellow-500" />
          <Star className="relative size-3 rounded-full text-yellow-500 fill-yellow-500" />
          <Star className="relative size-3 rounded-full text-yellow-500" />
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