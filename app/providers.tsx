"use client";

import { MantineProvider } from "@mantine/core";
import { StoreProvider } from "../store/StoreProvider";
import { BetterAuthProvider } from "@/components/BetterAuthProvider";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <StoreProvider>
        <BetterAuthProvider>
          {children}
        </BetterAuthProvider>
      </StoreProvider>
    </MantineProvider>
  );
}
