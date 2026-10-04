"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useGetPropertyBrochureQuery } from "@/services/propertiesApi";

interface BrochureDownloadButtonProps {
  propertyId: string;
  propertyTitle?: string;
  className?: string;
}

const BrochureDownloadButton: React.FC<BrochureDownloadButtonProps> = ({
  propertyId,
  propertyTitle = "Property",
  className,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const {
    data: brochureData,
    isLoading,
    error,
  } = useGetPropertyBrochureQuery(
    propertyId,
    { skip: true }, // Skip by default, only fetch when needed
  );

  const handleDownloadBrochure = async () => {
    // Brochure download is gated — only logged-in users can download.
    if (!isAuthenticated) {
      toast.error("Please log in to download the brochure");
      router.push("/login");
      return;
    }

    try {
      setIsDownloading(true);

      // Use fetch directly to get the brochure
      // Get the API URL from the same logic used in propertiesApi
      const getApiUrl = () => {
        // First priority: Environment variable
        if (process.env.NEXT_PUBLIC_API_URL) {
          return process.env.NEXT_PUBLIC_API_URL;
        }

        // Second priority: Detect production environment (client-side only)
        if (typeof window !== "undefined") {
          const hostname = window.location.hostname;

          // If on production domain, use api.propertybulbul.com backend URL
          if (
            hostname === "www.propertybulbul.com" ||
            hostname === "propertybulbul.com"
          ) {
            return "https://api.propertybulbul.com/api";
          }
        }

        // Default: localhost for development
        return "http://localhost:9000/api";
      };

      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/properties/${propertyId}/download-brochure`,
        {
          // Brochure download is auth-protected server-side — send the
          // HTTP-only auth cookie with the request.
          credentials: "include",
        },
      );

      // Session expired / not authenticated server-side — send to login.
      if (response.status === 401) {
        toast.error("Please log in to download the brochure");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to fetch brochure: ${response.status} ${response.statusText}`,
        );
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${propertyTitle.replace(/\s+/g, "_")}_Brochure.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
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
    <Button
      onClick={handleDownloadBrochure}
      disabled={isDownloading}
      className={`
        font-semibold
        transition-colors duration-150
        disabled:cursor-not-allowed disabled:opacity-60
        ${className}
      `}
      size="lg"
    >
      <span className="flex items-center">
        {isDownloading ? (
          <>
            <Download className="mr-2 h-4 w-4" aria-hidden />
            <span>Downloading…</span>
          </>
        ) : (
          <>
            <FileDown className="mr-2 h-4 w-4" aria-hidden />
            <span>Download brochure</span>
          </>
        )}
      </span>
    </Button>
  );
};

export default BrochureDownloadButton;
