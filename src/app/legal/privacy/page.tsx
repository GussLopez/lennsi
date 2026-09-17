import type { Metadata } from "next";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Políticas de Privacidad | Lennsi",
  description:
    "Información sobre los datos de cuentas y visitantes, cookies, estadísticas, proveedores y derechos de privacidad en Lennsi.",
  robots: { index: false, follow: true },
};

const sections = [
  {
    id: "alcance",
    title: "Alcance de estas políticas",
    paragraphs: [
      "Este documento describe el tratamiento de información relacionado con Lennsi, su sitio web, el panel de administración y las páginas públicas que los establecimientos comparten mediante etiquetas NFC o enlaces. Está dirigido tanto a quienes crean y administran cuentas como a quienes visitan el contenido de un restaurante.",
      "No es necesario crear una cuenta para consultar una página pública. Sin embargo, al abrirla o utilizar sus botones se pueden registrar datos técnicos e interacciones, como se explica en los apartados de estadísticas y cookies.",
      "Esta versión es un borrador basado en las funciones de la aplicación. La identificación del responsable, los canales de atención y las condiciones operativas pendientes deberán completarse y verificarse antes de utilizarla como aviso de privacidad definitivo.",
    ],
  },
  {
    id: "responsable",
    title: "Responsable y datos de contacto",
    paragraphs: [
      "Lennsi es el nombre del servicio. Está pendiente incorporar el nombre completo o razón social de la persona responsable del tratamiento, su domicilio y país de establecimiento, así como el correo y el área encargada de atender solicitudes de privacidad. El nombre comercial no sustituye esa identificación.",
      "Cuando un establecimiento aporta contenido o utiliza información para sus propias finalidades, puede tener responsabilidades independientes. La función de cada parte deberá determinarse según el tratamiento concreto y, cuando Lennsi actúe por instrucciones del establecimiento, documentarse en el acuerdo correspondiente.",
      "Los datos de contacto para ejercer derechos todavía no están confirmados. No se presenta un correo provisional ni un formulario como canal de privacidad operativo hasta que hayan sido habilitados para esa finalidad.",
    ],
  },
  {
    id: "datos-cuenta",
    title: "Datos de registro y de la cuenta",
    paragraphs: [
      "Al registrarte con correo electrónico se solicita nombre completo, correo y contraseña. La aplicación utiliza Supabase para gestionar la autenticación y mantiene información de perfil y de sesión para reconocer tu cuenta y permitir el acceso al panel.",
      "Si eliges acceder con Google, la autenticación se realiza a través de ese proveedor. Los datos que se comuniquen dependerán de los permisos y de la información de perfil asociada al acceso, que deberás revisar en la pantalla de autorización. Lennsi no solicita que introduzcas tu contraseña de Google en sus formularios.",
      "También se utilizan identificadores de cuenta y las relaciones con los restaurantes que administras. Los mensajes de confirmación y las comunicaciones necesarias para resolver incidencias de acceso forman parte del funcionamiento de la cuenta.",
    ],
  },
  {
    id: "datos-establecimiento",
    title: "Datos del establecimiento y archivos",
    paragraphs: [
      "Al configurar el servicio puedes aportar nombres de restaurantes y sucursales, direcciones, teléfonos, WhatsApp, logotipos, menús, enlaces y datos de la red Wi-Fi que decidas compartir. También se gestionan nombres de puntos de contacto, etiquetas y acciones asociadas a cada ubicación.",
      "Aunque parte de esta información es comercial, puede identificar a personas, por ejemplo, cuando se utiliza un teléfono personal como contacto del establecimiento. Aporta únicamente la información necesaria y asegúrate de contar con autorización para publicar datos o archivos de terceros.",
      "Los menús, logotipos y contenidos destinados a visitantes se muestran mediante páginas o archivos públicos. Tener su enlace puede permitir consultarlos o compartirlos. No utilices estas funciones para guardar documentos privados, datos sensibles, contraseñas personales o información de redes internas.",
      "Si compartes Wi-Fi, utiliza una red destinada a invitados y considera que sus credenciales se ofrecen a quienes accedan a la acción correspondiente. Retirar contenido de Lennsi no garantiza eliminar las copias que otras personas hayan descargado o compartido previamente.",
    ],
  },
  {
    id: "datos-navegacion",
    title: "Datos de navegación e interacciones",
    paragraphs: [
      "Al abrir una página pública o pulsar una acción, la aplicación transmite información para registrar el evento: la etiqueta o acción utilizada, información del navegador enviada por el dispositivo, el tipo de dispositivo y la página de procedencia cuando el navegador la proporciona. Los eventos se relacionan con el establecimiento y el punto de contacto correspondientes.",
      "En los clics de acciones también se utiliza un identificador aleatorio de sesión almacenado en una cookie. Este identificador permite relacionar interacciones durante su vigencia, pero no equivale al nombre de la persona ni demuestra que cada sesión corresponda a un visitante distinto. No debe considerarse información completamente anónima por el solo hecho de no contener un nombre.",
      "Los servicios de alojamiento y autenticación pueden procesar datos de conexión, incluida la dirección IP, en sus registros técnicos. El alcance, los destinatarios y los plazos de esos registros deberán confirmarse con la configuración de los proveedores antes de la publicación definitiva.",
      "Acercar el teléfono a una etiqueta no concede por sí mismo acceso a tus contactos, fotografías o archivos. La información descrita se genera al abrir el enlace y comunicarse el navegador con los servicios que lo atienden.",
    ],
  },
  {
    id: "finalidades",
    title: "Para qué se utiliza la información",
    paragraphs: [
      "Los datos de cuenta se utilizan para registrar usuarios, autenticar sesiones, asociar los establecimientos que administran y permitir el funcionamiento del panel. Los datos del restaurante y sus archivos permiten configurar y mostrar las páginas, menús y destinos elegidos por el establecimiento.",
      "Los eventos de navegación se utilizan para elaborar estadísticas de accesos y clics por acción, sucursal, punto de contacto y periodo. Esta finalidad de medición debe distinguirse de la información estrictamente necesaria para iniciar sesión o entregar el contenido solicitado.",
      "Si solicitas asistencia, la información que aportes se utilizará para identificar la incidencia y responderla. Los registros técnicos también pueden ser necesarios para detectar errores o usos indebidos; su utilización deberá limitarse a esas finalidades y a las obligaciones aplicables.",
      "No debes enviar en una consulta contraseñas, códigos de acceso ni datos completos de tarjetas. Si la atención de un caso requiere comprobar tu identidad, deberá solicitarse únicamente la información proporcionada y necesaria para hacerlo.",
    ],
  },
  {
    id: "consentimiento",
    title: "Fundamento del tratamiento y preferencias",
    paragraphs: [
      "La versión definitiva deberá identificar el fundamento aplicable a cada finalidad. Cuando un tratamiento requiera consentimiento, deberá obtenerse de forma informada y mediante el mecanismo correspondiente; aceptar los términos del servicio no sustituye automáticamente ese consentimiento.",
      "La publicación de este documento no activa controles de consentimiento ni cambia la forma en que se registran los eventos. Antes de su entrada en vigor deberá comprobarse qué tratamientos requieren una elección previa y habilitarse los controles necesarios, especialmente para tecnologías de medición no esenciales.",
      "La negativa a proporcionar información imprescindible para crear una cuenta puede impedir el registro. Las finalidades opcionales deberán distinguirse para que su rechazo no bloquee funciones que no dependan de ellas.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies y preferencias del navegador",
    paragraphs: [
      "Las cookies son pequeños datos que el sitio guarda en el navegador. Lennsi utiliza cookies para las sesiones de acceso, para recordar el contexto del panel y para relacionar determinados clics. La siguiente tabla describe las cookies identificadas en la aplicación; las de autenticación deberán completarse con su inventario y duración efectivos.",
      "Las duraciones indicadas corresponden a la configuración de la cookie al establecerse. Pueden actualizarse cuando vuelves a utilizar una función y no representan el plazo durante el que se conservan los registros en el servidor.",
      "Puedes consultar, bloquear o borrar cookies desde la configuración de tu navegador. Bloquear las de autenticación puede impedir el acceso al panel, y borrar las de preferencias puede restablecer tus selecciones. Borrar una cookie no elimina los eventos ya registrados ni impide por sí solo que el servidor reciba nuevas solicitudes o registre visitas.",
      "Este documento no ofrece un panel de preferencias que aún no existe. El mecanismo para aceptar o rechazar tecnologías no esenciales, cuando corresponda, deberá incorporarse y verificarse antes de presentar esta política como definitiva.",
    ],
  },
  {
    id: "estadisticas",
    title: "Estadísticas para los establecimientos",
    paragraphs: [
      "El panel presenta recuentos y desgloses de actividad relacionados con el restaurante, sus sucursales, puntos de contacto y acciones. La consulta está vinculada a la cuenta del establecimiento; esto no debe interpretarse como una declaración de que todos los registros originales sean anónimos.",
      "Una apertura o un clic puede deberse a una visita repetida, una comprobación del propio establecimiento o una solicitud automatizada. Un clic hacia Google para escribir una reseña no confirma que se haya publicado. El periodo visible de un informe tampoco define el plazo de eliminación de sus datos de origen.",
      "La función descrita consiste en medir interacciones con el contenido. Si en el futuro se incorporan perfiles individuales o decisiones automatizadas que afecten a personas, deberán explicarse previamente sus finalidades, alcance y opciones aplicables.",
    ],
  },
  {
    id: "proveedores",
    title: "Proveedores y destinatarios",
    paragraphs: [
      "Lennsi utiliza Supabase para autenticación, base de datos y almacenamiento de archivos. Google interviene cuando eliges su opción de inicio de sesión. Estos proveedores reciben la información necesaria para las funciones en las que participan, conforme a la configuración del servicio y a sus condiciones aplicables.",
      "Los visitantes pueden acceder a los contenidos que el establecimiento publica. Los administradores del establecimiento consultan su configuración y estadísticas mediante el panel. Publicar un archivo o un dato de contacto es distinto de mantenerlo únicamente dentro de una cuenta privada.",
      "Antes de la publicación definitiva deberá completarse la relación de proveedores de alojamiento, correo y otros servicios que tengan acceso a datos, junto con su función, ubicación y condiciones de tratamiento. También deberán precisarse las comunicaciones a terceros y las que pudieran resultar obligatorias ante una solicitud válida de autoridad.",
      "Esta política no autoriza de forma general la venta de datos ni su entrega a terceros para finalidades publicitarias. Cualquier uso adicional deberá evaluarse e informarse antes de realizarse, con los permisos que correspondan.",
    ],
  },
  {
    id: "transferencias",
    title: "Tratamiento fuera del país",
    paragraphs: [
      "El uso de servicios en la nube puede implicar almacenamiento o acceso desde otros países. La ubicación efectiva depende del proyecto, de los proveedores contratados y de su infraestructura; no se afirma que todos los datos permanezcan en un país concreto.",
      "Antes de aprobar esta política deberán confirmarse las regiones de alojamiento, los accesos internacionales y las condiciones que los regulan. La versión definitiva deberá explicar las garantías y autorizaciones que correspondan, sin presentar este borrador como consentimiento general para cualquier transferencia.",
    ],
  },
  {
    id: "conservacion",
    title: "Conservación, cierre de cuenta y eliminación",
    paragraphs: [
      "Deben definirse plazos o criterios separados para los datos de cuenta, archivos publicados, eventos de interacción, registros técnicos, comunicaciones de soporte y copias de respaldo. Los periodos concretos están pendientes de confirmación; no se establece una conservación indefinida por defecto.",
      "La duración de una cookie, el historial mostrado por un plan y la conservación de una copia de respaldo son conceptos distintos. Por ejemplo, que una cookie caduque a los treinta minutos no significa que los clics asociados se eliminen al mismo tiempo.",
      "Cerrar sesión, cancelar una suscripción y solicitar la eliminación de datos son acciones diferentes. Una solicitud de eliminación deberá considerar la información que ya no sea necesaria y las obligaciones de conservación que resulten aplicables; cualquier retención deberá explicarse y limitarse a su finalidad.",
      "El procedimiento definitivo deberá indicar qué sucede con el contenido público, los datos asociados y las copias de respaldo al cerrar la cuenta. Los originales que el establecimiento necesite conservar deberán recuperarse antes de retirar sus archivos, cuando sea posible.",
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad de la información",
    paragraphs: [
      "El acceso al panel requiere autenticación y la aplicación utiliza mecanismos de sesión para reconocer al usuario. La protección de los datos también depende de la configuración de permisos, almacenamiento e infraestructura, que debe revisarse de manera continua. Esta descripción no constituye una certificación de seguridad ni una garantía de ausencia de incidentes.",
      "Protege tus credenciales, utiliza contraseñas únicas, cierra sesión en dispositivos compartidos y evita publicar información confidencial. Si sospechas que alguien utiliza tu cuenta sin autorización, comunícalo por el canal oficial de atención una vez confirmado.",
      "Ante un incidente que afecte a datos personales deberán evaluarse su alcance y las medidas de contención, así como las comunicaciones a las personas afectadas y a las autoridades que correspondan. Los canales de aviso deberán quedar definidos en la versión definitiva.",
    ],
  },
  {
    id: "derechos",
    title: "Derechos sobre tus datos",
    paragraphs: [
      "Según la legislación aplicable, puedes solicitar acceso a tus datos, rectificación de información inexacta, cancelación o eliminación y oposición a determinados tratamientos. Cuando corresponda, también puedes revocar tu consentimiento y ejercer otros derechos reconocidos en tu jurisdicción.",
      "Si resulta aplicable la legislación mexicana, estos derechos incluyen acceso, rectificación, cancelación y oposición, conocidos como derechos ARCO. Su ejercicio está sujeto a los requisitos, plazos y excepciones legales; este documento no los sustituye ni los limita.",
      "La solicitud deberá indicar qué derecho deseas ejercer, los datos o tratamiento relacionados y un medio para responderte. La comprobación de identidad o representación deberá ser proporcional. Para visitantes sin cuenta puede ser útil indicar la página y fecha aproximada de la interacción, sin enviar contraseñas ni identificadores de sesión completos.",
      "El correo o formulario de privacidad, la persona encargada, el procedimiento de respuesta y los plazos deberán completarse antes de publicar la versión definitiva. Actualmente esta página no tramita solicitudes. Cuando proceda, podrás acudir a la autoridad competente sin renunciar a otras vías legales.",
    ],
  },
  {
    id: "menores",
    title: "Menores y datos sensibles",
    paragraphs: [
      "La creación y administración de cuentas están orientadas a personas con capacidad para representar o gestionar un establecimiento. Las páginas públicas, por su naturaleza, también pueden ser consultadas por menores; por ello, no se afirma que sea imposible recibir datos técnicos de sus visitas.",
      "Los formularios de registro revisados no solicitan datos de salud, biométricos u otras categorías sensibles. Evita incluirlos en menús, imágenes, enlaces o mensajes de soporte. Si se detecta información de menores o datos sensibles aportados de forma inadecuada, deberá evaluarse su retirada o el tratamiento que legalmente corresponda.",
    ],
  },
  {
    id: "terceros",
    title: "Sitios externos y servicios del restaurante",
    paragraphs: [
      "Al pulsar un enlace puedes salir de Lennsi y acceder a Google, WhatsApp, redes sociales o sitios del restaurante. El destino puede recibir datos de conexión y aplicar sus propias cookies y políticas. Revisa su información de privacidad antes de facilitarle datos adicionales.",
      "Los pedidos, reservas, compras o conversaciones que realices directamente con un establecimiento o un servicio externo se rigen por las prácticas de quien los gestione. La presencia de su enlace en Lennsi no implica que esas operaciones se desarrollen dentro de la plataforma.",
      "Cuando una consulta se refiera a datos recogidos directamente por el restaurante, puede ser necesario dirigirse a este. Esa distinción no elimina las responsabilidades que correspondan a Lennsi por sus propios tratamientos.",
    ],
  },
  {
    id: "pagos-publicidad",
    title: "Pagos y comunicaciones comerciales",
    paragraphs: [
      "La página de planes revisada informa que la contratación en línea estará disponible próximamente. No se describe aquí una pasarela de pago como si estuviera activa. Antes de habilitar pagos deberán identificarse los datos necesarios, el proveedor que los procesa, la información de facturación y sus condiciones de conservación.",
      "Tampoco se considera que crear una cuenta sea una autorización general para recibir publicidad. Si se incorporan campañas comerciales, deberán explicarse los datos utilizados y las opciones para aceptarlas o dejar de recibirlas, cuando correspondan.",
      "Los mensajes de confirmación de cuenta, seguridad o atención de una solicitud tienen una finalidad distinta de la publicidad. Las preferencias comerciales no deberían confundirse con las comunicaciones necesarias para operar el servicio contratado.",
    ],
  },
  {
    id: "actualizaciones",
    title: "Actualizaciones de estas políticas",
    paragraphs: [
      "Esta página mostrará la fecha de actualización de cada versión. Los cambios relevantes en las finalidades, destinatarios o condiciones del tratamiento deberán comunicarse de forma adecuada y, cuando sea necesario, acompañarse de una nueva solicitud de consentimiento.",
      "Modificar el texto no autoriza por sí solo usos incompatibles con los que se informaron al obtener los datos. La versión definitiva deberá guardar coherencia con las funciones activas y los controles reales de privacidad del servicio.",
    ],
  },
  {
    id: "contacto",
    title: "Contacto y estado del documento",
    paragraphs: [
      "Están pendientes el nombre legal y domicilio del responsable, su país de establecimiento y el canal de atención de privacidad. También falta confirmar el inventario de proveedores, las regiones de alojamiento, los plazos de conservación y los mecanismos para gestionar preferencias y solicitudes.",
      "Hasta completar esos elementos y revisar su correspondencia con el servicio, este documento es una propuesta informativa y no una declaración de cumplimiento legal. No tiene todavía una fecha de entrada en vigor.",
    ],
  },
];

const cookies = [
  {
    name: "Sesión de autenticación",
    purpose: "Mantener y renovar el acceso a la cuenta mediante Supabase.",
    duration: "Según la configuración de autenticación; duración y nombres pendientes de confirmar.",
  },
  {
    name: "active_restaurant_id / active_branch_id",
    purpose: "Recordar el restaurante y la sucursal seleccionados en el panel.",
    duration: "Hasta 365 días desde que se establecen o actualizan.",
  },
  {
    name: "sidebar_state",
    purpose: "Recordar si la barra lateral del panel está abierta o cerrada.",
    duration: "Hasta 7 días desde que se establece o actualiza.",
  },
  {
    name: "lennsi_session_id",
    purpose: "Relacionar clics de acciones mediante un identificador aleatorio para estadísticas.",
    duration: "30 minutos desde su creación.",
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <Header />
      <main className="mx-auto mt-16 min-h-screen max-w-6xl px-4 pt-16 pb-40 sm:px-6 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
          <aside className="min-w-0">
            <nav
              aria-label="Contenido de las políticas de privacidad"
              className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:pr-3 hide-scrollbar"
            >
              <div className="mt-8 border-b border-input pb-6">
                <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Relacionado</p>
                <Link
                  href="/legal/terms-conditions"
                  className="flex items-center gap-1 text-sm font-medium group text-charcoal hover:text-primary transition-colors"
                >
                  Términos y Condiciones
                  <ChevronRight aria-hidden="true" className="size-4 group-hover:translate-x-0.5 transition-transform" />
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
          <article aria-labelledby="privacy-title" className="min-w-0">
            <header className="pb-4">
              <h1
                id="privacy-title"
                className="mt-4 text-4xl font-semibold tracking-tight sm:text-[40px]"
              >
                Políticas de Privacidad
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
                Antes de su publicación definitiva deben confirmarse los datos del responsable, el contacto de privacidad, los proveedores, los plazos de conservación y los mecanismos para ejercer derechos y gestionar preferencias. Esta versión aún no tiene una fecha de entrada en vigor.
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
                  <h2 id={`${section.id}-title`} className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {section.id === "cookies" && (
                    <div role="region" aria-label="Tabla de cookies" tabIndex={0} className="mt-6 overflow-x-auto rounded-2xl border border-input focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                      <table className="w-full min-w-140 text-left text-sm leading-6">
                        <caption className="sr-only">Cookies identificadas, finalidad y duración configurada</caption>
                        <thead className="bg-sand/40">
                          <tr>
                            <th scope="col" className="p-4 font-semibold">Cookie o categoría</th>
                            <th scope="col" className="p-4 font-semibold">Finalidad</th>
                            <th scope="col" className="p-4 font-semibold">Duración</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookies.map((cookie) => (
                            <tr key={cookie.name} className="border-t border-input">
                              <th scope="row" className="p-4 align-top font-medium warp-break-words">{cookie.name}</th>
                              <td className="p-4 align-top text-muted-foreground">{cookie.purpose}</td>
                              <td className="p-4 align-top text-muted-foreground">{cookie.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
