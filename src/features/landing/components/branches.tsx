import { MapPinHouse, Maximize, ShieldCheck, Tags } from "lucide-react";

export default function Branches() {
  const cards = [
    {
      icon: MapPinHouse,
      title: 'Crea tus sucursales',
      text: 'Agrega cada ubicación de tu restaurante para organizar sus puntos de contacto y etiquetas.'
    },
    {
      icon: Maximize,
      title: 'Identifica cada espacio',
      text: 'Distingue tus mesas, barras, terrazas y entradas con nombres fáciles de reconocer.'
    },
    {
      icon: Tags,
      title: 'Organiza tus etiquetas',
      text: 'Asocia cada etiqueta con el punto donde se utiliza.'
    },
    {
      icon: ShieldCheck,
      title: 'Consulta la actividad',
      text: 'Filtra por sucursal o punto de contacto para ver dónde interactúan tus clientes.'
    },

  ]
  return (
    <section className="max-w-7xl mx-auto px-4 py-34 grid lg:grid-cols-2 gap-12 lg:gap-16">
      <div className="max-w-lg space-y-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-charcoal">
          Cada sucursal tiene su espacio. Tú tienes la visión completa.
        </h2>
        <p className="max-w-100 text-muted-foreground">
          Gestiona tus sucursales desde un mismo panel. Organiza las etiquetas de cada ubicación y consulta la actividad de los puntos donde tus clientes interactúan con tu restaurante.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        {cards.map((card, i) => (
          <div
            key={i}
            className="space-y-3"
          >
            <div className="w-12 h-12 flex justify-center rounded-2xl items-center bg-sand/40">
              <card.icon className="size-5.5" />
            </div>
            <h3 className="text-lg font-medium">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
