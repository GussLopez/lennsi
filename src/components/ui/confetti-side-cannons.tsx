"use client"

import confetti from "canvas-confetti"
import { forwardRef, useImperativeHandle } from "react"

export type ConfettiSideCannonsRef = {
  fire: () => Promise<void>
}

export const ConfettiSideCannons = forwardRef<ConfettiSideCannonsRef>(
  function ConfettiSideCannons(_, ref) {
    useImperativeHandle(ref, () => ({
      fire() {
        return new Promise<void>((resolve) => {
          const end = Date.now() + 2_000
          const colors = [
            "#FF3B30",
            "#FF9500", 
            "#FFCC00", 
            "#34C759", 
            "#00C7BE", 
            "#007AFF", 
            "#5856D6", 
            "#AF52DE", 
            "#FF2D55", 
          ]

          function frame() {
            if (Date.now() > end) {
              resolve()
              return
            }

            confetti({
              particleCount: 2,
              angle: 60,
              spread: 55,
              startVelocity: 60,
              origin: { x: 0, y: 0.5 },
              colors,
              zIndex: 9999,
            })

            confetti({
              particleCount: 2,
              angle: 120,
              spread: 55,
              startVelocity: 60,
              origin: { x: 1, y: 0.5 },
              colors,
              zIndex: 9999,
            })

            requestAnimationFrame(frame)
          }

          frame()
        })
      },
    }))

    return null
  },
)