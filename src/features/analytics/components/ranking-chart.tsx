import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { truncate } from "../utils"
import AnalyticsTooltip from "./analytics-tooltip"
import { AnalyticsRankingItem } from "../types"
import { ChartEmpty } from "./analytics-dashboard"

export default function RankingChart({
  title,
  description,
  data,
  color,
  emptyMessage,
}: {
  title: string
  description: string
  data: AnalyticsRankingItem[]
  color: string
  emptyMessage: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!data.length ? (
          <ChartEmpty message={emptyMessage} />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 4, right: 16 }}
              >
                <CartesianGrid horizontal={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={104}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value: string) => truncate(value, 16)}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.55 }}
                  content={(props) => <AnalyticsTooltip {...props} />}
                />
                <Bar
                  dataKey="value"
                  name="Total"
                  fill={color}
                  radius={[0, 6, 6, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

