import { Button } from "@/components/ui/button";
import Curve from "@/components/ui/curve";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 lg:pt-32">
      <div className="max-w-230 space-y-8">
        <span className="flex items-center gap-3 font-lora">
          <div className="w-1 h-3 rounded-full bg-primary"/>
          The Conversation Performance Platform
        </span>
        <h1 className="text-[68px] text-6xl font-semibold text-[#1e2229]">
          Where better conversations become better outcomes
        </h1>
        <p className="text-xl text-muted-foreground">
          Connect practice, coaching, and live performance so every interaction drives measurable improvement.
        </p>
      </div>

      <div className="flex items-center gap-5 mt-10">
        <Button
          className='rounded-[12px] h-11'
          size={'xl'}
          variant={'chunk'}
        >
          Schedule a demo
        </Button>
        <Link
          href={'/demo'}
          className="flex items-center gap-1.5 text-base font-bold text-[#1e2229] hover:text-[#1e2229]/80 transition-colors"
        >
          Take a tour
          <ChevronRight />
        </Link>
      </div>
    </div>
  )
}
