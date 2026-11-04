"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Badge,
  Group,
  Divider,
  Skeleton,
  Button,
  Paper,
} from "@mantine/core";
import {
  useGetJournalBySlugQuery,
  useGetPublicJournalsQuery,
  useTrackJournalViewMutation,
} from "@/services/journalApi";
import { useGetAllPropertiesQuery } from "@/services/propertiesApi";
import {
  IconCalendar,
  IconUser,
  IconArrowLeft,
  IconHome,
  IconChevronRight,
} from "@tabler/icons-react";
import PropertyCard from "@/components/PropertyCard";
import JournalContent, {
  AUTHOR_FALLBACK,
} from "@/components/journal/JournalContent";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

interface JournalDetailClientProps {
  slug: string;
  initialJournal?: any;
}

export default function JournalDetailClient({
  slug,
  initialJournal,
}: JournalDetailClientProps) {
  // 1. Fetch Journal Content -- skipped when the server already provided it,
  // so the article HTML ships in the first server response, not a skeleton.
  const { data: fetchedJournal, isLoading: journalLoading } =
    useGetJournalBySlugQuery(slug, { skip: !!initialJournal });
  const journal = initialJournal ?? fetchedJournal;

  // 2. Fetch Related Journals via the PUBLIC endpoint (same category,
  // excluding the current article server-side). Shows up to 3.
  const { data: relatedData } = useGetPublicJournalsQuery(
    {
      category: journal?.category,
      exclude: slug,
      limit: 4,
    },
    { skip: !journal?.category },
  );

  const relatedJournals = useMemo(() => {
    const list = relatedData?.journals ?? [];
    return list
      .filter((j: any) => j.slug !== slug && j._id !== journal?._id)
      .slice(0, 3);
  }, [relatedData, slug, journal]);

  // 3. Fetch Related Properties using the journal's "Related listings block":
  //    targetCity: String, targetSector: String
  // Show property cards that match BOTH the targeted city and sector so the
  // listings are exactly relevant to the article's locality.
  const targetCity = journal?.targetCity?.trim();
  const targetSector = journal?.targetSector?.trim();

  // Derive a clean sector value from targetSector.
  // Prefer an explicit "Sector <number>" pattern, otherwise fall back to the
  // first comma-separated part, then the full string.
  const sectorRegex = /Sector\s*\d+(?:[-–]\s*\d+)?/i;
  const sectorQuery =
    targetSector && sectorRegex.test(targetSector)
      ? targetSector.match(sectorRegex)?.[0]
      : targetSector
        ? targetSector.split(",")[0]?.trim()
        : undefined;
  const { data: relatedProps, isLoading: propsLoading } =
    useGetAllPropertiesQuery(
      {
        city: targetCity || undefined,
        sector: sectorQuery,
        limit: 3,
      },
      { skip: !targetCity && !sectorQuery },
    );

  // The backend now returns a paginated response: { success, count, total, pagination, data: [...] }
  // Support both the new shape (relatedProps.data) and the legacy array format (relatedProps)
  const relatedProperties = relatedProps?.data ?? relatedProps ?? [];

  // Count a view once per page open. A ref guard keeps this to exactly one
  // request per mount (also protects against React StrictMode's dev
  // double-invoke of effects). Fires from the client so SSR/metadata fetches
  // and crawlers don't inflate the count.
  const [trackJournalView] = useTrackJournalViewMutation();
  const viewTrackedRef = useRef(false);

  useEffect(() => {
    if (viewTrackedRef.current) return;
    viewTrackedRef.current = true;
    trackJournalView(slug).catch(() => {
      // Tracking is fire-and-forget; never surface errors to the reader.
    });
  }, [slug, trackJournalView]);

  if (journalLoading)
    return (
      <Container size="xl" py={80} px={{ base: 8, md: 12, lg: 16 }}>
        <Stack gap="lg">
          <Skeleton height={36} width={120} radius="xl" />
          <Skeleton height={48} width="80%" radius="md" />
          <Group gap="xl">
            <Skeleton height={20} width={160} radius="md" />
            <Skeleton height={20} width={160} radius="md" />
          </Group>
          <Skeleton height={400} radius="md" />
          <Stack gap="sm">
            <Skeleton height={16} width="100%" radius="md" />
            <Skeleton height={16} width="90%" radius="md" />
            <Skeleton height={16} width="85%" radius="md" />
            <Skeleton height={16} width="95%" radius="md" />
            <Skeleton height={16} width="70%" radius="md" />
          </Stack>
          <Skeleton height={48} width="100%" radius="md" />
          <Stack gap="sm">
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
          </Stack>
        </Stack>
      </Container>
    );

  if (!journal)
    return (
      <Container
        size="xl"
        py={100}
        ta="center"
        px={{ base: 8, md: 12, lg: 16 }}
      >
        <Title>Guide not found</Title>
      </Container>
    );

  return (
    <Container
      size="xl"
      py={{ base: 40, sm: 80 }}
      px={{ base: 12, md: 16, lg: 24 }}
    >
      <Button
        component={Link}
        href="/journal"
        color="#4161df"
        variant="subtle"
        radius={100}
        leftSection={<IconArrowLeft size={10} />}
        mb="sm"
        size="sm"
        className="sm:size-md"
      >
        Back to Insights
      </Button>

      <Stack gap="lg">
        <Badge
          size="md"
          variant="filled"
          color="#4161df"
          className="sm:size-lg"
        >
          {journal.category}
        </Badge>

        <Title
          order={1}
          fw={900}
          style={{ lineHeight: 1.1 }}
          className="text-[26px] sm:text-[34px] md:text-[42px]"
        >
          {journal.title}
        </Title>

        <Group gap="xl" c="dimmed">
          <Group gap={5} wrap="nowrap">
            <IconCalendar size={16} />
            <Text size="sm">
              {new Date(journal.createdAt).toLocaleDateString("en-IN")}
            </Text>
          </Group>
          <Group gap={5} wrap="nowrap">
            <IconUser size={16} />
            <Text size="sm">{journal.author?.name || AUTHOR_FALLBACK}</Text>
          </Group>
        </Group>

        <div className="w-full rounded-md overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              journal.coverImage ||
              "https://propertybulbul.com/propertybulbul.png"
            }
            alt={journal.altText || journal.title}
            width={1200}
            height={630}
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
            style={{ aspectRatio: "1200 / 630", objectFit: "cover" }}
          />
        </div>

        {/* Render journal content with the shared markdown renderer */}
        <div className="w-full max-w-none">
          <JournalContent content={journal.content} />
        </div>

        <Divider my={50} label="Related Listings" labelPosition="center" />

        {/* Real-time Properties from the same Sector */}
        <div>
          <Title order={2} mb="xl" ta="center" className="text-xl sm:text-2xl">
            Properties in{" "}
            {targetCity && targetSector
              ? `${targetCity}, ${targetSector}`
              : targetCity || targetSector || "this area"}
          </Title>
          {(targetCity || sectorQuery) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProperties?.map((prop: any) => (
                <PropertyCard key={prop._id} card={prop} />
              ))}
              {relatedProperties?.length === 0 && (
                <div className="col-span-full">
                  <Text ta="center" c="dimmed">
                    No active listings in this area currently.
                  </Text>
                </div>
              )}
            </div>
          )}
          {!targetCity && !sectorQuery && (
            <div className="col-span-full">
              <Text ta="center" c="dimmed">
                No target city or sector set for this article.
              </Text>
            </div>
          )}
        </div>
        {/* Related Journals */}
        {relatedJournals.length > 0 && (
          <>
            <Divider my={40} label="Related Articles" labelPosition="center" />
            <Stack gap="sm">
              {relatedJournals.map((j: any) => (
                <Paper
                  key={j._id}
                  component={Link}
                  href={`/journal/${j.slug}`}
                  p="md"
                  radius="md"
                  style={{
                    border: "1px solid #f1f3f5",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={600} size="sm" c="dark" lineClamp={1}>
                        {j.title}
                      </Text>
                      <Group gap="xs" wrap="wrap">
                        <Badge size="sm" variant="light" color="#4161df">
                          {j.category}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {new Date(j.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })}
                        </Text>
                      </Group>
                    </Stack>
                    <IconChevronRight size={16} color="#4161df" />
                  </Group>
                </Paper>
              ))}
            </Stack>
          </>
        )}

        {/* Keywords / Tags */}
        {journal.keywords && journal.keywords.length > 0 && (
          <>
            <Divider my={30} label="Keywords" labelPosition="center" />
            <Group gap="xs" justify="center" wrap="wrap">
              {journal.keywords.map((keyword: string, idx: number) => (
                <Badge
                  key={idx}
                  size="lg"
                  variant="light"
                  color="#4161df"
                  radius="xl"
                  className="px-[10px] py-[4px] text-[11px] sm:px-[14px] sm:py-[6px] sm:text-[12px]"
                >
                  #{keyword}
                </Badge>
              ))}
            </Group>
          </>
        )}
        <Paper bg="#4161df10" p="xl" radius="md" mt={60} ta="center">
          <IconHome size={32} color="#4161df" />
          <Title order={3} mt="md" className="text-lg sm:text-xl">
            Ready to move to{" "}
            {targetCity && targetSector
              ? `${targetCity}, ${targetSector}`
              : targetCity || targetSector || "this area"}?
          </Title>
          <Text mb="xl" size="sm" className="sm:text-base">
            Browse our full list of verified properties in this locality.
          </Text>
          <Button
            size="md"
            radius="md"
            color="#4161df"
            component={Link}
            href={
              targetCity
                ? `/properties/${String(targetCity)
                    .toLowerCase()
                    .replace(/\s+/g, "-")}?sector=${encodeURIComponent(
                    targetSector || "",
                  )}`
                : sectorQuery
                  ? `/properties?sector=${encodeURIComponent(sectorQuery)}`
                  : "/properties"
            }
            className="w-full sm:w-auto"
          >
            Explore All Listings
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
}
