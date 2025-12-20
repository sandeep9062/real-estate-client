"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LogoSpinner from "./LogoSpinner";

export default function RouteTransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [pathname]);

  if (loading) return <LogoSpinner />;

  return <>{children}</>;
}
