export type AnalyticsSummary = {
  tapsToday: number
  tapsLast7Days: number
  interactions: number
  googleReviewClicks: number
}

export type AnalyticsDailyPoint = {
  date: string
  taps: number
  interactions: number
}

export type AnalyticsRankingItem = {
  name: string
  value: number
}

export type AnalyticsData = {
  summary: AnalyticsSummary
  daily: AnalyticsDailyPoint[]
  actions: AnalyticsRankingItem[]
  touchpoints: AnalyticsRankingItem[]
  branches: AnalyticsRankingItem[]
}

export type AnalyticsBranchOption = {
  id: number
  name: string
}

export type AnalyticsTouchpointOption = {
  id: number
  branchId: number
  name: string
}

export type AnalyticsPeriod = "1" | "7" | "30"

export type AnalyticsFilters = {
  period: AnalyticsPeriod
  branchId: number | null
  touchpointId: number | null
}

export type AnalyticsDashboardProps = {
  data: AnalyticsData
  filters: AnalyticsFilters
  branches: AnalyticsBranchOption[]
  touchpoints: AnalyticsTouchpointOption[]
}