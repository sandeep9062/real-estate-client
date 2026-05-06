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
import { useGetAllPropertiesQuery } from "@/services/propertiesApi";
import {
  IconCalendar,
  IconUser,
  IconArrowLeft,
  IconHome,
} from "@tabler/icons-react";
import PropertyCard from "@/components/PropertyCard";
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
  const { data: relatedProps, isLoading: propsLoading } =
    useGetAllPropertiesQuery(
      {
        search: journal?.targetSector,
        sector: journal?.targetSector,
        limit: 3,
      },
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

        {/* Render journal content as markdown with direct Tailwind styling on each element */}
        <div className="w-full max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-extrabold my-6" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-3xl font-bold my-5 border-b pb-2"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold my-4" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-700 leading-relaxed my-4" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc ml-6 my-4 space-y-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-gray-700" {...props} />
              ),
            }}
          >
            {ensureMarkdownSpacing(journal.content)}
          </ReactMarkdown>
        </div>

        <Divider my={50} label="Related Listings" labelPosition="center" />

        {/* Real-time Properties from the same Sector */}
        <div>
          <Title order={2} mb="xl" ta="center">
            Properties in {journal.targetSector || "this area"}
          </Title>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedProps?.map((prop: any) => (
              <PropertyCard key={prop._id} card={prop} />
            ))}
            {!propsLoading && relatedProps?.length === 0 && (
              <div className="col-span-full">
                <Text ta="center" c="dimmed">
                  No active listings in this sector currently.
                </Text>
              </div>
            )}
          </div>
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
