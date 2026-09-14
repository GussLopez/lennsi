import {
  Check,
  ChevronRight,
  Coffee,
  GripVertical,
  Link2,
  MessageCircle,
  Palette,
  Tag,
  Utensils,
} from "lucide-react";
import * as motion from 'motion/react-client'

const links = [
  {
    icon: Utensils,
    label: "Nuestro menú",
    detail: "Encuentra tu próximo favorito",
    selected: true,
  },
  {
    icon: Tag,
    label: "Promociones",
    detail: "Algo especial para hoy",
    selected: false,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    detail: "Sigamos en contacto",
    selected: false,
  },
];

export default function StepTwo() {
  return (
    <div
      role="img"
      aria-label="Ejemplo ilustrativo de una página de restaurante con enlaces al menú, promociones y WhatsApp, y opciones de personalización."
      className="relative flex min-h-120 w-full flex-col overflow-hidden rounded-[24px] bg-charcoal p-5 text-white sm:p-7"
    >
      <div
        aria-hidden="true"
        className="relative flex flex-1 flex-col items-center justify-center py-6"
      >
        <div
          data-part="content-card"
          className="z-10 w-full max-w-92 rounded-[24px] bg-white/15 p-2 shadow-2xl"
        >
          <div className="rounded-[18px] bg-white p-5 text-charcoal sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sand/70">
                <Coffee className="size-6" />
              </div>
              <div>
                <p className="font-semibold">Casa · Café</p>
                <p className="mt-1 text-[10px] text-neutral-500">
                  Un buen momento empieza aquí
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {links.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: .3, type: "spring", delay: .2 * i }}
                  viewport={{ once: true }}
                  key={link.label}
                  data-part="content-link"
                  className={`flex items-center gap-3 rounded-xl p-3 ${link.selected ? "bg-charcoal text-white" : "bg-neutral-50"}`}
                >
                  <GripVertical className="size-3 shrink-0 opacity-35" />
                  <link.icon className="size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{link.label}</p>
                    <p
                      className={`mt-0.5 text-[10px] ${link.selected ? "text-white/65" : "text-neutral-500"}`}
                    >
                      {link.detail}
                    </p>
                  </div>
                  <ChevronRight className="size-3 shrink-0" />
                </motion.div>
              ))}
            </div>
            <div
              data-part="add-link"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 p-3 text-[10px] text-neutral-500"
            >
              <Link2 className="size-3" />
              Tu próximo enlace va aquí
            </div>
          </div>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: .3, type: "spring", delay: .3 }}
          viewport={{ once: true }}
          data-part="appearance-card"
          className="z-20 -mt-4 flex w-[85%] max-w-76 items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3 text-charcoal shadow-xl"
        >
          <Palette className="size-4 shrink-0 text-neutral-400" />
          <span className="flex-1 text-[10px] font-medium">A tu estilo</span>
          <span className="flex size-5 items-center justify-center rounded-full bg-charcoal text-white">
            <Check className="size-3" />
          </span>
          <span className="size-5 rounded-full bg-primary" />
          <span className="size-5 rounded-full bg-sand" />
        </motion.div>
      </div>
    </div>
  );
}
