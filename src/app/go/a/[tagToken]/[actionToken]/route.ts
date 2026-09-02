import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { resolvePublicActionDestination } from "@/features/actions/public-action-destination"
import { getDeviceType } from "@/features/actions/public-request"
import { ACTION_TYPES } from "@/features/actions/types/types"
import { createClient } from "@/lib/supabase/server"

const SESSION_COOKIE = "lennsi_session_id"

const paramsSchema = z.object({
  tagToken: z.string().trim().min(1).max(200),
  actionToken: z.string().uuid(),
})

const trackedActionSchema = z.object({
  actionType: z.enum(ACTION_TYPES),
  url: z.string().nullable(),
  branch: z.object({
    whatsapp: z.string().nullable(),
    googleReviewUrl: z.string().nullable(),
    menuUrl: z.string().nullable(),
    wifiSsid: z.string().nullable(),
    wifiPassword: z.string().nullable(),
  }),
})

export async function GET(
  request: NextRequest,
  context: RouteContext<"/go/a/[tagToken]/[actionToken]">,
) {
  const parsedParams = paramsSchema.safeParse(await context.params)
  if (!parsedParams.success) return notFoundResponse()

  const { tagToken, actionToken } = parsedParams.data
  const existingSessionId = request.cookies.get(SESSION_COOKIE)?.value
  const sessionId = existingSessionId ?? crypto.randomUUID()
  const userAgent = request.headers.get("user-agent")
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("track_public_action_click", {
    p_tag_token: tagToken,
    p_action_token: actionToken,
    p_session_id: sessionId,
    p_user_agent: userAgent,
    p_referrer: request.headers.get("referer"),
    p_device_type: getDeviceType(userAgent),
  })
  const trackedAction = trackedActionSchema.safeParse(data)

  if (error || !trackedAction.success) return notFoundResponse()

  const destination = resolvePublicActionDestination({
    type: trackedAction.data.actionType,
    url: trackedAction.data.url,
    branch: trackedAction.data.branch,
    getPublicMenuUrl: (path) =>
      supabase.storage.from("menus").getPublicUrl(path).data.publicUrl,
  })

  if (!destination) return notFoundResponse()

  const response = new NextResponse(null, {
    status: 302,
    headers: {
      Location: destination,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })

  if (!existingSessionId) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30,
    })
  }

  return response
}

function notFoundResponse() {
  return new NextResponse("Acción no encontrada.", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}
