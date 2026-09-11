import Image from "next/image";
import CtaButton from "./cta-button";
import * as motion from 'motion/react-client'

export default function FooterCta() {

  return (
    <section className="w-full h-200 lg:h-130 relative z-20 rounded-t-[60px] bg-charcoal">
      <div className="min-h-130 max-w-7xl grid lg:grid-cols-2 items-center gap-10 mx-auto px-6 pb-32 lg:px-8 lg:pb-40 pt-16  relative z-10">
        <div className="max-w-xl">
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-balance text-white">
            Todo lo que tu restaurante necesita, en un solo toque.
          </h2>
          <div className="mt-8 flex gap-3">
            <CtaButton
              link="/register"
              text="Comenzar ahora"
              className="bg-white text-charcoal hover:bg-white/90"
            />

            <CtaButton
              link="/how-lennsi-works"
              text="Ver cómo funciona"
              className="bg-white/5 text-white hover:bg-white/15"
            />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, type: "spring" }}

          className="relative h-full block"
        >
          <Image
            src="/img/mocks/cta-mockup.webp"
            alt="Plataforma Lennsi mostrada en un celular"
            width={650}
            height={900}
            className="absolute left-1/2 top-1/2 w-80 lg:w-100 max-w-none -translate-x-1/2 lg:translate-y-[-33%] rotate-[5deg] object-contain"
          />
        </motion.div>
      </div>
    </section>
  )
}
