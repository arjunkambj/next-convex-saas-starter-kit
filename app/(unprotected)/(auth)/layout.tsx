import Logo from "@/components/shared/Logo";
import AuthRightSide from "@/components/auth/AuthRightSide";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-dvh w-full px-4 md:px-6 lg:px-8 items-center justify-center">
      <Logo className="absolute left-4 top-6 z-10 flex" />
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <AuthRightSide className="hidden w-1/2 border border-divider lg:flex" />
    </section>
  );
}
