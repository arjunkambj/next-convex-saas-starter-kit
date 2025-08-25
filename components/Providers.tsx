"use client";

import { HeroUIProvider } from "@heroui/react";
import { ConvexClientProvider } from "@/components/shared/ConvexClientProvider";
import { Provider } from "jotai";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ConvexClientProvider>
        <ConvexQueryCacheProvider>
          <Provider>{children}</Provider>
        </ConvexQueryCacheProvider>
      </ConvexClientProvider>
    </HeroUIProvider>
  );
}
