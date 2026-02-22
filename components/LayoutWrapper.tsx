"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "./Header";
import Footer from "./Footer";
import SocialMediaLinks from "./SocialMediaLinks";
import ScrollToTopButton from "./ScrollToTopButton";

// Lazy load the chatbot - it's heavy and not immediately needed
const ClientChatBotWrapper = dynamic(() => import("./ClientChatBotWrapper"), {
  ssr: false,
  loading: () => null,
});

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Memoize the route check to prevent recalculation
  const shouldHideHeaderFooter = useMemo(() => {
    const hideHeaderFooterRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ];
    return hideHeaderFooterRoutes.some((route) => pathname?.startsWith(route));
  }, [pathname]);

  if (shouldHideHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <SocialMediaLinks />
      <Footer />
      <ScrollToTopButton />
      <ClientChatBotWrapper />
    </>
  );
}
