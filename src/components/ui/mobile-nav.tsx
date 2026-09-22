'use client'

import { Menu, X } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import CtaButton from "@/features/landing/components/cta-button";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const appLinks = [
    { text: 'Producto', link: '/' },
    { text: 'Como funciona', link: '/how-lennsi-works' },
    { text: 'Precios', link: '/pricing' },
  ]

  return (
    <>
      <Button
        variant={'outline'}
        size={'icon-lg'}
        className='flex lg:hidden'
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </Button>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .4, type: "spring" }}
            className="absolute h-[calc(100dvh-4rem)] inset-x-0 top-16 bg-background"
          >
            <div className="flex h-full flex-col">
              <nav className="min-h-0 flex-1 p-6 overflow-y-auto">
                <ul className="flex flex-col gap-3">
                  {appLinks.map((link, i) => (
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: .3, type: "spring", delay: 0.07 * i}}
                      key={i}
                      className="w-full py-3 text-[17px] font-medium border-b"
                    >
                      <Link href={link.link}>
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="flex items-center gap-2 shrink-0 py-4 px-6 border-t border-input">
                <CtaButton
                  link="/"
                  text="Acceder"
                  className="w-full text-center"
                />
                <CtaButton
                  link="/"
                  text="Como funciona"
                  className="w-full text-center border border-input text-foreground hover:bg-muted bg-background"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
