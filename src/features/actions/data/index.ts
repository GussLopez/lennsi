import {
  AtSign,
  Globe2,
  Link2,
  MessageCircle,
  Sparkles,
  Star,
  Utensils,
  Wifi,
} from "lucide-react";
import type {
  ActionTemplate,
  ActionType,
  ActionTypeDetails,
} from "../types/types"

export const templates: ActionTemplate[] = [
  {
    id: "classic",
    name: "Clásica",
    description: "Todo lo esencial",
    background: "bg-zinc-950",
    textColor: "text-white",
    bgColor: "bg-current/10 text-white",
    linkStyle: "rounded-none border border-current/15 bg-current/10 px-4 shadow-sm hover:bg-current/15 text-white"
  },
  {
    id: "social",
    name: "Social",
    description: "Conversación y comunidad",
    background: "bg-white",
    textColor: "text-primary",
    bgColor: "bg-primary text-white",
    linkStyle: "rounded-full border border-primary bg-primary px-4 shadow-sm backdrop-blur text-white"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Directa y elegante",
    background: "bg-stone-100",
    textColor: "text-stone-950",
    bgColor: "bg-current/15",
    linkStyle: "rounded-xl border border-current/15 bg-current/10 px-4 shadow-sm backdrop-blur hover:bg-current/15"
  },
];

export const typeDetails: Array<ActionTypeDetails & { value: ActionType }> = [
  {
    value: "menu",
    label: "Menú",
    icon: Utensils,
    defaultLabel: "Ver menú",
  },
  {
    value: "wifi",
    label: "Wi-Fi",
    icon: Wifi,
    defaultLabel: "Conectarse al Wi-Fi",
  },
  {
    value: "google_review",
    label: "Google Review",
    icon: Star,
    defaultLabel: "Déjanos una reseña",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: AtSign,
    defaultLabel: "Síguenos en Instagram",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    defaultLabel: "Escríbenos por WhatsApp",
  },
  {
    value: "promotion",
    label: "Promoción",
    icon: Sparkles,
    defaultLabel: "Ver promoción",
  },
  {
    value: "website",
    label: "Sitio web",
    icon: Globe2,
    defaultLabel: "Visitar sitio web",
  },
  {
    value: "custom",
    label: "Personalizada",
    icon: Link2,
    defaultLabel: "Nuevo enlace",
  },
]
