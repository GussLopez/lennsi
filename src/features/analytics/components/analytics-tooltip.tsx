import { TooltipContentProps } from "recharts"

export default function AnalyticsTooltip({
  active,
  payload,
  label,
  formatLabel,
}: TooltipContentProps & {
  formatLabel?: (value: string) => string
}) {
  if (!active || !payload.length) return null

  const title = String(label ?? payload[0]?.payload?.name ?? "")

  return (
    <div className="min-w-36 rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      {title && (
        <p className="mb-1.5 font-medium">
          {formatLabel ? formatLabel(title) : title}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((item) => (
          <div
            key={String(item.dataKey)}
            className="flex items-center gap-2"
          >
            <span
              className="size-2 rounded-sm"
              style={{ backgroundColor: item.color ?? item.fill }}
            />
            <span className="flex-1 text-muted-foreground">{item.name}</span>
            <span className="font-medium tabular-nums">
              {Number(item.value ?? 0).toLocaleString("es-MX")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}