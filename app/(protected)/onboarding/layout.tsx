import Logo from "@/components/shared/Logo";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import AuthRedirect from "@/components/shared/AuthRedirect";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Check if user is NOT onboarded, redirect to /overview if already onboarded */}
      <AuthRedirect requireOnboarded={false} />
      
      <section className="flex min-h-screen bg-background">
      {/* LEFT SIDE - Main Content */}
      <div className="flex-1 w-3/5 relative">
        {/* Header */}
        <div className="flex absolute top-8 left-8 right-8 justify-between items-center z-10">
          <Logo className="text-foreground" />
          <ThemeSwitch />
        </div>

        {/* Progress Indicator - Positioned at top center */}
        <div className="absolute top-24 left-0 right-0 flex justify-center z-10">
          <OnboardingProgress />
        </div>

        {/* Form Content */}
        <div className="flex h-full items-center justify-center pt-20">
          <div className="w-full">{children}</div>
        </div>
      </div>

      {/* RIGHT SIDE - Image */}
      <div className="w-2/5 relative overflow-hidden bg-gradient-to-br from-primary-900/20 via-content2 to-background dark:from-primary-900/20 dark:via-gray-900 dark:to-black"></div>
      </section>
    </>
  );
}
