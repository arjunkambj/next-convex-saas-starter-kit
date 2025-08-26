"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useOnboardingStatus() {
  return useQuery(api.core.onboarding.getOnboardingStatus);
}

export function useCreateOrganization() {
  return useMutation(api.core.onboarding.createOrganization);
}

export function useUpdateOnboardingStep() {
  return useMutation(api.core.onboarding.updateOnboardingStep);
}

export function useCompleteOnboarding() {
  return useMutation(api.core.onboarding.completeOnboarding);
}

export function useSkipOnboardingStep() {
  return useMutation(api.core.onboarding.skipOnboardingStep);
}

export function useResetOnboarding() {
  return useMutation(api.core.onboarding.resetOnboarding);
}