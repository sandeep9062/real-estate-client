"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileDown } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);
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
      );

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative overflow-hidden
        bg-gradient-to-br from-[#4161df] via-blue-700 to-indigo-800
        hover:from-[#4161df] hover:via-blue-800 hover:to-indigo-900
        text-white font-semibold tracking-wide
        shadow-lg hover:shadow-xl
        transform hover:scale-105 transition-all duration-300
        border border-white/20 hover:border-white/40
        before:absolute before:inset-0 before:bg-white/0 
        before:transition-all before:duration-300
        hover:before:bg-white/10
        after:absolute after:inset-0 after:bg-gradient-to-t 
        after:from-transparent after:via-white/5 after:to-transparent
        after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
        focus-visible:ring-4 focus-visible:ring-blue-300/50 dark:focus-visible:ring-blue-400/30
        disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100
        disabled:hover:shadow-lg
        ${className}
      `}
      size="lg"
    >
      {/* Animated background shimmer effect */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
        transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-1000 ease-out
        opacity-0 group-hover:opacity-100
      `}
      />

      {/* Content */}
      <div className="relative flex items-center z-10">
        {isDownloading ? (
          <>
            <Download className="mr-3 h-5 w-5 animate-spin transition-transform duration-200 group-hover:scale-110" />
            <span className="tracking-wide text-white ">
              Downloading Brochure...
            </span>
          </>
        ) : (
          <>
            <FileDown className="mr-3 text-white h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
            <span className="tracking-wide text-white">Download Brochure</span>
          </>
        )}
      </div>

      {/* Download progress overlay */}
      {isDownloading && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-pulse w-full" />
      )}
    </Button>
  );
};

export default BrochureDownloadButton;
