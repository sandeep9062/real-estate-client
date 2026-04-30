import type { PropertyGridColumns } from "@/components/PropertyGrid";

const gridClassByColumns: Record<PropertyGridColumns, string> = {
  default:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  two:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6",
  three:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6",
};

export type PropertyGridSkeletonProps = {
  count?: number;
  columns?: PropertyGridColumns;
  className?: string;
};

export default function PropertyGridSkeleton({
  count = 6,
  columns = "three",
  className = "",
}: PropertyGridSkeletonProps) {
  return (
    <div
      className={`w-full grid ${gridClassByColumns[columns]} ${className}`.trim()}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex min-h-[460px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="relative min-h-[12.5rem] flex-1 animate-pulse bg-slate-200 sm:min-h-[14rem]" />
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="mt-auto flex gap-2">
              <div className="h-9 flex-1 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
