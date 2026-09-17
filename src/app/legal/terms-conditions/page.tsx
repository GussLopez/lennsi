import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Lennsi",
  description:
    "Condiciones de uso de Lennsi: cuentas, servicio digital, etiquetas NFC, planes, contenido y responsabilidades.",
  robots: { index: false, follow: true },
};

const sections = [
  {
    id: "objeto",
    title: "Objeto y alcance",
    paragraphs: [
      "Estos Términos y Condiciones describen las reglas de acceso, contratación y uso de Lennsi, una plataforma web que permite a restaurantes y otros establecimientos organizar sucursales, puntos de contacto, etiquetas NFC, contenido digital y estadísticas de interacción.",
      "El titular es la persona física o jurídica que contrata el servicio; los usuarios autorizados son quienes administran la cuenta en su nombre; y los visitantes son quienes consultan los contenidos compartidos por un establecimiento. Las obligaciones de pago corresponden a quien contrata, no a los visitantes.",
      "El servicio digital y la venta, personalización o preparación de dispositivos físicos son prestaciones distintas. Las condiciones particulares deberán identificar lo que incluye cada una, sin limitar derechos que la legislación aplicable reconozca de forma obligatoria.",
    ],
  },
  {
    id: "prestador",
    title: "Identificación del prestador",
    paragraphs: [
      "Lennsi es el nombre del servicio al que se refiere este documento. La identificación completa de la persona física o jurídica que lo presta, su domicilio comercial, país de establecimiento y correo de atención deberán incorporarse a la versión definitiva antes de utilizarla para contratar.",
      "El nombre del servicio no sustituye los datos legales del prestador. Esta versión es un borrador y no acredita por sí misma una razón social, un domicilio ni una jurisdicción determinada.",
    ],
  },
  {
    id: "aceptacion",
    title: "Aceptación y capacidad para contratar",
    paragraphs: [
      "La versión definitiva deberá estar disponible antes de completar el registro o la contratación y aceptarse mediante el mecanismo habilitado para ello. Consultar este borrador no constituye una suscripción, una autorización de cobro ni la aceptación de condiciones comerciales pendientes.",
      "Para contratar es necesario tener la mayoría de edad y capacidad legal suficiente conforme a la legislación aplicable. Quien actúe en representación de un establecimiento declara contar con facultades para obligarlo y administrar su contenido.",
      "Si no estás de acuerdo con las condiciones presentadas al contratar, no completes la contratación. Puedes conservar una copia de la versión que aceptes y de las condiciones particulares de tu plan.",
    ],
  },
  {
    id: "cuentas",
    title: "Registro, cuenta y seguridad",
    paragraphs: [
      "El titular debe proporcionar información veraz, mantener actualizados sus datos de contacto y comprobar que dispone de autorización para gestionar los establecimientos, marcas y recursos vinculados a su cuenta.",
      "Cada usuario debe proteger sus credenciales, evitar compartir contraseñas y cerrar su sesión en dispositivos compartidos. El titular debe retirar los accesos de quienes dejen de estar autorizados y comunicar sin demora razonable cualquier sospecha de acceso indebido por el canal oficial de atención.",
      "Las actuaciones de usuarios autorizados dentro de sus facultades se atribuyen al titular. El uso fraudulento de una cuenta deberá investigarse atendiendo a las circunstancias; esta cláusula no traslada al titular la responsabilidad por fallos de seguridad imputables a Lennsi.",
    ],
  },
  {
    id: "servicio",
    title: "Funciones y alcance del servicio digital",
    paragraphs: [
      "Según la disponibilidad y el plan contratado, Lennsi permite gestionar restaurantes y sucursales; identificar puntos de contacto, como mesas o barras; asociar etiquetas; configurar enlaces a menús, promociones, redes sociales, WhatsApp, reseñas y otros destinos; y consultar estadísticas de actividad.",
      "Un punto de contacto es una ubicación digital identificada y puede contener varias acciones o botones. El número de puntos incluidos en un plan no equivale al número de dispositivos físicos suministrados.",
      "Las funciones marcadas como próximas o en desarrollo no son prestaciones disponibles. Su alcance y fecha de incorporación deberán confirmarse expresamente. La contratación debe valorarse con base en las funciones disponibles y las obligaciones expresamente asumidas en la oferta.",
      "Lennsi facilita el acceso al contenido del establecimiento. Salvo acuerdo expreso, no participa como vendedor en las compras, reservas, pedidos u otras operaciones que los visitantes realicen con el establecimiento o con terceros.",
    ],
  },
  {
    id: "dispositivos",
    title: "Etiquetas NFC y dispositivos físicos",
    paragraphs: [
      "La lectura de una etiqueta requiere un dispositivo compatible, una configuración adecuada y acceso a internet para cargar el contenido. Su funcionamiento puede variar según el teléfono, el sistema operativo, la superficie de instalación, el estado de la etiqueta y la conectividad.",
      "El titular debe comprobar el enlace grabado, la asociación con el punto de contacto y el funcionamiento de cada etiqueta antes de ofrecerla a sus clientes. También debe revisar que no haya sido sustituida, manipulada o redirigida sin autorización.",
      "Los dispositivos, su personalización, preparación, envío y reposición se cotizan por separado cuando corresponda. Antes de aceptar un pedido deberán informarse el precio total, las características, la entrega, las garantías y las condiciones de devolución. La personalización no elimina los derechos legales por defectos o incumplimientos.",
      "La propiedad de una etiqueta física no implica acceso indefinido al servicio digital. La disponibilidad de su destino en Lennsi depende del estado del servicio y de la cuenta asociada. Al finalizar la relación, el titular deberá revisar o retirar los dispositivos que dirijan a contenido no disponible.",
    ],
  },
  {
    id: "planes",
    title: "Planes, precios y contratación",
    paragraphs: [
      "La oferta publicada presenta planes mensuales por sucursal, con precios expresados en pesos mexicanos (MXN). El importe, las funciones, los límites y la disponibilidad aplicables serán los informados y aceptados al contratar. La página de precios permite consultar la oferta comercial vigente.",
      "Antes del pago deberán mostrarse el importe total, los impuestos y cargos aplicables, el periodo contratado, la fecha de inicio y los conceptos adicionales. Los servicios o dispositivos no incluidos requieren aceptación previa. Solicitar información sobre un plan no equivale por sí solo a contratarlo.",
      "Las promociones o pruebas, si se ofrecen, deberán indicar duración, requisitos, alcance y condiciones al finalizar. No se presume una prueba gratuita, un descuento, una permanencia mínima ni una conversión automática a un plan de pago.",
      "Un cambio de plan deberá indicar cuándo surte efecto, su precio y el tratamiento de los importes ya pagados. Si reduce límites, se informará cómo afecta a los puntos o funciones existentes antes de su aplicación.",
    ],
  },
  {
    id: "pagos",
    title: "Pagos, facturación y renovaciones",
    paragraphs: [
      "Los pagos se efectuarán mediante los medios comunicados durante la contratación. El titular debe facilitar datos de facturación correctos y conservar sus comprobantes. La periodicidad mensual de una tarifa no constituye por sí misma una autorización de cargos automáticos.",
      "Si se ofrece cobro recurrente, su activación requerirá información clara sobre importe, frecuencia, fechas y procedimiento de cancelación, así como el consentimiento expreso correspondiente. Los avisos de renovación y los mecanismos para impedir cargos posteriores deberán cumplir la legislación aplicable.",
      "Los cambios de precio se comunicarán antes del periodo al que deban aplicarse y no modificarán retroactivamente periodos ya pagados. Cuando corresponda, se solicitará una nueva aceptación y se permitirá cancelar antes de generar nuevos cargos.",
      "Ante un pago rechazado o un importe pendiente, Lennsi deberá informar la incidencia y ofrecer una oportunidad razonable para aclararla o regularizarla antes de suspender por ese motivo, salvo fraude u otra causa que justifique una actuación inmediata.",
    ],
  },
  {
    id: "cancelaciones",
    title: "Cancelación, devoluciones y reembolsos",
    paragraphs: [
      "El titular podrá solicitar la cancelación mediante el mecanismo comunicado al contratar. Antes de habilitar suscripciones deberá existir un canal accesible para tramitarla, informar su efecto sobre el acceso y confirmar la fecha a partir de la cual no se efectuarán nuevas renovaciones.",
      "Cancelar una suscripción, cerrar una cuenta y eliminar datos son solicitudes distintas. Cancelar futuros cobros no implica necesariamente borrar de inmediato el contenido; dejar de usar la plataforma tampoco sustituye una solicitud de cancelación.",
      "Las condiciones sobre periodos parcialmente utilizados, pagos anticipados y devoluciones voluntarias deberán fijarse y comunicarse antes de contratar. Este borrador no establece una regla general de ausencia de reembolsos ni una devolución automática en todos los casos.",
      "Los cobros duplicados, no autorizados o incorrectos y los incumplimientos del servicio podrán reclamarse con los datos necesarios para identificar la operación. Se conservarán los derechos de devolución, compensación, garantía o desistimiento que reconozca la ley, sin exigir renunciar a ellos para recibir atención.",
    ],
  },
  {
    id: "contenido",
    title: "Contenido y obligaciones del establecimiento",
    paragraphs: [
      "El titular es responsable de la exactitud, legalidad y actualización de menús, precios, promociones, imágenes, logotipos, archivos, datos de contacto y enlaces que publique. Debe disponer de los derechos o permisos necesarios y respetar las condiciones de sus ofertas frente a los visitantes.",
      "El contenido destinado a visitantes debe tratarse como público: quien reciba o copie un enlace puede compartirlo. No deben publicarse secretos, documentos internos, datos personales innecesarios ni credenciales de redes privadas. Si se comparte acceso Wi-Fi, corresponde al establecimiento decidir qué red de invitados facilita y bajo qué condiciones.",
      "El titular deberá corregir enlaces erróneos, contenido infractor o información engañosa cuando lo detecte. Las reclamaciones sobre productos, alimentos, atención o promociones del establecimiento le corresponden a este, sin excluir la responsabilidad propia de Lennsi por su servicio.",
    ],
  },
  {
    id: "uso-permitido",
    title: "Uso permitido y conductas prohibidas",
    paragraphs: [
      "La plataforma debe utilizarse de forma lícita y conforme a su finalidad. Una oferta de escaneos sin límite comercial se refiere al uso ordinario de visitantes y no autoriza ataques ni generación artificial de tráfico.",
      "Está prohibido suplantar identidades; publicar contenido ilícito o infringir derechos de terceros; distribuir malware; realizar phishing o fraude; acceder a cuentas ajenas; evadir controles de acceso; extraer datos sin autorización; o provocar interrupciones mediante solicitudes abusivas.",
      "Tampoco está permitido manipular estadísticas para inducir a error, difundir reseñas falsas o utilizar enlaces para prácticas engañosas. Estas restricciones no impiden el ejercicio de derechos legalmente reconocidos ni la comunicación responsable de vulnerabilidades por el canal oficial.",
    ],
  },
  {
    id: "propiedad-intelectual",
    title: "Propiedad intelectual y autorización de uso",
    paragraphs: [
      "El software, diseño, marca y materiales propios de Lennsi pertenecen a sus respectivos titulares. La contratación concede un derecho limitado, no exclusivo y sujeto a estas condiciones para utilizar el servicio durante la relación contractual; no transmite la propiedad del software ni de la marca.",
      "El titular conserva sus derechos sobre el contenido que aporte. Autoriza a Lennsi a alojarlo, reproducirlo técnicamente y mostrarlo en la medida necesaria para prestar el servicio y presentarlo a los visitantes conforme a su configuración.",
      "Esta autorización no permite utilizar el nombre, logotipo o contenido del establecimiento en campañas publicitarias ajenas al servicio sin autorización adicional. Al terminar la relación, el tratamiento del contenido se sujetará a las obligaciones de conservación y eliminación aplicables.",
    ],
  },
  {
    id: "terceros",
    title: "Enlaces y servicios de terceros",
    paragraphs: [
      "Los enlaces pueden dirigir a servicios externos, como Google, WhatsApp, redes sociales o sitios del establecimiento. Sus titulares controlan su disponibilidad, contenido y condiciones; al acceder a ellos pueden aplicarse sus propios términos y avisos de privacidad.",
      "La presencia de un enlace o una marca no implica asociación, patrocinio ni respaldo. Lennsi no puede asegurar la permanencia de funciones externas ni el resultado de operaciones fuera de su plataforma, pero mantiene las obligaciones que le correspondan por sus propias integraciones y actuaciones.",
    ],
  },
  {
    id: "estadisticas",
    title: "Estadísticas y límites de interpretación",
    paragraphs: [
      "Las estadísticas reflejan eventos que la plataforma consigue registrar, como accesos e interacciones. No certifican personas únicas, ventas, visitas físicas o conversiones y pueden verse afectadas por accesos repetidos, automatizaciones, bloqueos del navegador o fallos de conectividad.",
      "Un clic hacia Google para dejar una reseña no confirma su publicación ni permite asegurar su contenido o valoración. Lennsi no garantiza incrementos de ventas, posicionamiento, reputación o un número determinado de interacciones.",
      "El historial consultable y el detalle disponible dependen del plan y de las funciones habilitadas. Un periodo de consulta no equivale a una promesa de conservación indefinida ni a un plazo de eliminación de datos personales.",
    ],
  },
  {
    id: "privacidad",
    title: "Privacidad y datos personales",
    paragraphs: [
      "El tratamiento de datos personales debe explicarse en el aviso de privacidad, incluyendo la identidad del responsable, finalidades, comunicaciones de datos, plazos o criterios de conservación y medios para ejercer los derechos aplicables. Aceptar estos términos no sustituye los consentimientos específicos que pudieran ser necesarios.",
      "Cada parte debe cumplir las obligaciones que le correspondan por los tratamientos que decida o realice. Si Lennsi trata datos personales por instrucciones de un establecimiento, deberán definirse las responsabilidades y formalizarse, cuando proceda, las condiciones de dicho tratamiento.",
      "El titular no debe incorporar datos de terceros sin una base legítima ni utilizar estadísticas para identificar indebidamente a visitantes. Las tecnologías de medición y las preferencias que correspondan deberán explicarse en la información de privacidad antes de su uso.",
    ],
  },
  {
    id: "disponibilidad",
    title: "Disponibilidad, mantenimiento y soporte",
    paragraphs: [
      "Lennsi deberá prestar el servicio con diligencia razonable. Pueden producirse interrupciones por mantenimiento, actualizaciones, incidencias técnicas o causas externas. Este documento no establece un porcentaje de disponibilidad ni un plazo garantizado de respuesta.",
      "Los mantenimientos previstos que afecten de forma relevante al uso se comunicarán con antelación razonable cuando sea posible. Ante incidencias imprevistas, se adoptarán medidas razonables para restablecer el servicio e informar de sus efectos.",
      "Los canales, horarios y alcance del soporte deberán comunicarse antes de contratar. El titular debe conservar los originales de sus archivos; esta recomendación no exime a Lennsi de sus obligaciones de seguridad, diligencia y protección de la información.",
    ],
  },
  {
    id: "suspension",
    title: "Suspensión y terminación",
    paragraphs: [
      "Podrá restringirse el acceso cuando existan indicios razonables de fraude, uso ilícito, riesgo para la seguridad, incumplimiento sustancial o una obligación legal. Las medidas deberán ser proporcionales y limitarse, cuando sea viable, al contenido o función afectados.",
      "Salvo urgencia de seguridad o prohibición legal, se informará el motivo y se ofrecerá la posibilidad de aclarar o subsanar la situación. La suspensión no supone automáticamente perder todos los importes pagados ni impide reclamar una decisión incorrecta.",
      "Al finalizar el servicio pueden dejar de estar disponibles el panel, las páginas y los enlaces asociados. Cuando sea legal y técnicamente posible, se facilitará una oportunidad razonable para recuperar el contenido antes de su eliminación; el alcance y el procedimiento deberán concretarse al tramitar la baja.",
      "Los datos sujetos a obligaciones de conservación no se eliminarán por el solo cierre de la cuenta. Su conservación deberá limitarse a la finalidad y al plazo correspondientes, según el aviso de privacidad y la legislación aplicable.",
    ],
  },
  {
    id: "responsabilidad",
    title: "Responsabilidad y derechos irrenunciables",
    paragraphs: [
      "Cada parte responderá por los incumplimientos y daños que le sean atribuibles conforme a la legislación aplicable. La valoración atenderá a las circunstancias, la relación causal y las medidas razonables adoptadas para prevenir o reducir el daño.",
      "Lennsi no asume obligaciones de resultado sobre decisiones comerciales del titular ni hechos exclusivamente imputables a terceros. Esto no excluye su responsabilidad por actos propios, incumplimientos contractuales o fallos respecto de los cuales la ley le atribuya responsabilidad.",
      "Ninguna disposición pretende excluir responsabilidades que no puedan limitarse legalmente ni suprimir garantías, derechos de consumidores o vías de reclamación obligatorias. Los acontecimientos fuera del control razonable de una parte se valorarán conforme a la ley y no justificarán por sí solos retener pagos por prestaciones no realizadas.",
    ],
  },
  {
    id: "modificaciones",
    title: "Modificaciones y comunicaciones",
    paragraphs: [
      "Las versiones definitivas deberán indicar fecha de actualización y entrada en vigor. Los cambios sustanciales se comunicarán por un medio adecuado antes de aplicarse, explicando su alcance y solicitando una nueva aceptación cuando corresponda.",
      "Las modificaciones no tendrán efectos retroactivos sobre derechos adquiridos ni autorizan cargos no consentidos. Si afectan sustancialmente a un servicio contratado, se informarán las opciones de terminación y los efectos económicos correspondientes.",
      "Las comunicaciones operativas sobre seguridad, pagos o cambios del servicio son distintas de los mensajes publicitarios. La autorización para recibir publicidad, cuando sea necesaria, deberá gestionarse de forma independiente.",
    ],
  },
  {
    id: "controversias",
    title: "Ley aplicable y resolución de controversias",
    paragraphs: [
      "La ley y las autoridades competentes se determinarán conforme a las reglas aplicables a la relación contractual. Antes de aprobar la versión definitiva deberá identificarse el país de establecimiento del prestador y revisarse el régimen correspondiente a los mercados en los que opere.",
      "Las partes podrán intentar resolver controversias mediante el canal oficial de atención, sin renunciar a acudir a las autoridades administrativas o judiciales competentes ni impedir el ejercicio de derechos dentro de los plazos legales.",
      "Este borrador no impone arbitraje obligatorio, un tribunal exclusivo ni la renuncia a protecciones imperativas del lugar de residencia del usuario. Si una disposición resulta inválida, las restantes conservarán su efecto en la medida permitida por la ley.",
    ],
  },
  {
    id: "contacto",
    title: "Contacto y solicitudes",
    paragraphs: [
      "El correo oficial de atención y el domicilio para notificaciones están pendientes de confirmación. Deben incorporarse antes de utilizar estos términos como documento contractual, junto con el procedimiento de cancelación y los medios para ejercer derechos sobre datos personales.",
      "Al presentar una solicitud, indica el establecimiento o cuenta relacionados, una descripción de lo ocurrido y, cuando corresponda, la referencia de la operación. No envíes contraseñas, códigos de acceso ni datos completos de tarjetas. La verificación de identidad deberá limitarse a lo necesario para atender la solicitud.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div>
      <Header />
      <main className="mx-auto mt-16 min-h-screen max-w-6xl px-4 pt-16 pb-40 sm:px-6 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
          <aside className="min-w-0">
            <nav
              aria-label="Contenido de los términos y condiciones"
              className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:pr-3 hide-scrollbar"
            >
              <div className="mt-8 border-b border-input pb-6">
                <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Relacionado</p>
                <Link
                  href="/legal/privacy"
                  className="flex items-center gap-1 text-sm font-medium group text-charcoal hover:text-primary transition-colors"
                >
                  Políticas de Privacidad
                  <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <p className="pt-6 text-xs font-medium tracking-wide text-muted-foreground uppercase">En este documento</p>
              <ol className="mt-5 space-y-3 text-sm leading-5">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-muted-foreground hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                      {index + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <article aria-labelledby="terms-title" className="min-w-0">
            <header className="pb-4">
              <h1
                id="terms-title"
                className="mt-4 text-4xl font-semibold tracking-tight sm:text-[40px]"
              >
                Términos y Condiciones
              </h1>
              <p className="mt-5 text-sm text-muted-foreground">
                Última actualización el <time dateTime="2026-09-17">17 de septiembre de 2026</time>
              </p>
            </header>
            <div
              role="note"
              className="mt-8 rounded-2xl border border-input bg-sand/40 p-5 text-sm leading-7"
            >
              <p className="font-semibold">Borrador pendiente de completar y revisar</p>
              <p className="mt-2 text-muted-foreground">
                Este documento propone las condiciones del servicio. Antes de su publicación definitiva deben confirmarse los datos legales del prestador, su domicilio, país, correo de atención y las políticas de cobro, cancelación y reembolso. Aún no tiene una fecha de entrada en vigor.
              </p>
            </div>
            <div className="mt-12 space-y-12">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-title`}
                  className="scroll-mt-28"
                >
                  <h2
                    id={`${section.id}-title`}
                    className="text-xl font-semibold tracking-tight sm:text-2xl"
                  >
                    {index + 1}. {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.id === "planes" && (
                      <p>
                        <Link
                          href="/pricing"
                          className="font-medium text-charcoal underline underline-offset-4"
                        >
                          Consultar planes y precios
                        </Link>
                      </p>
                    )}
                    {section.id === "privacidad" && (
                      <p>
                        <Link
                          href="/legal/privacy"
                          className="font-medium text-charcoal underline underline-offset-4"
                        >
                          Consultar la página de privacidad
                        </Link>
                        {" "}. Su contenido deberá completarse antes de utilizar este documento como versión definitiva.
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
