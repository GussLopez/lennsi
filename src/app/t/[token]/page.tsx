import Link from "next/link"
import { notFound } from "next/navigation"
import { z } from "zod"

import { templates } from "@/features/actions/data"
import { ACTION_TEMPLATE_IDS, ACTION_TYPES } from "@/features/actions/types/types"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

const publicTagPageSchema = z.object({
  restaurantName: z.string(),
  branchName: z.string(),
  templateId: z.enum(ACTION_TEMPLATE_IDS),
  actions: z.array(
    z.object({
      id: z.number(),
      type: z.enum(ACTION_TYPES),
      label: z.string(),
      url: z.string(),
    }),
  ),
})

export default async function TokenPage({ params }: PageProps<"/t/[token]">) {
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

  return (
    <main
      className={cn(
        "min-h-screen w-full px-4 py-12",
        template.className,
      )}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-12">
        <header className="flex flex-col items-center gap-5 text-center">
          <div className="flex size-28 items-center justify-center rounded-full bg-current/10 text-4xl font-bold shadow-sm">
            {page.restaurantName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{page.restaurantName}</h1>
            <p className="mt-1 text-sm opacity-70">{page.branchName}</p>
          </div>
        </header>

        <div className="flex w-full flex-col gap-5">
          {page.actions.map((action) => (
            <Link
              key={action.id}
              href={action.url}
              className="rounded-2xl border border-current/15 bg-current/10 p-4 text-center text-lg font-medium shadow-sm backdrop-blur transition hover:bg-current/15"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
