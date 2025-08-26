"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { useCurrentUser } from "./useUser";
import { useOrganization } from "./useOrganization";
import { useResetOnboarding } from "./useOnboarding";

export function useOverview() {
  const router = useRouter();
  const user = useCurrentUser();
  const organization = useOrganization();
  const resetOnboarding = useResetOnboarding();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetOnboarding = async () => {
    setIsResetting(true);
    
    try {
      const result = await resetOnboarding();
      
      if (result.success) {
        addToast({
          title: "Onboarding Reset",
          description: "Redirecting to onboarding setup...",
          color: "success",
        });
        
        // Small delay to show toast
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          router.push("/onboarding" as any);
        }, 500);
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset onboarding",
        color: "danger",
      });
      setIsResetting(false);
    }
  };

  return {
    user,
    organization,
    isResetting,
    handleResetOnboarding,
  };
}