"use client";

import { MantineProvider } from "@mantine/core";
import { StoreProvider } from "../store/StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <MantineProvider>
        <StoreProvider>{children}</StoreProvider>
      </MantineProvider>
    </GoogleOAuthProvider>
  );
}
