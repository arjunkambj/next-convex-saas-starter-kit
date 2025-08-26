"use client";

import MainHeader from "@/components/shared/MainHeader";
import { Button, Card, CardBody, CardHeader, Divider, Chip, Avatar, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useOverview } from "@/hooks/useOverview";

export default function OverviewView() {
  const { user, organization, isResetting, handleResetOnboarding } = useOverview();

  // Loading state
  if (!user || !organization) {
    return (
      <div className="flex flex-col gap-1">
        <MainHeader title="Overview" />
        <div className="flex-1 space-y-6">
          <Skeleton className="w-full h-32 rounded-lg" />
          <Skeleton className="w-full h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  const getUserRoleDisplay = (role?: string) => {
    const roleMap = {
      clientAdmin: { label: "Admin", color: "primary" },
      manager: { label: "Manager", color: "secondary" },
      member: { label: "Member", color: "default" },
      superAdmin: { label: "Super Admin", color: "danger" },
      oppsDev: { label: "Ops Dev", color: "warning" },
    };
    return roleMap[role as keyof typeof roleMap] || { label: "Unknown", color: "default" };
  };

  const roleInfo = getUserRoleDisplay(user.role);

  return (
    <div className="flex flex-col gap-1">
      <MainHeader title="Overview" />
      
      <div className="flex-1 space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome back, {user.name || "User"}!
          </h2>
          <Button
            variant="light"
            size="sm"
            startContent={<Icon icon="lucide:plus" width={16} />}
          >
            New Task
          </Button>
        </div>

        {/* User Details Card */}
        <Card className="w-full">
          <CardHeader className="flex justify-between items-start">
            <div className="flex gap-4">
              <Avatar
                name={user.name || user.email}
                src={user.image}
                size="lg"
                className="text-large"
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{user.name || "Not set"}</h3>
                <p className="text-sm text-default-500">{user.email || "No email"}</p>
                <Chip
                  size="sm"
                  color={roleInfo.color as "primary" | "secondary" | "default" | "danger" | "warning" | "success"}
                  variant="flat"
                >
                  {roleInfo.label}
                </Chip>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                startContent={<Icon icon="solar:settings-linear" width={16} />}
              >
                Settings
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-default-500 mb-1">Organization</p>
                <p className="text-sm font-medium">{organization.name}</p>
              </div>
              <div>
                <p className="text-xs text-default-500 mb-1">Status</p>
                <Chip size="sm" color="success" variant="flat">
                  {user.status || "Active"}
                </Chip>
              </div>
              <div>
                <p className="text-xs text-default-500 mb-1">Team Members</p>
                <p className="text-sm font-medium">{organization.totalMembers || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Organization Overview Card */}
        <Card className="w-full">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Organization Overview</h3>
            <Icon icon="solar:buildings-bold" width={24} className="text-primary" />
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">Organization Name</span>
                  <span className="text-sm font-medium">{organization.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">Active Members</span>
                  <span className="text-sm font-medium">
                    {organization.activeMembers?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">Invited Members</span>
                  <span className="text-sm font-medium">
                    {organization.invitedMembers?.length || 0}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">Your Role</span>
                  <Chip size="sm" color={roleInfo.color as "primary" | "secondary" | "default" | "danger" | "warning" | "success"} variant="flat">
                    {roleInfo.label}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">Onboarding Status</span>
                  <Chip size="sm" color="success" variant="flat">
                    Completed
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">Account Created</span>
                  <span className="text-sm font-medium">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Onboarding Section */}
            <Divider className="my-4" />
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Reset Onboarding</p>
                <p className="text-xs text-default-500">
                  Start the onboarding process again to update your organization settings
                </p>
              </div>
              <Button
                color="warning"
                variant="flat"
                size="sm"
                isLoading={isResetting}
                onPress={handleResetOnboarding}
                startContent={!isResetting && <Icon icon="solar:restart-linear" width={16} />}
              >
                Reset Onboarding
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <Icon icon="solar:users-group-rounded-bold" width={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Manage Team</p>
                <p className="text-xs text-default-500">Invite or manage members</p>
              </div>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg">
                <Icon icon="solar:settings-bold" width={24} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Settings</p>
                <p className="text-xs text-default-500">Configure preferences</p>
              </div>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-success-100 dark:bg-success-900/20 rounded-lg">
                <Icon icon="solar:chart-square-bold" width={24} className="text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Analytics</p>
                <p className="text-xs text-default-500">View insights</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
