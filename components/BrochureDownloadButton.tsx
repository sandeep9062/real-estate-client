"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
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
  const {
    data: brochureData,
    isLoading,
    error,
  } = useGetPropertyBrochureQuery(
    propertyId,
    { skip: true }, // Skip by default, only fetch when needed
  );

  const handleDownloadBrochure = async () => {
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

          // If on production domain, use Render backend URL
          if (
            hostname === "www.propertybulbul.com" ||
            hostname === "propertybulbul.com"
          ) {
            return "https://real-estate-server-6pzl.onrender.com/api";
          }
        }

        // Default: localhost for development
        return "http://localhost:9000/api";
      };

      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/properties/${propertyId}/download-brochure`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch brochure");
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
      className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium ${className}`}
      size="lg"
    >
      {isDownloading ? (
        <>
          <Download className="mr-2 h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Download Brochure
        </>
      )}
    </Button>
  );
};

export default BrochureDownloadButton;
