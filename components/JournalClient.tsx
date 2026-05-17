"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Badge,
  Group,
  Stack,
  Center,
  Box,
  Overlay,
  TextInput,
  SegmentedControl,
} from "@mantine/core";
import {
  useGetJournalsQuery,
  useLazyGetJournalsPageQuery,
  useGetJournalCategoriesQuery,
} from "@/services/journalApi";
import Link from "next/link";
import {
  IconCalendar,
  IconArrowRight,
  IconClock,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
import InfiniteScrollLoader from "@/components/InfiniteScrollLoader";

function JournalCardSkeleton() {
  return (
    <Box
      style={{
        height: 360,
        borderRadius: "20px",
        border: "1px solid #f1f3f5",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Image placeholder */}
      <Box
        style={{
          position: "absolute",
          inset: 0,
          background: "#e9ecef",
        }}
      >
        <Box
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.10) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "var(--mantine-spacing-lg)",
          }}
        >
          {/* Badge skeleton */}
          <Box
            style={{
              height: 22,
              width: 80,
              borderRadius: 4,
              background:
                "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              marginBottom: 8,
            }}
          />
          {/* Title skeleton */}
          <Box
            style={{
              height: 24,
              width: "90%",
              borderRadius: 6,
              background:
                "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              marginBottom: 8,
            }}
          />
          {/* Second line skeleton */}
          <Box
            style={{
              height: 24,
              width: "65%",
              borderRadius: 6,
              background:
                "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              marginBottom: 12,
            }}
          />
          {/* Excerpt skeleton */}
          <Group gap="sm">
            <Box
              style={{
                height: 14,
                width: 80,
                borderRadius: 4,
                background:
                  "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
            <Box
              style={{
                height: 14,
                width: 70,
                borderRadius: 4,
                background:
                  "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
          </Group>
        </Box>
      </Box>
    </Box>
  );
}

function FeaturedSkeleton() {
  return (
    <Box
      style={{
        height: "clamp(300px, 46vh, 450px)",
        borderRadius: "20px",
        border: "1px solid #f1f3f5",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        style={{
          position: "absolute",
          inset: 0,
          background: "#e9ecef",
        }}
      >
        <Box
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.10) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "var(--mantine-spacing-xl)",
          }}
        >
          <Box
            style={{
              height: 24,
              width: 100,
              borderRadius: 4,
              background:
                "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              marginBottom: 12,
            }}
          />
          <Box
            style={{
              height: 32,
              width: "80%",
              borderRadius: 6,
              background:
                "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              marginBottom: 8,
            }}
          />
          <Box
            style={{
              height: 32,
              width: "55%",
              borderRadius: 6,
              background:
                "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              marginBottom: 12,
            }}
          />
          <Group gap="sm">
            <Box
              style={{
                height: 14,
                width: 90,
                borderRadius: 4,
                background:
                  "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
            <Box
              style={{
                height: 14,
                width: 80,
                borderRadius: 4,
                background:
                  "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
          </Group>
        </Box>
      </Box>
    </Box>
  );
}

const INITIAL_LIMIT = 12;

interface JournalClientProps {
  initialJournals: any[];
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
  const [page, setPage] = useState(1);
  const [allJournals, setAllJournals] = useState<any[]>(initialJournals);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [isStaticData, setIsStaticData] = useState(true);

  // Fetch all distinct categories from server (stable, not dependent on loaded data)
  const { data: categoriesData } = useGetJournalCategoriesQuery();

  // Fetch initial page (used when category changes)
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
    { skip: isStaticData }, // skip when SSG data is still active
  );

  // Lazy query for fetching additional pages
  const [fetchNextPage, { isFetching: isFetchingNext }] =
    useLazyGetJournalsPageQuery();

  // Sync initial data when it changes (new category selection etc.)
  useEffect(() => {
    if (initialData?.journals) {
      setAllJournals(initialData.journals);
      setHasNextPage(initialData.hasNextPage ?? false);
      setCurrentPage(initialData.currentPage ?? 1);
      setPage(1);
    }
  }, [initialData]);

  // Handle category change - re-fetch with getJournals (page 1)
  const handleCategoryChange = (val: string) => {
    setActiveCategory(val);
    setAllJournals([]);
    setPage(1);
    setHasNextPage(false);
    // Switch to client-side fetching when category changes from initial "All"
    if (val !== "All" || !isStaticData) {
      setIsStaticData(false);
    } else {
      // Reset back to SSG data
      setAllJournals(initialJournals);
      setHasNextPage(initialHasNextPage);
      setCurrentPage(initialCurrentPage);
      setPage(1);
      setIsStaticData(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  // Infinite scroll callback
  const handleLoadMore = useCallback(async () => {
    if (isFetchingNext || !hasNextPage) return;

    const nextPage = currentPage + 1;
    try {
      const result = await fetchNextPage({
        page: nextPage,
        limit: INITIAL_LIMIT,
        category: activeCategory === "All" ? undefined : activeCategory,
      }).unwrap();

      if (result?.journals) {
        setAllJournals((prev) => [...prev, ...result.journals]);
        setHasNextPage(result.hasNextPage ?? false);
        setCurrentPage(result.currentPage ?? nextPage);
        setPage(nextPage);
      }
    } catch {
      // Silently fail – user can scroll to retry
    }
  }, [isFetchingNext, hasNextPage, currentPage, fetchNextPage, activeCategory]);

  // Client-side filtering for search (server-side category filtering is already applied)
  const filteredJournals = useMemo(() => {
    if (!searchQuery.trim()) return allJournals;
    const q = searchQuery.toLowerCase();
    return allJournals.filter(
      (post: any) =>
        post.title?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q),
    );
  }, [allJournals, searchQuery]);

  // Categories are fetched from the server (distinct values from DB)
  // This ensures all categories are always available regardless of current filter
  const categories = useMemo(() => {
    const serverCategories = categoriesData?.categories || initialCategories;
    return ["All", ...serverCategories];
  }, [categoriesData, initialCategories]);

  // Build skeleton layout matching the real card layout
  const renderInitialSkeleton = () => (
    <Container size="xl" py={60}>
      <Center mb="xl">
        <Box
          style={{
            height: 45,
            width: 320,
            borderRadius: "var(--mantine-radius-xl)",
            background:
              "linear-gradient(90deg, #dee2e6 25%, #f1f3f5 50%, #dee2e6 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      </Center>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
      <Grid gutter={10}>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <FeaturedSkeleton />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <FeaturedSkeleton />
        </Grid.Col>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid.Col key={`sk-${i}`} span={{ base: 12, sm: 6, md: 4 }}>
            <JournalCardSkeleton />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );

  // Inline skeleton for additional pages being loaded
  const renderNextPageSkeleton = () => (
    <Grid gutter={{ base: "xs", md: 10 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Grid.Col key={`next-sk-${i}`} span={{ base: 12, sm: 6, md: 4 }}>
          <JournalCardSkeleton />
        </Grid.Col>
      ))}
    </Grid>
  );

  if (isLoading && !isStaticData) {
    return renderInitialSkeleton();
  }

  if (isError && !isStaticData) {
    return (
      <Center h="70vh" px="md">
        <Stack align="center" gap="sm" ta="center">
          <Title order={3}>Offline</Title>
          <Text c="dimmed">Unable to load PropertyBulbul intelligence.</Text>
        </Stack>
      </Center>
    );
  }

  const displayJournals = searchQuery.trim() ? filteredJournals : allJournals;

  return (
    <Box component="main" bg="#fcfcfd" pb={{ base: 40, md: 80 }}>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
      <Box pt={{ base: 80, md: 120 }} pb={{ base: 10, md: 10 }}>
        <Container size="xl">
          <Stack align="center" gap={8} mb={{ base: 20, md: 30 }}>
            <Text
              fw={700}
              tt="uppercase"
              lts={1.5}
              size="xs"
              c="#4161df"
              ta="center"
            >
              Insights & Intelligence
            </Text>
            <Title
              order={1}
              size="clamp(1.8rem, 5vw, 2.8rem)"
              fw={900}
              ta="center"
              lh={1.1}
            >
              The PropertyBulbul{" "}
              <Text component="span" c="#4161df" inherit>
                Journal
              </Text>
            </Title>
            <Text c="dimmed" ta="center" maw={550} size="sm" fw={500} px="md">
              Strategic analysis for the Chandigarh, Mohali, and Zirakpur real
              estate landscape.
            </Text>
          </Stack>

          <Stack gap="md" maw={800} mx="auto" mb={{ base: 20, md: 30 }} px="xs">
            <TextInput
              placeholder="Search articles..."
              size="md"
              radius="xl"
              leftSection={<IconSearch size={18} stroke={1.5} />}
              value={searchQuery}
              onChange={handleSearchChange}
              styles={{
                input: {
                  height: "48px",
                  border: "1px solid #e9ecef",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                },
              }}
            />

            <Box style={{ overflowX: "auto", paddingBottom: "4px" }}>
              <Center style={{ minWidth: "max-content" }}>
                <SegmentedControl
                  value={activeCategory}
                  onChange={handleCategoryChange}
                  data={categories}
                  radius="xl"
                  size="sm"
                  color="#4161df"
                  styles={{
                    root: { backgroundColor: "#f1f3f5" },
                  }}
                />
              </Center>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container size="xl">
        {displayJournals.length > 0 ? (
          <>
            <Grid gutter={{ base: "xs", md: 10 }}>
              {displayJournals.map((post: any, index: number) => {
                const isFiltered =
                  searchQuery !== "" || activeCategory !== "All";
                const isFeatured = index === 0 && !isFiltered;
                const isMedium = index === 1 && !isFiltered;

                return (
                  <Grid.Col
                    key={post._id}
                    span={{
                      base: 12,
                      sm: 6,
                      md: isFeatured ? 7 : isMedium ? 5 : 4,
                    }}
                  >
                    <Card
                      component={Link}
                      href={`/journal/${post.slug}`}
                      radius="20px"
                      p={0}
                      style={{
                        height:
                          isFeatured || isMedium
                            ? "clamp(300px, 46vh, 450px)"
                            : 360,
                        border: "1px solid #f1f3f5",
                        overflow: "hidden",
                        position: "relative",
                        backgroundImage: `url(${
                          post.coverImage ||
                          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Box
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.85) 100%)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                        p={{ base: "lg", sm: "xl" }}
                      >
                        <Badge
                          color="#4161df"
                          variant="filled"
                          mb="xs"
                          radius="sm"
                          size="sm"
                          style={{ alignSelf: "flex-start" }}
                        >
                          {post.category || "Insight"}
                        </Badge>
                        <Title
                          c="white"
                          order={2}
                          size={
                            isFeatured
                              ? "clamp(1.4rem, 4vw, 1.8rem)"
                              : isMedium
                                ? "1.3rem"
                                : "1.1rem"
                          }
                          fw={800}
                          lh={1.2}
                          mb="xs"
                        >
                          {post.title}
                        </Title>
                        {!isFeatured && !isMedium && (
                          <Text
                            c="white"
                            size="xs"
                            opacity={0.75}
                            lineClamp={2}
                            mb="sm"
                          >
                            {post.excerpt ||
                              post.description?.substring(0, 60) + "..."}
                          </Text>
                        )}
                        <Group gap="sm">
                          <Group gap={4}>
                            <IconCalendar size={14} color="white" />
                            <Text size="xs" c="white" opacity={0.8}>
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-IN",
                                { month: "short", year: "numeric" },
                              )}
                            </Text>
                          </Group>
                          <Group gap={4}>
                            <IconClock size={14} color="white" />
                            <Text size="xs" c="white" opacity={0.8}>
                              5 min read
                            </Text>
                          </Group>
                          {!isFeatured && !isMedium && (
                            <Group gap={4} ml="auto">
                              <Text fw={600} size="xs" c="white">
                                Read More
                              </Text>
                              <IconArrowRight size={14} color="white" />
                            </Group>
                          )}
                        </Group>
                      </Box>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>

            {/* Infinite scroll sentinel */}
            {!searchQuery.trim() && (
              <>
                {isFetchingNext && renderNextPageSkeleton()}
                <InfiniteScrollLoader
                  onIntersect={handleLoadMore}
                  loading={isFetchingNext}
                  hasMore={hasNextPage}
                />
              </>
            )}
          </>
        ) : (
          <Center py={80} px="md">
            <Stack align="center" gap="xs" ta="center">
              <IconFilter size={40} stroke={1.5} color="#dee2e6" />
              <Text fw={700}>No matching insights found</Text>
              <Text c="dimmed" size="sm">
                Try adjusting your search terms.
              </Text>
            </Stack>
          </Center>
        )}
      </Container>
    </Box>
  );
}
