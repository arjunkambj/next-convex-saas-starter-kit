import UserProfile from "./UserProfile";
import SidebarToggle from "@/components/dashboard/SidebarToggle";
import { Divider } from "@heroui/divider";

interface MainHeaderProps {
  title: string;
}

export default function MainHeader({ title }: MainHeaderProps) {
  return (
    <div className="space-y-6 mb-4">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SidebarToggle />
          <Divider orientation="vertical" className="h-6 mr-1" />
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        </div>
        <UserProfile />
      </div>

      <Divider />
    </div>
  );
}
