"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useOnboardingStatus } from "@/hooks/useOnboarding";
import { useCurrentUser } from "@/hooks/useUser";
import { getOnboardingRoute } from "@/lib/onboarding";

export default function OnboardingRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const onboardingStatus = useOnboardingStatus();
  const user = useCurrentUser();

  useEffect(() => {
    if (!user) return; // Still loading user

    // If user is already fully onboarded, redirect to main overview
    if (user.isOnboarded) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace("/overview" as any);
      return;
    }

    // If no organization, start from the beginning
    if (!user.organizationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace("/onboarding/create-organization" as any);
      return;
    }

    // Wait for onboarding status to load
    if (onboardingStatus === undefined) return;

    // If no onboarding record exists, create one by going to step 1
    if (!onboardingStatus) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace("/onboarding/create-organization" as any);
      return;
    }

    // Determine the appropriate route based on step
    const route = getOnboardingRoute(
      onboardingStatus.onboardingStep,
      onboardingStatus.isCompleted,
      user.isOnboarded
    );
    
    // Only redirect if we're not already on the correct route
    if (pathname !== route) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(route as any);
    }
  }, [onboardingStatus, user, router, pathname]);

  // Show loading while determining redirect
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-default-500">Setting up your onboarding...</p>
      </div>
    </div>
  );
}