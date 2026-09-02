import "server-only"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

import type { AnalyticsData, AnalyticsFilters } from "../types"

const analyticsDataSchema = z.object({
  summary: z.object({
    tapsToday: z.number().int().nonnegative(),
    tapsLast7Days: z.number().int().nonnegative(),
    interactions: z.number().int().nonnegative(),
    googleReviewClicks: z.number().int().nonnegative(),
  }),
  daily: z.array(
    z.object({
      date: z.string(),
      taps: z.number().int().nonnegative(),
      interactions: z.number().int().nonnegative(),
    }),
  ),
  actions: z.array(rankingItemSchema()),
  touchpoints: z.array(rankingItemSchema()),
  branches: z.array(rankingItemSchema()),
})

function rankingItemSchema() {
  return z.object({
    name: z.string(),
    value: z.number().int().nonnegative(),
  })
}

export async function getAnalytics(
  restaurantId: number,
  filters: AnalyticsFilters,
): Promise<AnalyticsData> {
  const supabase = await createClient()
  const dateTo = new Date()
  const dateFrom = new Date(dateTo)
  dateFrom.setDate(dateFrom.getDate() - (Number(filters.period) - 1))

  const { data, error } = await supabase.rpc("get_restaurant_analytics", {
    p_restaurant_id: restaurantId,
    p_date_from: toDateOnly(dateFrom),
    p_date_to: toDateOnly(dateTo),
    p_branch_id: filters.branchId,
    p_touchpoint_id: filters.touchpointId,
  })

  if (error) {
    throw new Error("No se pudieron consultar los analytics.", {
      cause: error,
    })
  }

  const parsed = analyticsDataSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error("Supabase devolvió analytics con un formato inesperado.")
  }

  return parsed.data
}

function toDateOnly(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
