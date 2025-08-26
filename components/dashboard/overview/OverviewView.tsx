import MainHeader from "@/components/shared/MainHeader";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

export default function OverviewView() {
  return (
    <div className="flex flex-col gap-1">
      <MainHeader title="Overview" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome back, John!
          </h2>
          <Button
            variant="light"
            size="sm"
            startContent={<Icon icon="lucide:plus" width={16} />}
          >
            New Task
          </Button>
        </div>
      </div>
    </div>
  );
}
