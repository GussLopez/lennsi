"use client"

import { useMemo, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  CalendarDays,
  MousePointerClick,
  Star,
  Zap,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label as ChartLabel,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import type {
  AnalyticsBranchOption,
  AnalyticsDashboardProps,
  AnalyticsData,
  AnalyticsFilters,
  AnalyticsPeriod,
  AnalyticsRankingItem,
  AnalyticsTouchpointOption,
} from "../types"
import BranchesDonut from "./branches-donut"
import ActivityChart from "./activity-chart"
import RankingChart from "./ranking-chart"



const periodOptions = [
  { value: "1", label: "Hoy" },
  { value: "7", label: "Últimos 7 días" },
  { value: "30", label: "Últimos 30 días" },
] satisfies Array<{ value: AnalyticsPeriod; label: string }>

export function AnalyticsDashboard({
  data,
  filters,
  branches,
  touchpoints,
}: AnalyticsDashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const availableTouchpoints = useMemo(
    () =>
      filters.branchId
        ? touchpoints.filter((item) => item.branchId === filters.branchId)
        : touchpoints,
    [filters.branchId, touchpoints],
  )
  const periodLabel =
    periodOptions.find((item) => item.value === filters.period)?.label ??
    "Últimos 7 días"

  function updateFilters(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key)
      else next.set(key, value)
    })

    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    })
  }

  return (
    <div className={cn("space-y-4 transition-opacity", isPending && "opacity-60")}>
      <div className="grid grid-cols-3 gap-5">
        <FilterField label="Periodo" id="analytics-period">
          <Select
            value={filters.period}
            items={periodOptions}
            onValueChange={(value) =>
              updateFilters({ period: value as AnalyticsPeriod })
            }
          >
            <SelectTrigger id="analytics-period" className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Sucursal" id="analytics-branch">
          <Select
            value={filters.branchId ? String(filters.branchId) : "all"}
            items={[
              { value: "all", label: "Todas las sucursales" },
              ...branches.map((branch) => ({
                value: String(branch.id),
                label: branch.name,
              })),
            ]}
            onValueChange={(value) =>
              updateFilters({
                branch: value === "all" ? null : value,
                touchpoint: null,
              })
            }
          >
            <SelectTrigger id="analytics-branch" className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="all">Todas las sucursales</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={String(branch.id)}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Touchpoint" id="analytics-touchpoint">
          <Select
            value={
              filters.touchpointId ? String(filters.touchpointId) : "all"
            }
            items={[
              { value: "all", label: "Todos los touchpoints" },
              ...availableTouchpoints.map((touchpoint) => ({
                value: String(touchpoint.id),
                label: touchpoint.name,
              })),
            ]}
            onValueChange={(value) =>
              updateFilters({
                touchpoint: value === "all" ? null : value,
              })
            }
          >
            <SelectTrigger
              id="analytics-touchpoint"
              className="w-full bg-background"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="all">Todos los touchpoints</SelectItem>
              {availableTouchpoints.map((touchpoint) => (
                <SelectItem
                  key={touchpoint.id}
                  value={String(touchpoint.id)}
                >
                  {touchpoint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Taps hoy"
          value={data.summary.tapsToday}
          detail="Desde las 00:00 de cada sucursal"
          icon={Zap}
        />
        <MetricCard
          title="Taps últimos 7 días"
          value={data.summary.tapsLast7Days}
          detail="Incluye el día de hoy"
          icon={CalendarDays}
        />
        <MetricCard
          title="Interacciones"
          value={data.summary.interactions}
          detail={periodLabel}
          icon={MousePointerClick}
        />
        <MetricCard
          title="Google Reviews"
          value={data.summary.googleReviewClicks}
          detail={periodLabel}
          icon={Star}
        />
      </section>

      <ActivityChart data={data.daily} periodLabel={periodLabel} />

      <section className="grid gap-6 xl:grid-cols-3">
        <RankingChart
          title="Acciones más utilizadas"
          description={`Interacciones · ${periodLabel.toLowerCase()}`}
          data={data.actions}
          color="var(--primary)"
          emptyMessage="Todavía no hay interacciones en este periodo."
        />
        <RankingChart
          title="Touchpoints con más actividad"
          description={`Taps · ${periodLabel.toLowerCase()}`}
          data={data.touchpoints}
          color="var(--chart-2)"
          emptyMessage="Todavía no hay taps en touchpoints."
        />
        <BranchesDonut
          data={data.branches}
          periodLabel={periodLabel}
        />
      </section>
    </div>
  )
}

function FilterField({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string
  value: number
  detail: string
  icon: typeof Zap
}) {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-5">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {value.toLocaleString("es-MX")}
          </CardTitle>
        </div>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="px-5 text-xs text-muted-foreground">
        {detail}
      </CardContent>
    </Card>
  )
}

export function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="size-2 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

export function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}