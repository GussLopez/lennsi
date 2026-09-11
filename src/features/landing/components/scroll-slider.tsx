'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ScrollSliderCanvas } from "./scroll-slider-canvas";

export default function ScrollSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");

            if (index !== null) {
              setActiveIndex(Number(index))
            }
          }
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      }
    );

    blockRefs.current.forEach((block) => {
      if (block) observer.observe(block);
    })

    return () => observer.disconnect();
  }, [])
  return (
    <section className="max-w-7xl mx-auto px-4 flex gap-8 py-25">
      <div className="min-w-0 flex-1 lg:max-w-125 lg:pr-5 lg:pb-[35vh]">
        <div className="pb-24">
          <div className="mb-24 space-y-8">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-sm font-lora text-charcoal">
                <div className="w-2 h-2 bg-primary" />
                Una experiencia conectada
              </span>
              <h2 className="text-5xl font-medium tracking-tighter">
                Reúne los enlaces que tus clientes buscan durante su visita.
              </h2>
            </div>
            <Button
              variant={'outline'}
              size={'lg'}
              className='font-semibold'
            >
              See simulation sin action
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="space-y-16 lg:max-w-102 lg:space-y-[50vh]">
            <div className="space-y-4">
              <h3
                ref={(element) => {
                  blockRefs.current[0] = element;
                }}
                data-index={0}
                className="text-2xl font-semibold tracking-tight"
              >Tu contenido, organizado</h3>
              <p className="text-muted-foreground">
                Configura accesos a tu menú, promociones, WhatsApp, redes sociales y sitio web. Elige qué mostrar y cómo presentar cada enlace.
              </p>
              <div className="pt-4 lg:hidden">
                <ScrollSliderCanvas index={0} />
              </div>
            </div>
            <div className="space-y-4">
              <h3
                ref={(element) => {
                  blockRefs.current[1] = element;
                }}
                data-index={1}
                className="text-2xl font-semibold tracking-tight"
              >Cada espacio, identificado</h3>
              <p className="text-muted-foreground">
                Organiza tus puntos de contacto por mesa, barra, terraza o entrada. Asocia tus etiquetas al lugar donde tus clientes las utilizan.
              </p>
              <div className="pt-4 lg:hidden"><ScrollSliderCanvas index={1} /></div>
            </div>
            <div className="space-y-4">
              <h3
                ref={(element) => {
                  blockRefs.current[2] = element;
                }}
                data-index={2}
                className="text-2xl font-semibold tracking-tight"
              >Tus interacciones, visibles</h3>
              <p className="text-muted-foreground">
                Consulta la actividad por periodo, sucursal y punto de contacto para entender dónde y cómo se utiliza tu contenido.
              </p>
              <div className="pt-4 lg:hidden"><ScrollSliderCanvas index={2} /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden min-w-0 max-w-184.25 flex-1 lg:block">
        <div className="sticky top-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={activeIndex}>
              <ScrollSliderCanvas index={activeIndex} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
