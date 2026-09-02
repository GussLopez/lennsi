import Link from "next/link"
import { notFound } from "next/navigation"
import { z } from "zod"

import { templates } from "@/features/actions/data"
import { ACTION_TEMPLATE_IDS, ACTION_TYPES } from "@/features/actions/types/types"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

const publicTagPageSchema = z.object({
  restaurantName: z.string(),
  restaurantLogoPath: z.string().nullable(),
  branchName: z.string(),
  branch: z.object({
    whatsapp: z.string().nullable(),
    googleReviewUrl: z.string().nullable(),
    menuUrl: z.string().nullable(),
    wifiSsid: z.string().nullable(),
    wifiPassword: z.string().nullable(),
  }),
  templateId: z.enum(ACTION_TEMPLATE_IDS),
  actions: z.array(
    z.object({
      id: z.number(),
      type: z.enum(ACTION_TYPES),
      label: z.string(),
      url: z.string().nullable(),
    }),
  ),
})

export default async function TokenPage({ params }: PageProps<"/go/[token]">) {
  const { token } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_public_tag_page", {
    p_token: token,
  })
  const parsed = publicTagPageSchema.safeParse(data)

  if (error || !parsed.success) notFound()

  const page = parsed.data
  const template =
    templates.find((item) => item.id === page.templateId) ?? templates[0]
  const restaurantLogoUrl = page.restaurantLogoPath
    ? supabase.storage
      .from("restaurants-logos")
      .getPublicUrl(page.restaurantLogoPath).data.publicUrl
    : null
  const actions = page.actions.flatMap((action) => {
    if (action.url) return [{ ...action, url: action.url }]
    if (action.type === "whatsapp" && page.branch.whatsapp) {
      const digits = page.branch.whatsapp.replace(/\D/g, "")
      return digits ? [{ ...action, url: `https://wa.me/${digits}` }] : []
    }
    if (action.type === "google_review" && page.branch.googleReviewUrl) {
      return [{ ...action, url: page.branch.googleReviewUrl }]
    }
    if (action.type === "menu" && page.branch.menuUrl) {
      const url = supabase.storage.from("menus").getPublicUrl(page.branch.menuUrl).data.publicUrl
      return [{ ...action, url }]
    }
    if (action.type === "wifi" && page.branch.wifiSsid) {
      const escapeWifi = (value: string) => value.replace(/([\\;,:"])/g, "\\$1")
      const password = page.branch.wifiPassword ? `P:${escapeWifi(page.branch.wifiPassword)};` : ""
      return [{ ...action, url: `WIFI:T:${password ? "WPA" : "nopass"};S:${escapeWifi(page.branch.wifiSsid)};${password};` }]
    }
    return []
  })
  return (
    <main
      className={cn(
        "min-h-screen w-full px-4 py-12",
        template.background,
      )}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-12">
        <header className="flex flex-col items-center gap-5 text-center">
          {restaurantLogoUrl ? (
            <img
              src={restaurantLogoUrl}
              alt={`Logo de ${page.restaurantName}`}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="flex size-28 items-center justify-center rounded-full bg-current/10 text-4xl font-bold shadow-sm">
              {page.restaurantName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className={cn("text-2xl font-semibold", template.textColor)}>
              {page.restaurantName}
            </h1>
            <p className="mt-1 text-sm opacity-70">{page.branchName}</p>
          </div>
        </header>

        <div className="flex w-full flex-col gap-5">
          {actions.map((action) => (
            <Link
              key={action.id}
              href={action.url}
              className={cn("border p-4 text-center text-lg font-medium shadow-sm backdrop-blur transition", template.linkStyle)}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
      <span className="text-sm text-muted-foreground absolute bottom-10 right-1/2 translate-x-1/2">Powered by Lennsi</span>
    </main>
  )
}
