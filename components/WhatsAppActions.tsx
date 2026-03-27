import { useState } from "react";
import {
  Group,
  Button,
  Modal,
  TextInput,
  Text,
  Stack,
  Box,
  Alert,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { toast } from "@/hooks/use-toast";
import { Share2, MessageCircle, X, Check } from "lucide-react";
import { useCreateWhatsAppLeadMutation } from "@/services/propertiesApi";
import { useGetPropertyBrochureQuery } from "@/services/propertiesApi";

interface WhatsAppActionsProps {
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  brokerPhone?: string;
  className?: string;
}

const WhatsAppActions: React.FC<WhatsAppActionsProps> = ({
  propertyId,
  propertyTitle,
  propertyCity,
  brokerPhone,
  className,
}) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [createWhatsAppLead] = useCreateWhatsAppLeadMutation();
  const { data: brochureData } = useGetPropertyBrochureQuery(propertyId, {
    skip: true,
  });

  const form = useForm({
    initialValues: {
      userName: "",
      userPhone: "",
    },
    validate: {
      userName: (value) =>
        value.trim().length < 2 ? "Name must be at least 2 characters" : null,
      userPhone: (value) =>
        !/^\d{10}$/.test(value)
          ? "Please enter a valid 10-digit phone number"
          : null,
    },
  });

  const handleShareToWhatsApp = () => {
    setIsSharing(true);

    const message = `Check out this property on PropertyBulbul: ${propertyTitle} in ${propertyCity}. View details & Brochure here: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    setIsSharing(false);
  };

  const handleGetBrochureOnWhatsApp = async (values: typeof form.values) => {
    try {
      const result = await createWhatsAppLead({
        id: propertyId,
        ...values,
      }).unwrap();

      if (result.success && result.data?.brokerPhone) {
        // Open WhatsApp chat with broker
        const message = `Hi, I just viewed ${propertyTitle} on PropertyBulbul. Can you share the details?`;
        const whatsappUrl = `https://wa.me/${result.data.brokerPhone}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
        setModalOpened(false);
        form.reset();

        toast.success("WhatsApp chat opened with broker!");
      }
    } catch (error: any) {
      console.error("Error creating WhatsApp lead:", error);
      toast.error(
        error?.data?.message || "Failed to create lead. Please try again.",
      );
    }
  };

  const handleDownloadBrochure = async () => {
    try {
      setIsDownloading(true);

      // Get the API URL from the same logic used in propertiesApi
      const getApiUrl = () => {
        if (process.env.NEXT_PUBLIC_API_URL) {
          return process.env.NEXT_PUBLIC_API_URL;
        }
        if (typeof window !== "undefined") {
          const hostname = window.location.hostname;
          if (
            hostname === "www.propertybulbul.com" ||
            hostname === "propertybulbul.com"
          ) {
            return "https://api.propertybulbul.com/api";
          }
        }
        return "http://localhost:9000/api";
      };

      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/properties/${propertyId}/download-brochure`,
      );

      if (!response.ok) {
        throw new Error("Failed to download brochure");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${propertyTitle.replace(/\s+/g, "_")}_Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Brochure downloaded successfully!");
    } catch (error) {
      console.error("Error downloading brochure:", error);
      toast.error("Failed to download brochure. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Group className={className} gap="md" justify="center">
        {/* Share to WhatsApp Button */}
        <Button
          leftSection={<Share2 size={18} />}
          onClick={handleShareToWhatsApp}
          loading={isSharing}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
          size="md"
          radius="md"
        >
          Share to WhatsApp
        </Button>

        {/* Get PDF on WhatsApp Button */}
        <Button
          leftSection={<MessageCircle size={18} />}
          onClick={() => setModalOpened(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
          size="md"
          radius="md"
        >
          Get PDF on WhatsApp
        </Button>
      </Group>

      {/* WhatsApp Lead Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Get Brochure on WhatsApp"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Alert color="blue" variant="light">
            <Text size="sm">
              Enter your details to receive the property brochure on WhatsApp
              from our broker.
            </Text>
          </Alert>

          <form onSubmit={form.onSubmit(handleGetBrochureOnWhatsApp)}>
            <Stack gap="md">
              <TextInput
                label="Your Name"
                placeholder="Enter your name"
                {...form.getInputProps("userName")}
                radius="md"
              />

              <TextInput
                label="WhatsApp Number"
                placeholder="Enter 10-digit phone number"
                {...form.getInputProps("userPhone")}
                radius="md"
              />

              <Group justify="space-between" mt="md">
                <Button
                  variant="subtle"
                  onClick={() => setModalOpened(false)}
                  color="gray"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#4161df] hover:bg-#4161df/10"
                  loading={false}
                >
                  Send to WhatsApp
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </>
  );
};

export default WhatsAppActions;
