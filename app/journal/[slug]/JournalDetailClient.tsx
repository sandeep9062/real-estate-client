"use client";

import ReactMarkdown from "react-markdown";
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
import { useGetJournalBySlugQuery } from "@/services/journalApi";
import { useGetProjectsQuery } from "@/services/projectsApi";
import {
  IconCalendar,
  IconUser,
  IconArrowLeft,
  IconHome,
} from "@tabler/icons-react";
import Link from "next/link";

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

  // 2. Fetch Related Properties (using the sector/city from the journal)
  const { data: relatedProps, isLoading: propsLoading } = useGetProjectsQuery(
    { sector: journal?.targetSector, limit: 3 },
    { skip: !journal?.targetSector },
  );

  if (journalLoading)
    return (
      <Container size="xl" py={100} px={{ base: 8, md: 12, lg: 16 }}>
        <Skeleton height={400} radius="md" />
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
    <Container size="xl" py={80} px={{ base: 8, md: 12, lg: 16 }}>
      <Button
        component={Link}
        href="/journal"
        color="#4161df"
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        mb="xl"
      >
        Back to Insights
      </Button>

      <Stack gap="lg">
        <Badge size="lg" variant="filled" color="#4161df">
          {journal.category}
        </Badge>

        <Title order={1} size="42px" fw={900} style={{ lineHeight: 1.1 }}>
          {journal.title}
        </Title>

        <Group gap="xl" c="dimmed">
          <Group gap={5}>
            <IconCalendar size={18} />
            <Text size="sm">
              {new Date(journal.createdAt).toLocaleDateString("en-IN")}
            </Text>
          </Group>
          <Group gap={5}>
            <IconUser size={18} />
            <Text size="sm">PropertyBulbul Editorial</Text>
          </Group>
        </Group>

        <Image
          src={
            journal.coverImage ||
            "https://images.unsplash.com/photo-1590066305974-26999a08ec40?q=80&w=1200"
          }
          radius="md"
          alt={journal.title}
          h={400}
        />

        {/* Render journal content as markdown with Tailwind Typography */}
        {/* prose-slate = color theme, max-w-none = prevent width restriction */}
        {/* prose-headings:font-bold ensures bold headings, prose-p:my-4 ensures paragraph spacing, prose-li:my-2 ensures list item spacing */}
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4 prose-p:my-4 prose-li:my-2 prose-ul:my-4 prose-ol:my-4 prose-strong:font-bold prose-strong:text-gray-900">
          <ReactMarkdown>
            {ensureMarkdownSpacing(journal.content)}
          </ReactMarkdown>
        </div>

        <Divider my={50} label="Related Listings" labelPosition="center" />

        {/* Real-time Properties from the same Sector */}
        <div>
          <Title order={2} mb="xl" ta="center">
            Properties in {journal.targetSector || "this area"}
          </Title>
          <Stack gap="md">
            {relatedProps?.map((prop: any) => (
              <Paper key={prop._id} withBorder p="md" radius="md">
                <Group justify="space-between">
                  <Stack gap={0}>
                    <Text fw={700} size="lg">
                      {prop.title}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {prop.location.address}
                    </Text>
                  </Stack>
                  <Button
                    variant="light"
                    component={Link}
                    color="#4161df"
                    href={`/projects/${prop.slug}`}
                  >
                    View Details
                  </Button>
                </Group>
              </Paper>
            ))}
            {!propsLoading && relatedProps?.length === 0 && (
              <Text ta="center" c="dimmed">
                No active listings in this sector currently.
              </Text>
            )}
          </Stack>
        </div>

        <Paper bg="#4161df10" p="xl" radius="md" mt={60} ta="center">
          <IconHome size={40} color="#4161df" />
          <Title order={3} mt="md">
            Ready to move to {journal.targetSector}?
          </Title>
          <Text mb="xl">
            Browse our full list of verified properties in this locality.
          </Text>
          <Button
            size="lg"
            radius="md"
            color="#4161df"
            component={Link}
            href={`/properties?sector=${journal.targetSector}`}
          >
            Explore All Listings
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
}
