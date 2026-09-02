export default function AnalyticsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="h-4 w-full max-w-xl rounded bg-muted" />
      </div>
      <div className="h-24 rounded-xl border bg-background" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-36 rounded-xl border bg-background" />
        ))}
      </div>
      <div className="h-96 rounded-xl border bg-background" />
      <div className="grid gap-6 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-96 rounded-xl border bg-background" />
        ))}
      </div>
    </div>
  )
}
