"use client";

import React, { useState, useMemo } from "react";
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Badge,
  Group,
  Stack,
  Skeleton,
  Center,
  Box,
  Overlay,
  TextInput,
  SegmentedControl,
} from "@mantine/core";
import { useGetJournalsQuery } from "@/services/journalApi";
import Link from "next/link";
import {
  IconCalendar,
  IconArrowRight,
  IconClock,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";

export default function BlogListingPage() {
  const { data: journals, isLoading, isError } = useGetJournalsQuery({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredJournals = useMemo(() => {
    if (!journals) return [];
    return journals
      .filter((post: any) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          activeCategory === "All" || post.category === activeCategory;
        return matchesSearch && matchesCategory;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [journals, searchQuery, activeCategory]);

  const categories = useMemo(() => {
    if (!journals) return ["All"];
    const unique = Array.from(
      new Set(journals.map((j: any) => j.category).filter(Boolean)),
    );
    return ["All", ...unique];
  }, [journals]);

  if (isLoading) {
    return (
      <Container size="xl" py={60}>
        <Center mb="xl">
          <Skeleton height={45} width={320} radius="xl" />
        </Center>
        {/* Match reduced gutter in skeleton state */}
        <Grid gutter={10}>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Skeleton height={400} radius="20px" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Skeleton height={400} radius="20px" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (isError) {
    return (
      <Center h="70vh" px="md">
        <Stack align="center" gap="sm" ta="center">
          <Title order={3}>Offline</Title>
          <Text c="dimmed">Unable to load PropertyBulbul intelligence.</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box component="main" bg="#fcfcfd" pb={{ base: 40, md: 80 }}>
      <Box pt={{ base: 80, md: 120 }} pb={{ base: 10, md: 10 }}>
        <Container size="xl">
          <Stack align="center" gap={8} mb={{ base: 20, md: 30 }}>
            <Text
              fw={700}
              tt="uppercase"
              lts={1.5}
              size="xs"
              c="blue"
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
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
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
                  onChange={setActiveCategory}
                  data={categories}
                  radius="xl"
                  size="sm"
                  color="blue"
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
        {filteredJournals.length > 0 ? (
          /* GUTTER REDUCED HERE to 10px for a tighter layout */
          <Grid gutter={{ base: "xs", md: 10 }}>
            {filteredJournals.map((post: any, index: number) => {
              const isFiltered = searchQuery !== "" || activeCategory !== "All";
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
                    <Overlay
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.85) 100%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                      }}
                      zIndex={1}
                      p={{ base: "lg", sm: "xl" }}
                    >
                      <Badge
                        color="blue"
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
                    </Overlay>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
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
