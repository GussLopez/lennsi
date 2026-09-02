import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Label as ChartLabel } from "recharts"
import AnalyticsTooltip from "./analytics-tooltip"
import { AnalyticsRankingItem } from "../types"
import { ChartEmpty } from "./analytics-dashboard"

const branchColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
]

export default function BranchesDonut({
  data,
  periodLabel,
}: {
  data: AnalyticsRankingItem[]
  periodLabel: string
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad por sucursal</CardTitle>
        <CardDescription>Taps · {periodLabel.toLowerCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        {!data.length ? (
          <ChartEmpty message="Todavía no hay taps en sucursales." />
        ) : (
          <>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    cursor={false}
                    content={(props) => <AnalyticsTooltip {...props} />}
                  />
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={branchColors[index % branchColors.length]}
                      />
                    ))}
                    <ChartLabel
                      content={({ viewBox }) => {
                        if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                          return null
                        }

                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-semibold"
                            >
                              {total.toLocaleString("es-MX")}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 22}
                              className="fill-muted-foreground text-xs"
                            >
                              taps
                            </tspan>
                          </text>
                        )
                      }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 pt-2">
              {data.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="size-2.5 rounded-sm"
                    style={{
                      backgroundColor:
                        branchColors[index % branchColors.length],
                    }}
                  />
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {item.name}
                  </span>
                  <span className="font-medium tabular-nums">
                    {item.value.toLocaleString("es-MX")}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}