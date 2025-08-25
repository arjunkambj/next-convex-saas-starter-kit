"use client";

import { HeroUIProvider } from "@heroui/react";
import { ConvexClientProvider } from "@/components/shared/ConvexClientProvider";
import { Provider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ConvexClientProvider>
        <Provider>{children}</Provider>
      </ConvexClientProvider>
    </HeroUIProvider>
  );
}
