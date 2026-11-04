"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  useGetJournalsQuery,
  useLazyGetJournalsPageQuery,
  useGetJournalCategoriesQuery,
} from "@/services/journalApi";
import { IconSearch } from "@tabler/icons-react";
import InfiniteScrollLoader from "@/components/InfiniteScrollLoader";
import JournalCard, { JournalPost } from "@/components/journal/JournalCard";

const INITIAL_LIMIT = 100;

function CardSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`w-full animate-pulse bg-white bg-[length:200%_100%] ${
        tall ? "h-[320px]" : "h-[300px]"
      }`}
    />
  );
}

interface JournalClientProps {
  initialJournals: JournalPost[];
  initialTotal: number;
  initialHasNextPage: boolean;
  initialCurrentPage: number;
  initialCategories: string[];
}

export default function JournalClient({
  initialJournals,
  initialTotal,
  initialHasNextPage,
  initialCurrentPage,
  initialCategories,
}: JournalClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(2);
  const [allJournals, setAllJournals] =
    useState<JournalPost[]>(initialJournals);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [isStaticData, setIsStaticData] = useState(true);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  const { data: categoriesData } = useGetJournalCategoriesQuery();

  const {
    data: initialData,
    isLoading,
    isError,
  } = useGetJournalsQuery(
    {
      page: 1,
      limit: INITIAL_LIMIT,
      category: activeCategory === "All" ? undefined : activeCategory,
    },
    { skip: isStaticData },
  );

  const [fetchNextPage] = useLazyGetJournalsPageQuery();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (initialData?.journals) {
      setAllJournals(initialData.journals);
      setHasNextPage(initialData.hasNextPage ?? false);
      setCurrentPage(initialData.currentPage ?? 1);
      setPage(2);
    }
  }, [initialData]);

  const handleCategoryChange = (val: string) => {
    setActiveCategory(val);
    setPage(1);
    setHasNextPage(false);
    if (val !== "All" || !isStaticData) {
      setIsStaticData(false);
    } else {
      setAllJournals(initialJournals);
      setHasNextPage(initialHasNextPage);
      setCurrentPage(initialCurrentPage);
      setPage(2);
      setIsStaticData(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const appendJournals = useCallback(
    (result: {
      journals?: JournalPost[];
      hasNextPage?: boolean;
      currentPage?: number;
    }) => {
      if (!result?.journals?.length) return;
      const incoming = result.journals;
      setAllJournals((prev) => {
        const seen = new Set((prev || []).map((j) => j._id));
        const fresh = incoming.filter((j) => !seen.has(j._id));
        if (!fresh.length) return prev;
        return [...prev, ...fresh];
      });
      setHasNextPage(result.hasNextPage ?? false);
      setCurrentPage(result.currentPage ?? page);
    },
    [page],
  );

  const fetchPage = useCallback(
    async (pageToFetch: number) => {
      if (!isMountedRef.current) return;
      if (loading) return;
      setLoading(true);
      try {
        const result = await fetchNextPage({
          page: pageToFetch,
          limit: INITIAL_LIMIT,
          category: activeCategory === "All" ? undefined : activeCategory,
        }).unwrap();
        if (!isMountedRef.current) return;
        appendJournals(result);
      } catch {
        // Retry logic on action
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [loading, fetchNextPage, activeCategory, appendJournals],
  );

  useEffect(() => {
    if (page === 1) return;
    fetchPage(page);
  }, [page, activeCategory]);

  const handleLoadMore = useCallback(() => {
    if (loading) return;
    if (!hasNextPage) return;
    setPage((p) => p + 1);
  }, [loading, hasNextPage]);

  const categories = useMemo(() => {
    // Merge server-fetched + client-fetched categories, deduplicate,
    // and always keep "All" as the first chip.
    const merged = [
      ...new Set([...initialCategories, ...(categoriesData?.categories || [])]),
    ];
    return ["All", ...merged];
  }, [categoriesData, initialCategories]);

  const isFiltered = searchQuery !== "" || activeCategory !== "All";
  const displayJournals = useMemo(() => {
    let result = allJournals;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title?.toLowerCase().includes(q) ||
          post.excerpt?.toLowerCase().includes(q),
      );
    }
    // Actually filter the feed by the selected category chip.
    if (activeCategory !== "All") {
      result = result.filter((post) => post.category === activeCategory);
    }
    return result;
  }, [allJournals, searchQuery, activeCategory]);

  if (isLoading && !isStaticData) {
    return (
      <div className="min-h-screen bg-white font-sans text-[#201d1a]">
        <div className="mx-auto max-w-[1220px] px-5 py-10 md:px-8">
          <div className="mb-[30px] h-[60px] w-[260px] animate-pulse bg-white" />
          <div className="grid grid-cols-1 gap-[1px] border border-[#d8d2c4] bg-white sm:grid-cols-2 lg:grid-cols-6">
            <div className="p-0 sm:col-span-2 lg:col-span-4">
              <CardSkeleton tall />
            </div>
            <div className="p-0 sm:col-span-2 lg:col-span-2">
              <CardSkeleton tall />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 sm:col-span-1 lg:col-span-2">
                <CardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError && !isStaticData) {
    return (
      <div className="min-h-screen bg-white font-sans text-[#201d1a]">
        <div className="px-5 py-[72px] text-center">
          <h3 className="font-heading text-[1.4rem]">Offline</h3>
          <p className="text-sm text-[#6e6b63]">
            Unable to load PropertyBulbul intelligence.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 font-sans text-[#201d1a]">
      <div className="mx-auto max-w-full px-5 md:px-8">
        {/* Masthead */}
        <div className="flex items-end justify-between gap-3 border-b border-[#d8d2c4] pb-[14px] pt-[18px]">
          <div className="font-mono text-[11px] text-[#6e6b63]">
            <b className="font-semibold text-[#201d1a]">PropertyBulbul</b> ·
            Tricity Most Helpful Real Estate Partner
          </div>
          <div className="hidden font-mono text-[11px] text-[#6e6b63] sm:block">
            Chandigarh · Mohali · Panchkula · Zirakpur
          </div>
        </div>

        {/* Header Title */}
        <div className="border-b border-[#d8d2c4] pb-[22px] pt-[26px]">
          <h1 className="mb-[10px] font-heading text-[clamp(2.2rem,6vw,4rem)] leading-[0.98] tracking-[-0.01em]">
            The Journal
          </h1>
          <p className="max-w-[540px] text-[15px] leading-[1.55] text-[#6e6b63]">
            Field notes and market analysis on how the Tricity is actually being
            built, bought, and priced — sector by sector.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col gap-[14px] border-b border-[#d8d2c4] py-4 md:flex-row md:items-center md:gap-[32px]">
          <div className="flex max-w-[320px] items-center gap-2 border-b border-[#201d1a] px-[2px] py-[6px] md:min-w-[200px] md:flex-1">
            <IconSearch
              size={16}
              stroke={1.75}
              className="shrink-0 text-[#6e6b63]"
            />
            <input
              placeholder="Search articles"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-transparent font-sans text-sm text-[#201d1a] outline-none placeholder:text-[#6e6b63]"
            />
          </div>
          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-[2px]">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`shrink-0 border-b-2 pb-[5px] font-sans text-[13px] whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "border-[#ae4429] font-semibold text-[#201d1a]"
                    : "border-transparent text-[#6e6b63] hover:text-[#201d1a]"
                }`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Feed */}
        {displayJournals.length > 0 ? (
          <>
            <div className="-mt-[1px] grid grid-cols-1 gap-[1px] border border-[#d8d2c4] bg-white sm:grid-cols-2 lg:grid-cols-6">
              {displayJournals.map((post, index) => {
                const variant =
                  index === 0 && !isFiltered
                    ? "lead"
                    : index === 1 && !isFiltered
                      ? "second"
                      : "reg";
                return (
                  <JournalCard
                    key={post._id}
                    post={post}
                    index={index}
                    variant={variant}
                  />
                );
              })}
            </div>

            {!searchQuery.trim() && (
              <>
                {loading && (
                  <div className="mt-[1px] grid grid-cols-1 gap-[1px] border border-[#d8d2c4] bg-[#d8d2c4] sm:grid-cols-2 lg:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-4 sm:col-span-1 lg:col-span-2">
                        <CardSkeleton />
                      </div>
                    ))}
                  </div>
                )}
                <InfiniteScrollLoader
                  onIntersect={handleLoadMore}
                  loading={loading}
                  hasMore={hasNextPage}
                />
                {hasNextPage ? (
                  <div className="flex flex-col items-center gap-[10px] px-4 pb-2 pt-[32px]">
                    {loading ? (
                      <span className="font-mono text-[11px] text-[#6e6b63]">
                        Loading more articles…
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="border border-[#201d1a] bg-transparent px-[22px] py-[10px] font-sans text-[13px] font-semibold text-[#201d1a] transition-colors hover:bg-[#201d1a] hover:text-[#f1ede4]"
                        onClick={handleLoadMore}
                      >
                        Load more articles
                      </button>
                    )}
                    <span className="font-mono text-[11px] text-[#6e6b63]">
                      {Math.max(initialTotal - allJournals.length, 0)} more
                      articles remaining
                    </span>
                  </div>
                ) : (
                  allJournals.length > 0 && (
                    <div className="flex flex-col items-center gap-[10px] px-4 pb-2 pt-[32px]">
                      <span className="font-mono text-[11px] text-[#6e6b63]">
                        Showing all {initialTotal || allJournals.length}{" "}
                        articles
                      </span>
                    </div>
                  )
                )}
              </>
            )}
          </>
        ) : (
          <div className="px-5 py-[72px] text-center">
            <h3 className="font-heading text-[1.4rem]">
              No matching insights found
            </h3>
            <p className="text-sm text-[#6e6b63]">
              Try adjusting your search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
