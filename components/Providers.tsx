"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { Provider as JotaiProvider } from "jotai";

import { ConvexClientProvider } from "@/components/shared/ConvexClientProvider";

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ConvexClientProvider>
      <JotaiProvider>
        <HeroUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="system">
            <ConvexQueryCacheProvider>{children} </ConvexQueryCacheProvider>
          </NextThemesProvider>
        </HeroUIProvider>
      </JotaiProvider>
    </ConvexClientProvider>
  );
}
