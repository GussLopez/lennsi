'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, BookOpen, Star, Camera } from 'lucide-react'
import NfcScan from './nfc-scan';

function PhoneExperience({ reducedMotion }: { reducedMotion: boolean }) {
  const [phase, setPhase] = useState<'notification' | 'reading' | 'links'>('notification');

  useEffect(() => {
    if (phase !== 'reading') return;
    const timeout = window.setTimeout(() => setPhase('links'), 900);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  return (
    <AnimatePresence mode="wait">
      {phase !== 'links' ? (
        <motion.button
          key="notification"
          type="button"
          aria-label="Abrir enlaces de la demo NFC"
          initial={{
            opacity: 0,
            scale: reducedMotion ? 1 : 0,
            y: reducedMotion ? 0 : -20
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -20 }}
          transition={{
            duration: reducedMotion ? 0 : .5,
            delay: reducedMotion ? 0 : .35
          }}
          onAnimationComplete={() => {
            if (phase === 'notification') setPhase('reading');
          }}
          onClick={() => setPhase('links')}
          className="absolute top-20 right-1/2 w-[84%] max-w-92 translate-x-1/2 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <img
            src="/img/mocks/notification.svg"
            alt="Notificación NFC"
            className="w-full"
          />
        </motion.button>
      ) : (
        <motion.div
          key="links"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : .4 }}
          className="absolute inset-x-[6%] top-[9%] bottom-[3%] overflow-y-auto rounded-b-[40px] px-5 py-6 text-charcoal"
        >
          <div className="text-center">
            <div className="mx-auto mt-5 mb-3 flex size-14 items-center justify-center rounded-2xl bg-charcoal text-xl font-semibold text-white">L</div>
            <h3 className="text-xl font-semibold">La mesa de Lennsi</h3>
            <p className="mt-1 text-sm text-charcoal/60">Tu próxima experiencia empieza aquí.</p>
          </div>
          <ul className="mt-6 space-y-3" aria-label="Ejemplo de enlaces del restaurante">
            {[
              { label: 'Ver menú', icon: BookOpen },
              { label: 'Dejar una reseña', icon: Star },
              { label: 'Síguenos en Instagram', icon: Camera },
            ].map(({ label, icon: Icon }, i) => (
              <motion.li
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .3, type: "spring", delay: .2 * i }}
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-white px-4 py-4 text-sm font-medium"
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                <span className="flex-1">{label}</span>
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </motion.li>
            ))}
          </ul>
          <p className="mt-20 text-center text-[11px] text-charcoal/50">Powered by Lennsi</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PhoneDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const reducedMotion = useReducedMotion();
  return (
    <>
      <NfcScan
        phone={ref}
        scanning={scanning}
        onScanningChange={setScanning}
      />
      <div className="w-full h-150 rounded-[40px] relative bg-charcoal [clip-path:inset(-4rem_0_0_0)]">

        <div
          ref={ref}
          className="absolute -top-16 right-1/2 translate-x-1/2"
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: reducedMotion ? 0 : -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : .6, type: "spring" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-[3%] inset-y-[1.5%] rounded-[60px] bg-white"
            />
            <img
              src="/img/mocks/phone.avif"
              alt="Mock del celular"
              className="relative w-80 max-w-none md:w-90 lg:w-110"
            />
            {scanning && <PhoneExperience reducedMotion={!!reducedMotion} />}
            <div className="pointer-events-none absolute top-3 right-1/2 w-[91%] translate-x-1/2">
              <img
                src="/img/mocks/phone-status.svg"
                alt="Estatus del celular"
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
