'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function ScrollSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    <section className="max-w-7xl mx-auto px-4 flex py-25">
      <div className="flex-1 max-w-125 pr-5">
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
          {/* <div className="h-[30vh] absolute top-[-50vh] right-0 bottom-16 left-0 bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_14%)] transition-opacity duration-1000 opacity-100 delay-800" /> */}

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
            </div>
          </div>
        </div>
      </div>
      <div className="hidden max-w-184.25 flex-1 lg:block relative">
        <motion.div
          className={cn("w-full h-100 p-5 sticky top-24 rounded-[18px] transition-colors duration-300",
            activeIndex === 0 && 'bg-charcoal',
            activeIndex === 1 && 'bg-primary',
            activeIndex === 2 && 'bg-muted',
          )}>
          {activeIndex === 0 &&
            <div>Vista de la primera característica</div>
          }
          {activeIndex === 1 &&
            <div>Vista de la segunda característica</div>
          }
          {activeIndex === 2 &&
            <div>Vista de la tercera característica</div>
          }
        </motion.div>
      </div>
    </section>
  )
}