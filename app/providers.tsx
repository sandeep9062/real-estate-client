"use client";

import { MantineProvider } from "@mantine/core";
import { StoreProvider } from "../store/StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
        <MantineProvider>
          <StoreProvider>{children}</StoreProvider>
        </MantineProvider>
      </GoogleReCaptchaProvider>
    </GoogleOAuthProvider>
  );
}
