import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import CtaButton from "./cta-button";
import { DiaTextReveal } from "@/components/animate/dia-text-reveal";

export default function Hero() {

  return (
    <div className="max-w-7xl mx-auto px-4 pt-25 lg:pt-42">
      <div className="max-w-180 space-y-8">
        <span className="flex items-center gap-3 font-lora">
          <div className="w-1 h-3 rounded-full bg-primary" />
          Conexiones digitales para restaurantes
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-[60px] lg:text-6xl font-semibold text-charcoal">
          Una mesa. Un toque.{" "}
          <DiaTextReveal
            text="Más formas de conectar."
            colors={["#A97CF8", "#F38CB8", "#FDCC92"]}
          />
        </h1>
        <p className="lg:text-xl text-muted-foreground">
          Acerca tu menú, tus promociones y tus redes sociales a cada mesa con etiquetas NFC. Gestiona tus enlaces desde Lennsi y descubre cómo interactúan tus clientes con tu restaurante.
        </p>
      </div>

      <div className="flex items-center gap-5 mt-10">
        <CtaButton
          link="/login"
          className="bg-primary hover:bg-charcoal cursor-pointer"
          text="Crear mi cuenta"
        />
        <Link
          href={'/how-lennsi-works'}
          className={'flex items-center gap-1 text-base font-bold text-charcoal transition-colors group'}
        >
          Cómo funciona
          <ChevronRight className="group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
