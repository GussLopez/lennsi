import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsData } from "../types"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import AnalyticsTooltip from "./analytics-tooltip"
import { formatLongDate, formatShortDate } from "../utils"
import { LegendItem } from "./analytics-dashboard"

export default function ActivityChart({
  data,
  periodLabel,
}: {
  data: AnalyticsData["daily"]
  periodLabel: string
}) {
  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="border-b py-5 sm:flex sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Actividad diaria</CardTitle>
          <CardDescription>
            Taps e interacciones · {periodLabel.toLowerCase()}
          </CardDescription>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs sm:mt-0">
          <LegendItem color="var(--primary)" label="Taps" />
          <LegendItem color="var(--chart-2)" label="Interacciones" />
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-5 sm:px-6">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
              <defs>
                <linearGradient id="analytics-taps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="analytics-interactions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.7} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                minTickGap={24}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={formatShortDate}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
                content={(props) => (
                  <AnalyticsTooltip {...props} formatLabel={formatLongDate} />
                )}
              />
              <Area
                type="monotone"
                dataKey="taps"
                name="Taps"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#analytics-taps)"
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="interactions"
                name="Interacciones"
                stroke="var(--chart-2)"
                strokeWidth={2}
                fill="url(#analytics-interactions)"
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}