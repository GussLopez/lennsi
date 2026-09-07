'use client'

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";

const SEPARATION = 24;
const APPROACH_SPEED = 1.5;

type NfcScanProps = {
  phone: RefObject<HTMLDivElement | null>;
  scanning: boolean;
  onScanningChange: (scanning: boolean) => void;
};

export default function NfcScan({ phone, scanning, onScanningChange }: NfcScanProps) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const arrivalScroll = useMotionValue(1);
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const [pastTitle, setPastTitle] = useState(false);
  const progress = useTransform(() =>
    Math.min(1, Math.max(0, scrollY.get() / arrivalScroll.get()))
  );
  const y = useTransform(() =>
    distance.get() * (reducedMotion ? 1 : progress.get())
  );
  const opacity = useTransform(progress, [1, 1], [0, 1]);

  useEffect(() => {
    const anchor = ref.current;
    const target = phone.current;
    if (!anchor || !target) return;

    const updateScanning = () => {
      onScanningChange(scrollY.get() >= arrivalScroll.get());
    };
    const measure = () => {
      distance.set(Math.max(0,
        target.getBoundingClientRect().top -
        anchor.getBoundingClientRect().bottom - SEPARATION
      ));
      arrivalScroll.set(Math.max(1, distance.get() / APPROACH_SPEED));
      updateScanning();
    };
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    observer.observe(anchor);
    if (anchor.offsetParent instanceof HTMLElement) {
      observer.observe(anchor.offsetParent);
    }
    window.addEventListener("resize", measure);
    const unsubscribe = scrollY.on("change", updateScanning);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      unsubscribe();
    };
  }, [phone, distance, arrivalScroll, scrollY, onScanningChange]);

  useEffect(() => {
    const anchor = ref.current;
    const title = document.getElementById("hero-title");
    if (!anchor || !title) return;

    const update = () => {
      const scanTop = anchor.getBoundingClientRect().top + y.get();
      const titleBottom = title.getBoundingClientRect().bottom;

      setPastTitle(scanTop >= titleBottom);
    }

    const unsubscribeY = y.on("change", update);
    const unsubscribeScroll = scrollY.on("change", update);
    const observer = new ResizeObserver(update);

    observer.observe(title);
    observer.observe(anchor);
    window.addEventListener("resize", update);

    return () => {
      unsubscribeY();
      unsubscribeScroll();
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [y, scrollY]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute top-24 right-1/2 translate-x-1/2"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: .6, type: "spring" }}
        style={{ y, opacity }}
      >
        <motion.div
          className={cn("origin-bottom rounded-full border p-3",
            pastTitle 
              ? "bg-white border-input shadow-lg"
              : "bg-transparent border-transparent shadow-none"
          )}
          animate={scanning && !reducedMotion
            ? { scale: [1, 1.12, 1] }
            : { scale: 1 }}
          transition={scanning && !reducedMotion
            ? { duration: 2, repeat: Infinity }
            : { duration: 0.2 }}
        >
          <img
            src="/img/lennsi.svg"
            alt="Lennsi Logo"
            className="size-10"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
