"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useUser";

interface AuthRedirectProps {
  requireOnboarded?: boolean;
  redirectTo?: string;
}

export default function AuthRedirect({ 
  requireOnboarded = true,
  redirectTo = "/onboarding" 
}: AuthRedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();

  useEffect(() => {
    // Wait for user data to load
    if (user === undefined) return;
    
    // If no user, let auth middleware handle it
    if (!user) return;

    // Check onboarding status
    const isOnboarded = user.isOnboarded || false;
    
    // If we require onboarded user but they're not onboarded
    if (requireOnboarded && !isOnboarded) {
      // Don't redirect if we're already on an onboarding page
      if (!pathname.startsWith("/onboarding")) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.replace(redirectTo as any);
      }
    }
    
    // If we don't require onboarded (e.g., onboarding pages) but user is onboarded
    if (!requireOnboarded && isOnboarded) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace("/overview" as any);
    }
  }, [user, requireOnboarded, redirectTo, router, pathname]);

  // No UI - this is a redirect-only component
  return null;
}