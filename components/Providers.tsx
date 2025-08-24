"use client";

import { HeroUIProvider } from "@heroui/react";
import { ConvexClientProvider } from "@/components/shared/ConvexClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </HeroUIProvider>
  );
}
