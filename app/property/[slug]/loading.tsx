/**
 * Route-level skeleton for `app/property/[slug]`.
 *
 * Mirrors the real layout (breadcrumb, title block, gallery, facts strip,
 * two-column body) and every block has a fixed size, so the swap to the
 * loaded page does not shift content.
 */

function Bar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
      aria-hidden
    />
  );
}

export default function PropertyLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-28 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading property details…</span>

          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2">
            <Bar className="h-3 w-12" />
            <Bar className="h-3 w-3" />
            <Bar className="h-3 w-16" />
            <Bar className="h-3 w-3" />
            <Bar className="h-3 w-24" />
          </div>

          {/* Header */}
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="w-full min-w-0 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Bar className="h-6 w-20 rounded-full" />
                <Bar className="h-6 w-24 rounded-full" />
                <Bar className="h-6 w-16 rounded-full" />
              </div>
              <Bar className="h-9 w-3/4 max-w-xl md:h-11" />
              <Bar className="h-4 w-1/2 max-w-sm" />
            </div>
            <div className="space-y-2 lg:text-right">
              <Bar className="h-9 w-40 md:h-11" />
              <Bar className="ml-auto h-3 w-24" />
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-6 overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-900/5" />

          {/* Sticky section nav */}
          <div className="mb-8 hidden h-12 items-center gap-3 border-y border-slate-200 lg:flex">
            {["w-20", "w-16", "w-24", "w-20", "w-20"].map((w) => (
              <Bar key={w} className={`h-3 ${w}`} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="min-w-0 space-y-12 lg:col-span-2">
              {/* Key facts strip */}
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-900/10 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 bg-white px-3 py-5"
                  >
                    <Bar className="h-5 w-5 rounded-md" />
                    <Bar className="h-4 w-10" />
                    <Bar className="h-3 w-14" />
                  </div>
                ))}
              </div>

              {/* About */}
              <div>
                <Bar className="mb-5 h-7 w-52" />
                <div className="max-w-[70ch] space-y-2.5">
                  {["w-full", "w-full", "w-11/12", "w-4/5"].map((w) => (
                    <Bar key={w} className={`h-4 ${w}`} />
                  ))}
                </div>
              </div>

              {/* Details */}
              <div>
                <Bar className="mb-5 h-7 w-44" />
                <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3"
                    >
                      <Bar className="h-4 w-28" />
                      <Bar className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Map block, sized like the real one */}
              <div className="h-[320px] rounded-2xl bg-slate-200 md:h-[400px]" />
            </div>

            {/* Contact panel */}
            <aside className="lg:col-span-1">
              <div className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-slate-900/10">
                <Bar className="h-5 w-56" />
                <Bar className="h-4 w-64" />
                <div className="space-y-2.5 pt-4">
                  <Bar className="h-12 w-full rounded-xl" />
                  <Bar className="h-12 w-full rounded-xl" />
                  <Bar className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}