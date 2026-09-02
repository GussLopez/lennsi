import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { z } from "zod"

import { ActionTypeIcon } from "@/features/actions/components/action-type-icon"
import { templates } from "@/features/actions/data"
import { resolvePublicActionDestination } from "@/features/actions/public-action-destination"
import { getDeviceType } from "@/features/actions/public-request"
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
      token: z.string().uuid(),
      type: z.enum(ACTION_TYPES),
      label: z.string(),
      displayMode: z.enum(["link", "icon"]),
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

  const requestHeaders = await headers()
  const userAgent = requestHeaders.get("user-agent")
  const { error: tapError } = await supabase.rpc("record_public_tag_tap", {
    p_token: token,
    p_user_agent: userAgent,
    p_referrer: requestHeaders.get("referer"),
    p_device_type: getDeviceType(userAgent),
  })

  if (tapError) {
    console.error("No se pudo registrar el tap NFC:", tapError.code)
  }

  const page = parsed.data
  const template =
    templates.find((item) => item.id === page.templateId) ?? templates[0]
  const restaurantLogoUrl = page.restaurantLogoPath
    ? supabase.storage
      .from("restaurants-logos")
      .getPublicUrl(page.restaurantLogoPath).data.publicUrl
    : null
  const actions = page.actions.flatMap((action) => {
    const destination = resolvePublicActionDestination({
      type: action.type,
      url: action.url,
      branch: page.branch,
      getPublicMenuUrl: (path) =>
        supabase.storage.from("menus").getPublicUrl(path).data.publicUrl,
    })

    if (!destination) return []

    const trackingUrl = `/a/${encodeURIComponent(token)}/${encodeURIComponent(action.token)}`
    return [{ ...action, trackingUrl }]
  })
  const linkActions = actions.filter((action) => action.displayMode === "link")
  const iconActions = actions.filter((action) => action.displayMode === "icon")

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
          {linkActions.map((action) => (
            <a
              key={action.token}
              href={action.trackingUrl}
              className={cn("border p-4 text-center text-lg font-medium shadow-sm backdrop-blur transition", template.linkStyle)}
            >
              {action.label}
            </a>
          ))}

          {iconActions.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {iconActions.map((action) => (
                <a
                  key={action.token}
                  href={action.trackingUrl}
                  aria-label={action.label}
                  title={action.label}
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full border border-current/15 bg-current/10 transition hover:scale-105 hover:bg-current/15",
                    template.textColor,
                  )}
                >
                  <ActionTypeIcon type={action.type} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <span className="text-sm text-muted-foreground absolute bottom-10 right-1/2 translate-x-1/2">Powered by Lennsi</span>
    </main>
  )
}
