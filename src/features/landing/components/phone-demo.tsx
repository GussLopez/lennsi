'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import NfcScan from './nfc-scan';

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
              className="relative md:w-90 lg:w-110"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -20 }}
              animate={scanning
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0, y: -20 }}
              transition={{
                duration: reducedMotion ? 0 : .5,
                type: "spring",
                delay: scanning && !reducedMotion ? .35 : 0,
              }}
              className='w-full max-w-92 absolute top-20 right-1/2 translate-x-1/2'
            >
              <img
                src="/img/mocks/notification.svg"
                alt="Notificacion"
                className='w-full'
              />
            </motion.div>
            <div className="absolute top-3 right-1/2 translate-x-1/2">
              <img
                src="/img/mocks/phone-status.svg"
                alt="Estatus del celular"
                className="min-w-100"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
