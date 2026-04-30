"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useGetJournalsQuery } from "@/services/journalApi";
import PropertyGridSkeleton from "@/components/PropertyGridSkeleton";

type Journal = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  targetSector?: string;
  coverImage?: string;
};

export default function GuidesPageClient() {
  const { data: journals = [], isLoading, isError } = useGetJournalsQuery(
    undefined,
  );

  const bySector = useMemo(() => {
    const map = new Map<string, Journal[]>();
    for (const j of journals as Journal[]) {
      const sector = (j.targetSector || "Tricity").trim() || "Tricity";
      const list = map.get(sector) || [];
      list.push(j);
      map.set(sector, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [journals]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 pt-24">
        <div className="mb-10 h-9 max-w-md animate-pulse rounded-lg bg-slate-200" />
        <PropertyGridSkeleton count={6} columns="three" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 pt-24 text-center text-red-600">
        Could not load area guides. Please try again later.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 pt-24">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Area guides
        </h1>
        <p className="mt-2 text-gray-600">
          Locality-focused journals — schools, commute, and market context by
          sector. Each guide links to deeper editorial; over time this cluster
          supports locality SEO landing pages.
        </p>
      </header>

      <div className="flex flex-col gap-14">
        {bySector.map(([sector, posts]) => (
          <section
            key={sector}
            aria-labelledby={`sector-${sector.replace(/\s+/g, "-")}`}
          >
            <h2
              id={`sector-${sector.replace(/\s+/g, "-")}`}
              className="mb-4 border-b border-slate-200 pb-2 text-xl font-semibold text-gray-900"
            >
              {sector}
              <span className="ml-2 text-sm font-normal text-gray-500">
                {posts.length} guide{posts.length === 1 ? "" : "s"}
              </span>
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/journal/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] w-full bg-slate-100">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          Guide
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      {post.category && (
                        <span className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-600">
                          {post.category}
                        </span>
                      )}
                      <span className="font-semibold text-gray-900 group-hover:text-blue-700">
                        {post.title}
                      </span>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
