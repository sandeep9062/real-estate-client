import {
  Box,
  Container,
  Text,
  Title,
  Stack,
  TextInput,
  Button,
  Group,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import React from "react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      {/* Main Blog Content */}
      <Box component="section" style={{ minHeight: "70vh" }}>
        {children}
      </Box>

      {/* Blog-Specific Footer / Newsletter Section */}
      <Box
        bg="blue.0"
        py={80}
        style={{ borderTop: "1px solid var(--mantine-color-blue-1)" }}
      >
        <Container size="sm">
          <Stack align="center" ta="center" gap="md">
            <IconMail size={40} color="#4161df" />
            <Title order={2} fw={900}>
              Get Tricity Market Updates
            </Title>
            <Text c="dimmed" size="lg">
              Join 500+ local investors and brokers. We send one email a week
              with the best property deals in Mohali and Zirakpur.
            </Text>

            <Group w="100%" gap="xs" mt="md">
              <TextInput
                placeholder="Enter your email"
                size="lg"
                radius="md"
                style={{ flex: 1 }}
              />
              <Button size="lg" radius="md" color="#4161df">
                Subscribe
              </Button>
            </Group>

            <Text size="xs" c="dimmed">
              No spam. Just local market insights. Unsubscribe anytime.
            </Text>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
