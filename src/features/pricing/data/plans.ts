export type PlanId = "essential" | "pro";

type Plan = {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  featured: boolean;
  badge?: string;
};

type FeatureValue = {
  text: string;
  included: boolean;
  pending?: string;
};

type PricingFeature = {
  id: string;
  label: string;
  values: Record<PlanId, FeatureValue>;
};

export const plans: Plan[] = [
  {
    id: "essential",
    name: "Esencial",
    price: 199,
    description:
      "Todo lo necesario para conectar a tus clientes con tu restaurante.",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 349,
    description:
      "Conoce cómo interactúan tus clientes con cada punto de tu restaurante.",
    featured: true,
    badge: "Analítica avanzada",
  },
];

const included: FeatureValue = { text: "Sí", included: true };
const excluded: FeatureValue = { text: "No incluido", included: false };
const upcoming: FeatureValue = {
  text: "Sí",
  included: true,
  pending: "Próximamente",
};

// Commercial entitlements only; these values do not enforce backend limits.
// Availability reflects the current public page/editor and analytics UI.
export const pricingFeatures: PricingFeature[] = [
  {
    id: "branding",
    label: "Página con logo y colores del restaurante",
    values: {
      essential: {
        ...included,
        pending: "Colores personalizados: próximamente. Logo disponible.",
      },
      pro: {
        ...included,
        pending: "Colores personalizados: próximamente. Logo disponible.",
      },
    },
  },
  {
    id: "links",
    label: "Menú PDF, Wi-Fi, reseñas y redes sociales",
    values: { essential: included, pro: included },
  },
  {
    id: "updates",
    label: "Actualizar enlaces y menú",
    values: { essential: included, pro: included },
  },
  {
    id: "points",
    label: "Puntos identificados por mesa o ubicación",
    values: {
      essential: { text: "Hasta 15", included: true },
      pro: { text: "Hasta 50", included: true },
    },
  },
  {
    id: "analytics",
    label: "Visitas y clics totales por acción",
    values: { essential: included, pro: included },
  },
  {
    id: "history",
    label: "Historial de estadísticas",
    values: {
      essential: { text: "Últimos 30 días", included: true },
      pro: {
        text: "Últimos 12 meses",
        included: true,
        pending: "Próximamente. Actualmente: últimos 30 días.",
      },
    },
  },
  {
    id: "comparison",
    label: "Comparación entre periodos",
    values: { essential: excluded, pro: upcoming },
  },
  {
    id: "breakdown",
    label: "Desglose por mesa, día y horario",
    values: {
      essential: excluded,
      pro: {
        ...included,
        pending: "Por horario: próximamente. Por mesa y día disponible.",
      },
    },
  },
  {
    id: "exports",
    label: "Exportación de reportes",
    values: { essential: excluded, pro: upcoming },
  },
  {
    id: "scans",
    label: "Límite comercial de escaneos",
    values: {
      essential: { text: "Sin límite", included: true },
      pro: { text: "Sin límite", included: true },
    },
  },
];

export const priceNote =
  "Precios en MXN por sucursal al mes. Dispositivos NFC y su preparación se cotizan por separado.";

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(price);
}

export const pricingFaqs = [
  {
    question: "¿El precio es por restaurante o por sucursal?",
    answer:
      "La mensualidad se cobra por sucursal. Cada sucursal puede elegir el plan que necesita.",
  },
  {
    question: "¿Las tarjetas o soportes NFC están incluidos?",
    answer:
      "No. Los dispositivos NFC, su personalización y preparación se cotizan por separado en un pago inicial. Las reposiciones también se cotizan aparte.",
  },
  {
    question: "¿Qué es un punto?",
    answer:
      "Es una ubicación identificada, como una mesa, la barra o la recepción, desde donde tus clientes acceden a los enlaces de tu restaurante mediante NFC o QR. Un punto puede tener varios botones: menú, Wi-Fi y reseñas, por ejemplo. Los límites son de puntos digitales activos, no de dispositivos físicos incluidos.",
  },
  {
    question: "¿Qué diferencia hay entre las estadísticas de Esencial y Pro?",
    answer:
      "Ambos planes incluyen visitas y clics por acción de los últimos 30 días. Pro contempla un historial de 12 meses, comparación entre periodos, desglose por mesa, día y horario, y exportación de reportes. El historial ampliado, la comparación, el desglose por horario y la exportación estarán disponibles próximamente.",
  },
  {
    question: "¿Un clic en reseñas significa una nueva reseña en Google?",
    answer:
      "No. Lennsi mide los clics en el enlace para dejar una reseña; eso no confirma que el cliente haya publicado una.",
  },
];
