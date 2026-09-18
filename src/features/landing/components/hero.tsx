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
            <h1
              id="hero-title"
              className="text-4xl text-[40px] md:text-6xl lg:text-[80px] lg:tracking-tighter font-semibold text-charcoal"
            >
              La experiencia de tu restaurante{" "}
              <DiaTextReveal
                text="también es digital."
                colors={["#A97CF8", "#F38CB8", "#FDCC92"]}
              />
            </h1>
          </div>

          <div className="flex items-center gap-5 mt-10 mb-10 lg:mb-0">
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
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6 shrink-0"
              >
                <g className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none">
                  <path
                    d="M5 12h8"
                    className="origin-[15px_12px] scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                  />
                  <path
                    d="m9 6 6 6-6 6"
                    className="origin-[15px_12px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-[0.833333] group-focus-visible:scale-y-[0.33333] motion-reduce:transition-none"
                  />
                </g>
              </svg>
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
