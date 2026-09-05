import { cn } from "@/lib/utils";
import Link from "next/link";

interface CtaButtonProps {
  className?: string;
  text: string;
  link: string;
}
export default function CtaButton({ className, text, link }: CtaButtonProps) {

  return (
    <Link
      href={link}
      className={cn("bg-primary hover:bg-dark-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 duration-250", className)}
    >
      {text}
    </Link>
  )
}
