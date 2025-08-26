import OnboardingCard from "@/components/onboarding/OnboardingCard";
import OnboardingOverview from "@/components/onboarding/OnboardingOverview";

export default function OverviewPage() {
  return (
    <OnboardingCard
      title="All Set!"
      subtitle="Review your organization setup"
    >
      <OnboardingOverview />
    </OnboardingCard>
  );
}