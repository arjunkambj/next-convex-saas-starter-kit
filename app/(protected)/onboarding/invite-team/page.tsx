import OnboardingCard from "@/components/onboarding/OnboardingCard";
import TeamInviteForm from "@/components/onboarding/TeamInviteForm";

export default function InviteTeamPage() {
  return (
    <OnboardingCard
      title="Invite your Team"
      subtitle="Collaborate with your team members"
    >
      <TeamInviteForm />
    </OnboardingCard>
  );
}