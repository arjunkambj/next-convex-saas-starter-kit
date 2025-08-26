/**
 * Onboarding flow utilities
 */

export const ONBOARDING_STEPS = {
  CREATE_ORGANIZATION: 1,
  INVITE_TEAM: 2,
  OVERVIEW: 3,
} as const;

export const ONBOARDING_ROUTES = {
  [ONBOARDING_STEPS.CREATE_ORGANIZATION]: "/onboarding/create-organization",
  [ONBOARDING_STEPS.INVITE_TEAM]: "/onboarding/invite-team",
  [ONBOARDING_STEPS.OVERVIEW]: "/onboarding/overview",
} as const;

/**
 * Get the appropriate route based on onboarding step
 */
export function getOnboardingRoute(
  step: number | undefined,
  isCompleted: boolean | undefined,
  isOnboarded: boolean | undefined
): string {
  // If user is fully onboarded, go to main overview
  if (isOnboarded || isCompleted) {
    return "/overview";
  }

  // Default to step 1 if no step is provided
  const currentStep = step || ONBOARDING_STEPS.CREATE_ORGANIZATION;
  
  // Ensure step is within valid range
  if (currentStep < ONBOARDING_STEPS.CREATE_ORGANIZATION) {
    return ONBOARDING_ROUTES[ONBOARDING_STEPS.CREATE_ORGANIZATION];
  }
  
  if (currentStep > ONBOARDING_STEPS.OVERVIEW) {
    return ONBOARDING_ROUTES[ONBOARDING_STEPS.OVERVIEW];
  }
  
  return ONBOARDING_ROUTES[currentStep as keyof typeof ONBOARDING_ROUTES] || ONBOARDING_ROUTES[1];
}

/**
 * Check if user should be on a specific step
 */
export function shouldBeOnStep(
  currentStep: number | undefined,
  expectedStep: number
): boolean {
  return (currentStep || 1) === expectedStep;
}

/**
 * Get next step in onboarding
 */
export function getNextStep(currentStep: number): number | null {
  if (currentStep >= ONBOARDING_STEPS.OVERVIEW) {
    return null; // Onboarding complete
  }
  return currentStep + 1;
}

/**
 * Get previous step in onboarding
 */
export function getPreviousStep(currentStep: number): number | null {
  if (currentStep <= ONBOARDING_STEPS.CREATE_ORGANIZATION) {
    return null; // Already at first step
  }
  return currentStep - 1;
}