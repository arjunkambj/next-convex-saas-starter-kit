import { ThemeSwitch } from "@/components/shared/ThemeSwitch";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ThemeSwitch />
      {children}
    </div>
  );
}
