import { ChevronRight } from "lucide-react";
import Link from "next/link";
import CtaButton from "./cta-button";
import { DiaTextReveal } from "@/components/animate/dia-text-reveal";
import PhoneDemo from "./phone-demo";

export default function Hero() {

  return (
    <div className="max-w-7xl mx-auto px-4 pt-25 lg:pt-42 relative">
      <div className="flex flex-col gap-16 sm:gap-50">
        <div className="flex flex-col items-center z-10 pb-5 bg-background">
          <div className="space-y-8 text-center max-w-7xl lg:px-12">
            <h1 className="text-5xl md:text-6xl lg:text-[80px] lg:tracking-tighter font-semibold text-charcoal">
              La experiencia de tu negocio{" "}
              <DiaTextReveal
                text="también es digital."
                colors={["#A97CF8", "#F38CB8", "#FDCC92"]}
              />
            </h1>
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

        <div>
          <PhoneDemo />
        </div>
      </div>
    </div>
  )
}
