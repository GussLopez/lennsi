import { Check, Clock3, LayersArrowUp, Rocket } from "lucide-react";
import {
  formatPrice,
  plans,
  priceNote,
  pricingFaqs,
  pricingFeatures,
} from "../data/plans";
import PlanInterest from "./plan-interest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PricingContent() {
  return (
    <>
      <section
        id="precios"
        aria-labelledby="pricing-title"
        className="scroll-mt-24"
      >
        <div className="mx-auto max-w-3xl py-14 text-center sm:py-20">
          <h1
            id="pricing-title"
            className="mt-4 text-4xl font-semibold tracking-tighter text-balance sm:text-6xl"
          >
            Elige el plan para tu restaurante
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Conecta tu menú, Wi-Fi, reseñas y redes sociales en un solo lugar.
            Elige las estadísticas que necesitas para cada sucursal.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-charcoal/70">
            {priceNote}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.id}
              aria-labelledby={`plan-${plan.id}`}
              className={`flex min-w-0 flex-col rounded-[24px] border p-6 sm:p-8 ${plan.featured ? "border-primary/35 bg-sand/50" : "border-input bg-sand/20"}`}
            >
              <div className="flex min-h-7 flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {plan.featured ? (
                    <LayersArrowUp aria-hidden="true" className="size-5" />
                  ) : (
                    <Rocket aria-hidden="true" className="size-5" />
                  )}
                  <h2 id={`plan-${plan.id}`} className="text-xl font-semibold">
                    {plan.name}
                  </h2>
                </div>
                {plan.badge && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="mt-4 min-h-18 text-sm leading-6 text-muted-foreground">
                {plan.description}
              </p>
              <p className="mt-3 text-5xl font-semibold tracking-tighter">
                {formatPrice(plan.price)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                MXN / mes por sucursal
              </p>
              <div className="my-6 border-t border-charcoal/10" />
              <ul className="mb-8 flex flex-1 flex-col gap-4">
                {pricingFeatures
                  .filter((feature) => feature.values[plan.id].included)
                  .map((feature) => {
                    const value = feature.values[plan.id];
                    return (
                      <li
                        key={feature.id}
                        className="flex items-start gap-3 text-sm leading-6"
                      >
                        {value.pending ? (
                          <Clock3
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0 text-muted-foreground"
                          />
                        ) : (
                          <Check
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0 text-primary"
                          />
                        )}
                        <div>
                          {feature.label}
                          {value.text !== "Sí" && (
                            <span className="font-semibold">
                              {" "}
                              · {value.text}
                            </span>
                          )}
                          {value.pending && (
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {value.pending}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
              <div className="mt-auto space-y-3">
                <p className="text-xs leading-5 text-muted-foreground">
                  Dispositivos NFC y preparación por separado.
                </p>
                <PlanInterest planId={plan.id} />
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-muted-foreground">
          Un punto es una mesa o ubicación con varios botones, no un botón
          individual. Los planes incluyen puntos digitales activos; los
          dispositivos físicos se cotizan aparte.
        </p>
      </section>

      <section
        aria-labelledby="comparison-title"
        className="mx-auto mt-24 max-w-5xl"
      >
        <h2
          id="comparison-title"
          className="text-3xl font-semibold tracking-tighter sm:text-4xl"
        >
          Compara cada detalle.
        </h2>
        <p
          id="comparison-help"
          className="mt-3 text-sm leading-6 text-muted-foreground"
        >
          Las funciones pendientes están identificadas como próximamente. En
          pantallas pequeñas, desliza la tabla para ver ambos planes.
        </p>
        <div
          role="region"
          aria-labelledby="comparison-title"
          aria-describedby="comparison-help"
          tabIndex={0}
          className="mt-8 overflow-x-auto rounded-2xl border border-input focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <table className="w-full min-w-160 border-collapse text-left text-sm">
            <caption className="sr-only">
              Prestaciones, límites y disponibilidad de los planes Lennsi
            </caption>
            <thead className="bg-sand/60">
              <tr>
                <th scope="col" className="w-2/5 p-5 font-semibold">
                  Función
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className="w-[30%] p-5 font-semibold"
                  >
                    {plan.name}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      {formatPrice(plan.price)} MXN / mes por sucursal
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingFeatures.map((feature) => (
                <tr key={feature.id} className="border-t border-input">
                  <th
                    scope="row"
                    className="p-5 align-top font-medium leading-6"
                  >
                    {feature.label}
                  </th>
                  {plans.map((plan) => {
                    const value = feature.values[plan.id];
                    return (
                      <td
                        key={plan.id}
                        className={`p-5 align-top leading-6 ${plan.featured ? "bg-sand/20" : ""}`}
                      >
                        {value.text}
                        {value.pending && (
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            {value.pending}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="pricing-faq-title"
        className="mx-auto mt-24 max-w-5xl"
      >
        <h2
          id="pricing-faq-title"
          className="text-3xl font-semibold tracking-tighter sm:text-4xl"
        >
          Tus dudas, antes de elegir.
        </h2>
        <div className="mt-8 divide-y divide-input">
          <Accordion>
            {pricingFaqs.map((faq) => (
              <AccordionItem key={faq.question}>
                <AccordionTrigger className='hover:no-underline cursor-pointer'>
                  <div className="rounded-lg pr-4 text-base font-medium">
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent>

                  <p className="max-w-3xl pb-5 text-sm leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}