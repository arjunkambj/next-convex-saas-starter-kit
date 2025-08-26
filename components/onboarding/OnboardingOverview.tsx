"use client";

import React from "react";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import {
  useCompleteOnboarding,
  useOnboardingStatus,
} from "@/hooks/useOnboarding";
import { useOrganization } from "@/hooks/useOrganization";

export default function OnboardingOverview() {
  const router = useRouter();
  const completeOnboarding = useCompleteOnboarding();
  const onboardingStatus = useOnboardingStatus();
  const organizationWithMembers = useOrganization();
  const [isLoading, setIsLoading] = React.useState(false);

  // No redirect logic here - handled by OnboardingRedirect component

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      const result = await completeOnboarding();

      if (result.success) {
        addToast({
          title: "Setup complete!",
          description: "Your organization is ready to go",
          color: "success",
        });
        router.push("/overview");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to complete onboarding",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!onboardingStatus || !organizationWithMembers) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  const { organization } = onboardingStatus;
  const { activeMembers, invitedMembers, totalMembers } =
    organizationWithMembers;

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <Card className="border border-success-200 bg-success-50/50 dark:bg-success-100/10">
          <CardBody className="gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-200/20 flex items-center justify-center">
                  <Icon
                    icon="solar:buildings-bold"
                    width={20}
                    className="text-success-600 dark:text-success-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-default-700">
                    Organization Created
                  </p>
                  <p className="text-xs text-default-500">
                    {organization.name}
                  </p>
                </div>
              </div>
              <Icon
                icon="solar:check-circle-bold"
                width={20}
                className="text-success-600"
              />
            </div>
          </CardBody>
        </Card>

        <Card
          className={
            invitedMembers.length > 0
              ? "border border-success-200 bg-success-50/50 dark:bg-success-100/10"
              : ""
          }
        >
          <CardBody className="gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-200/20 flex items-center justify-center">
                  <Icon
                    icon="solar:users-group-two-rounded-bold"
                    width={20}
                    className="text-primary-600 dark:text-primary-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-default-700">
                    Team Members
                  </p>
                  {invitedMembers.length > 0 ? (
                    <>
                      <p className="text-xs text-default-500">
                        {invitedMembers.length} member
                        {invitedMembers.length !== 1 ? "s" : ""} invited
                      </p>
                      <p className="text-xs text-default-400">
                        {activeMembers.length} active, {totalMembers} total
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-default-500">
                      No team members invited
                    </p>
                  )}
                </div>
              </div>
              {invitedMembers.length > 0 && (
                <Icon
                  icon="solar:check-circle-bold"
                  width={20}
                  className="text-success-600"
                />
              )}
            </div>

            {invitedMembers.length > 0 && (
              <div className="mt-2 space-y-1">
                {invitedMembers.slice(0, 3).map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="solar:letter-linear"
                        width={14}
                        className="text-default-400"
                      />
                      <span className="text-default-600">{member.email}</span>
                    </div>
                    <span className="text-default-400 capitalize">
                      {member.role}
                    </span>
                  </div>
                ))}
                {invitedMembers.length > 3 && (
                  <p className="text-xs text-default-400">
                    +{invitedMembers.length - 3} more...
                  </p>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-100/10 dark:to-secondary-100/10 rounded-lg p-4 mt-2">
        <div className="flex items-center gap-3">
          <Icon
            icon="solar:rocket-2-bold"
            width={24}
            className="text-primary-600 dark:text-primary-500"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-default-700">
              Everything is set up!
            </p>
            <p className="text-xs text-default-500">
              Your organization is ready to get started
            </p>
          </div>
        </div>
      </div>

      <Button
        color="primary"
        className="w-full mt-4"
        size="lg"
        onPress={handleComplete}
        isLoading={isLoading}
        startContent={
          !isLoading && <Icon icon="solar:check-circle-bold" width={20} />
        }
      >
        Complete Setup
      </Button>
    </div>
  );
}
