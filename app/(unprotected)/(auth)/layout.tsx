import Logo from "@/components/shared/Logo";
import AuthRightSide from "@/components/auth/AuthRightSide";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is already authenticated
  const token = await convexAuthNextjsToken();
  if (token) {
    // User has a token, redirect to overview
    redirect("/overview");
  }

  return (
    <section className="relative flex min-h-dvh w-full px-4 md:px-6 lg:px-8 items-center justify-center">
      <Logo className="absolute left-4 top-6 z-10 flex" />
      <div className="flex w-full items-center justify-center p-8 lg:w-4/7">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <AuthRightSide className="hidden w-3/7 border border-divider lg:flex" />
    </section>
  );
}
