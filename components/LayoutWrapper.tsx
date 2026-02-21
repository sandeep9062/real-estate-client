"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import SocialMediaLinks from "./SocialMediaLinks";
import ScrollToTopButton from "./ScrollToTopButton";
import ClientChatBotWrapper from "./ClientChatBotWrapper";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // List of routes where header and footer should be hidden
  const hideHeaderFooterRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some((route) =>
    pathname?.startsWith(route)
  );

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