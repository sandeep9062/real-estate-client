"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Container,
  Title,
  Text,
  Image,
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
  useGetJournalsQuery,
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
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

interface JournalDetailClientProps {
  slug: string;
}

// Ensure blank lines between markdown block elements (headers, lists, paragraphs)
// Markdown requires \n\n (double newline) to recognize block-level elements
function ensureMarkdownSpacing(content: string): string {
  return (
    content
      // Ensure double newline BEFORE any heading line
      .replace(/\n(#{1,6} .+)/g, "\n\n$1")
      // Ensure double newline AFTER any heading line
      .replace(/(#{1,6} .+)\n(?!\n)/g, "$1\n\n")
      // Ensure double newline BEFORE any list item (starts with -, *, or number.)
      .replace(/\n((?:[-*]|\d+\.) .+)/g, "\n\n$1")
      // Ensure double newline AFTER any list item if next line is NOT also a list item
      .replace(
        /((?:[-*]|\d+\.) .+)\n(?!\n)(?!(?:\s*(?:[-*]|\d+\.) ))/g,
        "$1\n\n",
      )
      // Normalize triple+ newlines to just double newlines
      .replace(/\n{3,}/g, "\n\n")
      // Trim leading/trailing whitespace
      .trim()
  );
}

export default function JournalDetailClient({
  slug,
}: JournalDetailClientProps) {
  // 1. Fetch Journal Content
  const { data: journal, isLoading: journalLoading } =
    useGetJournalBySlugQuery(slug);

  // 2. Fetch Related Journals (same category, excluding current)
  const { data: allJournalsData } = useGetJournalsQuery({});

  const allJournals = allJournalsData?.journals ?? [];

  const relatedJournals = useMemo(() => {
    if (!allJournals.length || !journal) return [];
    return allJournals
      .filter(
        (j: any) => j._id !== journal._id && j.category === journal.category,
      )
      .slice(0, 3);
  }, [allJournals, journal]);

  // 3. Fetch Related Properties (using the sector/city from the journal)
  const { data: relatedProps, isLoading: propsLoading } =
    useGetAllPropertiesQuery(
      {
        search: journal?.targetSector,
        limit: 3,
      },
      { skip: !journal?.targetSector },
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
            <Text size="sm">PropertyBulbul Editorial</Text>
          </Group>
        </Group>

        <div className="w-full rounded-md overflow-hidden">
          <img
            src={
              journal.coverImage ||
              "https://images.unsplash.com/photo-1590066305974-26999a08ec40?q=80&w=1200"
            }
            alt={journal.title}
            className="w-full h-auto block"
          />
        </div>

        {/* Render journal content as markdown with responsive Tailwind styling */}
        <div className="w-full max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                  {...props}
                />
              ),
              h1: ({ node, ...props }) => (
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold my-4 sm:my-6"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold my-3 sm:my-5 border-b pb-2"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-semibold my-3 sm:my-4"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-sm sm:text-base text-gray-700 leading-relaxed my-3 sm:my-4"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc ml-4 sm:ml-6 my-3 sm:my-4 space-y-1 sm:space-y-2"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-sm sm:text-base text-gray-700" {...props} />
              ),
            }}
          >
            {ensureMarkdownSpacing(journal.content)}
          </ReactMarkdown>
        </div>

        <Divider my={50} label="Related Listings" labelPosition="center" />

        {/* Real-time Properties from the same Sector */}
        <div>
          <Title order={2} mb="xl" ta="center" className="text-xl sm:text-2xl">
            Properties in {journal.targetSector || "this area"}
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedProperties?.map((prop: any) => (
              <PropertyCard key={prop._id} card={prop} />
            ))}
            {!propsLoading && relatedProperties?.length === 0 && (
              <div className="col-span-full">
                <Text ta="center" c="dimmed">
                  No active listings in this sector currently.
                </Text>
              </div>
            )}
          </div>
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
            Ready to move to {journal.targetSector}?
          </Title>
          <Text mb="xl" size="sm" className="sm:text-base">
            Browse our full list of verified properties in this locality.
          </Text>
          <Button
            size="md"
            radius="md"
            color="#4161df"
            component={Link}
            href={`/properties?sector=${journal.targetSector}`}
            className="w-full sm:w-auto"
          >
            Explore All Listings
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
}
