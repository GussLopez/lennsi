"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const PULSE_DURATION = 3;

export default function FooterCtaPulse() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const animate = isInView && !reducedMotion;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-[5%] top-[12%] aspect-square w-[83%] overflow-hidden text-primary"
    >
      <svg
        viewBox="0 0 320 320"
        fill="none"
        className="absolute inset-0 size-full"
      >
        {animate && (
          <>
            {[0, 1, 2].map((index) => (
              <motion.circle
                key={index}
                cx={160}
                cy={160}
                stroke="currentColor"
                strokeWidth={1}
                initial={{ r: 36, opacity: 0 }}
                animate={{ r: [36, 140], opacity: [0, 0.3, 0] }}
                transition={{
                  duration: PULSE_DURATION,
                  delay: index * (PULSE_DURATION / 3),
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}            
          </>
        )}
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          className="grid aspect-square w-[27%] place-items-center rounded-[25%] bg-white p-[6%] shadow-lg shadow-primary/10 ring-1 ring-primary/10"
          animate={{ scale: animate ? [1, 1.06, 1] : 1 }}
          transition={animate
            ? { duration: PULSE_DURATION, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0 }}
        >
          <Image
            src="/img/lennsi.svg"
            alt=""
            width={265}
            height={282}
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
