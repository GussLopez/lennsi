'use client'

import { Ripple } from "@/components/animate/ripple";
import { motion } from "motion/react";
import Image from "next/image";

export default function AuthCanvas() {

  return (
    <div className='hidden lg:block p-6 xl:p-10'>
      <div className="relative isolate h-full min-h-150 overflow-hidden rounded-[60px] bg-charcoal">
        <div className="absolute inset-x-0 -bottom-10 flex justify-center">
          <div className="w-[min(75%,400px)] translate-y-[25%]">
            <motion.div
              initial={{ opacity: 0, scale: 1.05, filter: "blur(3px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: .7, type: "spring" }}
              whileHover={{ scale: 1.02 }}
              className="relative isolate"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-[3%] inset-y-[1.5%] z-0 rounded-[40px] bg-white"
              />

              <Image
                src="/img/mocks/phone.avif"
                alt="Plataforma Lennsi mostrada en un celular"
                width={1242}
                height={2820}
                sizes="400px"
                className="relative z-10 h-auto w-full object-contain"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[12%] z-20 aspect-square w-[83%] overflow-hidden"
              >
                <Ripple
                  mainCircleSize={70}
                  mainCircleOpacity={0.3}
                  numCircles={6}
                  circleGap={34}
                  className="text-primary"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid aspect-square w-[27%] place-items-center rounded-full bg-white p-[6%] shadow-lg shadow-primary/10 ring-1 ring-primary/10">
                    <Image
                      src="/img/lennsi.svg"
                      alt="Lennsi Logo"
                      width={265}
                      height={282}
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
