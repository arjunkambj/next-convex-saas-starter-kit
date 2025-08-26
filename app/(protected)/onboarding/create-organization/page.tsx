import OnboardingCard from "@/components/onboarding/OnboardingCard";
import OrganizationForm from "@/components/onboarding/OrganizationForm";

export default function CreateOrganizationPage() {
  return (
    <OnboardingCard
      title="Create an Organization"
      subtitle="Set up your space to get started"
    >
      <OrganizationForm />
    </OnboardingCard>
  );
}