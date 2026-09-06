'use client'

import { Nfc } from 'lucide-react'
import { motion } from 'motion/react'

export default function PhoneDemo() {

  return (
    <div className="w-full h-150 rounded-[40px] relative bg-charcoal [clip-path:inset(-4rem_0_0_0)]">

      <motion.div
        className="absolute -top-16 right-1/2 translate-x-1/2"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6, type: "spring" }}
      >
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-x-[3%] inset-y-[1.5%] rounded-[60px] bg-white"
          />
          <img
            src="/img/hero/phone.avif"
            alt="Mock del celular"
            className="relative max-w-110"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0, y: -20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: .5, type: "spring", delay: 2 }}
            className='w-full max-w-92 absolute top-20 right-1/2 translate-x-1/2'
          >
            <img
              src="/img/hero/notification.svg"
              alt="Notificacion"
              className='w-full'
            />
          </motion.div>
          <div className="absolute top-3 right-1/2 translate-x-1/2">
            <img
              src="/img/hero/phone-status.svg"
              alt="Estatus del celular"
              className="min-w-100"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
