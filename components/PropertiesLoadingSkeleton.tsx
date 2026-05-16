// components/PropertiesLoadingSkeleton.tsx
// Shown while the Suspense boundary resolves — matches the real page layout
// so there's no jarring layout shift when content streams in.

export default function PropertiesLoadingSkeleton() {
  return (
    <div className="w-full pt-20 bg-gray-50 min-h-screen animate-pulse">
      <div className="max-w-full mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 space-y-6">

        {/* Heading */}
        <div className="text-center space-y-3">
          <div className="h-8 bg-gray-200 rounded-lg w-2/3 mx-auto" />
          <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>

        {/* Search bar */}
        <div className="h-14 bg-gray-200 rounded-2xl w-full" />

        {/* Result count placeholder */}
        <div className="h-4 bg-gray-200 rounded w-40" />

        {/* Property card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
              {/* Image placeholder */}
              <div className="h-48 bg-gray-200" />
              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="flex gap-2 pt-1">
                  <div className="h-3 bg-gray-200 rounded w-12" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
