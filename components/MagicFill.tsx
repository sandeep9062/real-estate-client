"use client";
import React, { useState } from "react";
import {
  Button,
  Textarea,
  Group,
  Text,
  Paper,
  Badge,
  Loader,
  Stack,
} from "@mantine/core";
import { Sparkles, Wand2, Info } from "lucide-react";
import { useMagicFillMutation } from "@/services/aiBasedApi";

interface MagicFillProps {
  nextStep: () => void;
  propertyDetails: any;
  setPropertyDetails: React.Dispatch<React.SetStateAction<any>>;
}

const MagicFill = ({
  nextStep,
  propertyDetails,
  setPropertyDetails,
}: MagicFillProps) => {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicFill, { isLoading }] = useMagicFillMutation();

  // Parse plain text response from AI
  const parsePlainTextResponse = (text: string) => {
    const lines = text.split("\n");
    const data: any = {};

    lines.forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      const value = valueParts.join(":").trim();

      if (key && value) {
        const keyLower = key.toLowerCase().trim();

        // Map keys to property structure
        if (keyLower.includes("title") || keyLower.includes("project")) {
          data.title = value;
        } else if (keyLower.includes("description")) {
          data.description = value;
        } else if (keyLower.includes("price") || keyLower.includes("amount")) {
          data.price = parseInt(value.replace(/[^0-9]/g, ""));
        } else if (keyLower.includes("deal") || keyLower.includes("type")) {
          data.deal = value;
        } else if (
          keyLower.includes("location") ||
          keyLower.includes("address")
        ) {
          data.location = {
            ...propertyDetails.location,
            address: value,
            city: propertyDetails.location.city,
            state: propertyDetails.location.state,
          };
        } else if (keyLower.includes("area") || keyLower.includes("sqft")) {
          data.area = {
            value: parseInt(value.replace(/[^0-9]/g, "")),
            unit: "sqft",
          };
        } else if (keyLower.includes("facing")) {
          data.facing = value;
        } else if (keyLower.includes("bedrooms") || keyLower.includes("bhk")) {
          data.facilities = {
            ...propertyDetails.facilities,
            bedrooms: parseInt(value.replace(/[^0-9]/g, "")),
          };
        } else if (keyLower.includes("bathrooms")) {
          data.facilities = {
            ...data.facilities,
            ...propertyDetails.facilities,
            bathrooms: parseInt(value.replace(/[^0-9]/g, "")),
          };
        } else if (keyLower.includes("parking")) {
          data.facilities = {
            ...data.facilities,
            ...propertyDetails.facilities,
            parkings: parseInt(value.replace(/[^0-9]/g, "")),
          };
        }
      }
    });

    return data;
  };

  const handleAiMagic = async () => {
    if (!rawText.trim()) return;
    setLoading(true);

    try {
      const result = await magicFill(rawText).unwrap();

      console.log(result, "ai-result");
      if (result.success && result.data) {
        const aiData = result.data;

        setPropertyDetails((prev: any) => ({
          ...prev,
          title: aiData.title || prev.title,
          description: aiData.description || prev.description,
          price: aiData.price || prev.price,
          // Merge nested objects carefully
          location: {
            ...prev.location,
            ...aiData.location,
          },
          facilities: {
            ...prev.facilities,
            ...aiData.facilities,
          },
          area: {
            ...prev.area,
            ...aiData.area,
          },
        }));

        nextStep(); // Move to the next screen to see the filled data
      }
    } catch (error) {
      console.error("AI Extraction failed:", error);
      // Optional: Add a toast notification here for the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <Stack gap="lg">
        {/* Info Banner */}
        <Paper
          p="md"
          withBorder
          className="bg-blue-50/50 border-blue-100 rounded-2xl"
        >
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <Sparkles size={24} className="text-blue-500" />
              <Text fw={800} size="lg" className="text-blue-900 tracking-tight">
                AI MAGIC FILL
              </Text>
            </Group>
          </Group>
          <Text size="sm" c="dimmed" fw={500}>
            Save time! Paste your property notes, WhatsApp descriptions, or
            rough drafts. Our AI will automatically identify the City, Price,
            Features and all other details..
          </Text>
        </Paper>

        {/* Massive Textarea Container */}
        <Textarea
          placeholder="Example: 3BHK Apartment in SBP City of Dreams, Sector 115, Mohali. 1500 sqft area, North facing, 2nd floor. Price is 45 Lakhs. 3 bedrooms, 3 bathrooms, and 1 car parking included..."
          label={
            <Text fw={700} size="sm" mb={5} c="gray.7">
              PASTE PROPERTY DETAILS BELOW
            </Text>
          }
          // --- HEIGHT & SIZE ADJUSTMENTS ---
          minRows={8} // Tall initial height
          autosize // Allows it to grow further if they paste a huge list
          maxRows={25} // Caps it to keep the modal scrollable
          styles={{
            input: {
              fontSize: "14px", // Better for reading long text
              padding: "20px",
              lineHeight: "1.6",
              borderRadius: "16px",
              backgroundColor: "#fff",
              border: "2px solid #e9ecef",
              "&:focus": {
                borderColor: "#4161df",
              },
            },
          }}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          disabled={loading}
        />

        {/* Action Buttons */}
        <Group justify="space-between">
          <Button
            variant="subtle"
            color="#4161df"
            onClick={nextStep}
            size="md"
            radius="md"
          >
            Skip, I'll fill manually
          </Button>

          <Button
            onClick={handleAiMagic}
            loading={loading}
            disabled={!rawText}
            size="md"
            radius="md"
            leftSection={!loading && <Wand2 size={18} />}
            className="bg-[#4161df] hover:bg-[#3a56c4] shadow-xl shadow-blue-100 px-8"
          >
            {loading ? "Analyzing your text..." : "Start Magic Fill ✨"}
          </Button>
        </Group>

        <Text size="xs" c="dimmed" ta="center" mt="sm">
          Tip: More details (Price, Sector, Sqft) help the AI perform better.
        </Text>

        <Text size="xs" c="dimmed" fs="italic" ta="center">
          Powered by Property Bulbul
        </Text>
      </Stack>
    </div>
  );
};

export default MagicFill;
