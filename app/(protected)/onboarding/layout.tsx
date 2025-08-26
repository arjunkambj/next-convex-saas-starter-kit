import Logo from "@/components/shared/Logo";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen bg-background">
      {/* LEFT SIDE - Main Content */}

      {/* Header */}
      <div className="flex absolute top-8 left-8 right-8 justify-between items-center">
        <Logo className="text-foreground" />
        <ThemeSwitch />
      </div>

      {/* Form Content */}
      <div className="flex-1 w-3/5 flex items-center justify-center">
        <div className="w-full">{children}</div>
      </div>

      {/* RIGHT SIDE - Image */}
      <div className="w-2/5 relative overflow-hidden bg-gradient-to-br from-primary-900/20 via-content2 to-background dark:from-primary-900/20 dark:via-gray-900 dark:to-black"></div>
    </section>
  );
}
