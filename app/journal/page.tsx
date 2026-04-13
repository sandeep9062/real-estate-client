"use client";

import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Image,
  Badge,
  Group,
  Stack,
  Skeleton,
  Center,
  Box,
  Transition,
} from "@mantine/core";
import { useGetJournalsQuery } from "@/services/journalApi";
import Link from "next/link";
import { IconCalendar, IconArrowRight, IconBook } from "@tabler/icons-react";

export default function BlogListingPage() {
  const { data: journals, isLoading, isError } = useGetJournalsQuery({});

  // Loading State with matching uneven skeletons
  if (isLoading) {
    return (
      <Container size="fluid" py={80} px={{ base: 2, md: 3, lg: 4 }}>
        <Grid gutter="xs">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Skeleton height={450} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Skeleton height={450} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Skeleton height={350} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Skeleton height={350} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Skeleton height={350} radius="md" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (isError) {
    return (
      <Center h={400}>
        <Stack align="center">
          <Text size="xl" fw={700} c="red">
            Failed to load the Journal.
          </Text>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Text c="#4161df" fw={500}>
              Return to Home
            </Text>
          </Link>
        </Stack>
      </Center>
    );
  }

  return (
    <Box component="main" py={100} bg="gray.0" style={{ minHeight: "100vh" }}>
      <Container size="fluid" px={{ base: 2, md: 3, lg: 4 }}>
        {/* Editorial Header */}
        <Stack align="center" mb={70} gap="xs">
          <Group gap={8}>
            <IconBook size={20} color="#4161df" />
            <Text fw={700} tt="uppercase" lts={2} size="sm" c="#4161df">
              Insights & Intelligence
            </Text>
          </Group>
          <Title order={1} size="3.2rem" fw={900} ta="center" lh={1.1}>
            The PropertyBulbul{" "}
            <Text component="span" c="#4161df" inherit>
              Journal
            </Text>
          </Title>
          <Text c="dimmed" ta="center" maw={700} size="lg" mt="sm">
            Expert analysis of the Tricity market. We turn complex data into
            clear guides for Chandigarh, Mohali, and Zirakpur investors.
          </Text>
        </Stack>

        {/* Dynamic Uneven Grid */}
        <Grid gutter="xs">
          {journals?.map((post: any, index: number) => {
            // Logic for uneven spans:
            // 1st item = Huge (8/12), 2nd item = Normal (4/12)
            // 3rd item = Normal (4/12), 4th item = Wide (8/12)
            // Pattern repeats or follows a logic:
            const isFeatured = index === 0;
            const isWide = index === 3 || index === 6; // Adds variety further down

            return (
              <Grid.Col
                key={post._id}
                span={{ base: 12, md: isFeatured || isWide ? 8 : 4 }}
              >
                <Card
                  component={Link}
                  href={`/journal/${post.slug}`}
                  shadow="sm"
                  padding={isFeatured ? "xl" : "lg"}
                  radius="lg"
                  withBorder
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    border: "1px solid var(--mantine-color-gray-2)",
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "var(--mantine-shadow-xl)",
                        borderColor: "#4161df",
                      },
                    },
                  }}
                >
                  <Card.Section style={{ overflow: "hidden" }}>
                    <Image
                      src={
                        post.coverImage ||
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800"
                      }
                      height={isFeatured ? 400 : 220}
                      alt={post.title}
                      fallbackSrc="https://placehold.co/800x600?text=PropertyBulbul+Insights"
                      style={{
                        transition: "transform 0.6s ease",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    />
                  </Card.Section>

                  <Stack mt="xl" gap="md" style={{ flexGrow: 1 }}>
                    <Group justify="space-between">
                      <Badge bg="#4161df" size="lg" radius="sm">
                        {post.category || "Locality Guide"}
                      </Badge>
                      <Group gap={5}>
                        <IconCalendar size={16} color="gray" />
                        <Text size="sm" c="dimmed" fw={500}>
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </Text>
                      </Group>
                    </Group>

                    <Title
                      order={isFeatured ? 2 : 3}
                      size={isFeatured ? "2rem" : "1.4rem"}
                      fw={800}
                      lh={1.2}
                    >
                      {post.title}
                    </Title>

                    <Text
                      size={isFeatured ? "md" : "sm"}
                      c="dimmed"
                      lineClamp={isFeatured ? 3 : 2}
                      style={{ lineHeight: 1.6 }}
                    >
                      {post.excerpt ||
                        post.description?.substring(0, 160) + "..."}
                    </Text>

                    <Group mt="auto" pt="md" justify="space-between">
                      <Text fw={700} c="#4161df" size="sm">
                        Read Full Analysis
                      </Text>
                      <IconArrowRight size={18} color="#4161df" />
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>

        {/* Empty State */}
        {journals?.length === 0 && (
          <Center py={100}>
            <Stack align="center" gap={0}>
              <Text size="xl" fw={700} c="dimmed">
                Our editors are writing...
              </Text>
              <Text c="dimmed">
                New market insights for Tricity coming soon.
              </Text>
            </Stack>
          </Center>
        )}
      </Container>
    </Box>
  );
}
