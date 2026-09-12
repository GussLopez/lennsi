import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as motion from "motion/react-client";

const faqs = [
  {
    question: "¿Qué puedo compartir con Lennsi?",
    answer:
      "Puedes configurar enlaces a tu menú, promociones, redes sociales, WhatsApp, sitio web y página de reseñas de Google, además de enlaces personalizados.",
    value: "share",
  },
  {
    question: "¿Qué necesita mi cliente para usar una etiqueta NFC?",
    answer:
      "Un teléfono compatible con NFC y acceso a internet para abrir el contenido. La forma de leer la etiqueta puede variar según el dispositivo y su configuración.",
    value: "needs",
  },
  {
    question: "¿Puedo gestionar varias sucursales?",
    answer:
      "Lennsi permite organizar sucursales y sus respectivos puntos de contacto y etiquetas desde el panel.",
    value: "manage",
  },
  {
    question: "¿Qué es un punto de contacto?",
    answer:
      "Es el lugar de tu restaurante donde colocas una etiqueta: por ejemplo, una mesa, la barra, la terraza o la entrada. Identificarlo te ayuda a organizar tus etiquetas y consultar su actividad.",
    value: "touchpoint",
  },
  {
    question: "¿Puedo cambiar mis enlaces?",
    answer:
      "Puedes editar las acciones y sus destinos desde el panel para mantener tu contenido actualizado.",
    value: "links",
  },
  {
    question: "¿Qué puedo ver en la analítica?",
    answer:
      "Puedes consultar accesos, interacciones, clics hacia reseñas de Google y actividad por acción, sucursal y punto de contacto.",
    value: "analytics",
  },
];

export default function Faq() {
  return (
    <section
      id="preguntas-frecuentes"
      aria-labelledby="faq-title"
      className=" bg-sand/35 py-20 text-charcoal sm:py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="flex items-center gap-2 font-lora text-sm">
            <span aria-hidden="true" className="size-2 bg-primary" />
            Preguntas frecuentes
          </p>
          <h2
            id="faq-title"
            className="mt-5 max-w-md text-4xl font-medium tracking-tighter text-balance sm:text-5xl lg:text-6xl"
          >
            Todo claro, desde el primer toque.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-charcoal/65">
            Lo que necesitas saber para conectar tu restaurante con tus clientes
            a través de Lennsi.
          </p>
        </div>

        <Accordion
          defaultValue={["share"]}
          className="min-w-0 gap-2"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.value}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: .8, type: "spring", delay: .3 }}
              viewport={{ once: true }}
            >
              <AccordionItem
                value={faq.value}
                className="group/faq rounded-2xl border border-transparent px-4 transition-colors duration-200 not-last:border-b hover:bg-white/60 data-open:border-charcoal/10 data-open:bg-white motion-reduce:transition-none sm:px-6"
              >
                <AccordionTrigger className="items-center gap-4 rounded-xl py-6 text-base font-medium hover:no-underline focus-visible:ring-primary/40 motion-reduce:transition-none sm:gap-5 sm:text-lg cursor-pointer">
                  <span
                    aria-hidden="true"
                    className="w-5 shrink-0 font-mono text-xs text-charcoal/45 group-data-open/faq:text-primary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 group-data-open/faq:text-primary">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pr-2 pb-6 pl-9 text-sm leading-7 text-charcoal/70 sm:pr-8 sm:pl-10 sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
