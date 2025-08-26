"use client";

import React, { useEffect } from "react";
import { Button, Input, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import {
  useCreateOrganization,
  useOnboardingStatus,
} from "@/hooks/useOnboarding";
import { useCurrentUser } from "@/hooks/useUser";

export default function OrganizationForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ name?: string }>({});
  const [isEditMode, setIsEditMode] = React.useState(false);

  const createOrganization = useCreateOrganization();
  const onboardingStatus = useOnboardingStatus();
  const user = useCurrentUser();

  // Handle form data population
  useEffect(() => {
    // Populate form with existing organization data if available
    if (onboardingStatus?.organization) {
      setIsEditMode(true);
      if (!name) {  // Only set if not already set to avoid overwriting user edits
        setName(onboardingStatus.organization.name);
      }
    }
  }, [onboardingStatus, name]);

  // Only check for user, not onboardingStatus
  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors({ name: undefined });
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Organization name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await createOrganization({
        name: name.trim(),
      });

      if (result.success) {
        addToast({
          title: isEditMode ? "Organization updated" : "Organization created",
          description: isEditMode 
            ? "Your organization has been updated successfully"
            : "Your organization has been created successfully",
          color: "success",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push("/onboarding/invite-team" as any);
      }
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create organization",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-default-700 mb-2 block">
            Name
          </label>
          <Input
            placeholder="Acme Inc."
            value={name}
            onValueChange={handleNameChange}
            isInvalid={!!errors.name}
            errorMessage={errors.name}
            description="This is the name that will be displayed to your team members."
            classNames={{
              input: "text-sm",
              description: "text-xs",
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-default-700 mb-2 block">
            Logo
          </label>
          <div className="border-2 border-dashed border-default-200 rounded-lg p-8 text-center hover:border-default-300 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-default-100 flex items-center justify-center">
                <Icon
                  icon="solar:camera-add-linear"
                  width={24}
                  className="text-default-500"
                />
              </div>
              <p className="text-sm text-default-500">
                Drag and drop or click to select an image
              </p>
              <p className="text-xs text-default-400">Maximum size: 2 MB</p>
              <p className="text-xs text-warning-500">(TODO: Image upload)</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        color="primary"
        className="w-full mt-4"
        isLoading={isLoading}
      >
        {isEditMode ? "Update & Continue" : "Create Organization"}
      </Button>
    </form>
  );
}
