"use client";

import React from "react";
import { Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, m } from "framer-motion";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { useInviteTeamMembers } from "@/hooks/useOrganization";
import {
  useUpdateOnboardingStep,
  useOnboardingStatus,
} from "@/hooks/useOnboarding";
import { useCurrentUser } from "@/hooks/useUser";

interface TeamMember {
  id: string;
  email: string;
  role: "member" | "manager";
}

const roles = [
  { value: "member", label: "Member" },
  { value: "manager", label: "Manager" },
];

export default function TeamInviteForm() {
  const router = useRouter();
  const inviteTeamMembers = useInviteTeamMembers();
  const updateOnboardingStep = useUpdateOnboardingStep();
  const onboardingStatus = useOnboardingStatus();
  const user = useCurrentUser();

  const [members, setMembers] = React.useState<TeamMember[]>([
    { id: "1", email: "", role: "member" },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // No redirect logic here - handled by OnboardingRedirect component

  if (!onboardingStatus || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const addMember = () => {
    setMembers([
      ...members,
      { id: Date.now().toString(), email: "", role: "member" },
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id));
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  const updateMember = (id: string, field: "email" | "role", value: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  const validateEmails = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validMembers = members.filter((m) => m.email.trim() !== "");

    if (validMembers.length === 0) {
      return true;
    }

    validMembers.forEach((member) => {
      if (!emailRegex.test(member.email)) {
        newErrors[member.id] = "Invalid email address";
      }
    });

    const emails = validMembers.map((m) => m.email.toLowerCase());
    const duplicates = emails.filter(
      (email, index) => emails.indexOf(email) !== index
    );
    if (duplicates.length > 0) {
      members.forEach((member) => {
        if (duplicates.includes(member.email.toLowerCase())) {
          newErrors[member.id] = "Duplicate email address";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmails()) {
      return;
    }

    const validMembers = members.filter((m) => m.email.trim() !== "");

    if (validMembers.length === 0) {
      await handleSkip();
      return;
    }

    setIsLoading(true);

    try {
      const result = await inviteTeamMembers({
        members: validMembers.map((m) => ({
          email: m.email.trim(),
          role: m.role,
        })),
      });

      if (result.success) {
        await updateOnboardingStep({ step: 3 }); // Update to step 3 after completing step 2

        if (result.failed.length > 0) {
          addToast({
            title: "Some invites failed",
            description: `Successfully invited ${result.invited} member(s). ${result.failed.length} failed.`,
            color: "warning",
          });
        } else {
          addToast({
            title: "Team invited",
            description: `Successfully invited ${result.invited} team member(s)`,
            color: "success",
          });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push("/onboarding/overview" as any);
      }
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to invite team members",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await updateOnboardingStep({ step: 3 }); // Update to step 3 when skipping step 2
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push("/onboarding/overview" as any);
    } catch {
      addToast({
        title: "Error",
        description: "Failed to skip step",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className={`flex flex-col gap-3 ${members.length > 5 ? 'max-h-[400px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
        <AnimatePresence mode="popLayout">
          {members.map((member) => (
            <m.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex gap-2 items-start shrink-0"
            >
              <Input
                placeholder="email@example.com"
                value={member.email}
                onValueChange={(value) =>
                  updateMember(member.id, "email", value)
                }
                isInvalid={!!errors[member.id]}
                errorMessage={errors[member.id]}
                className="flex-1"
                classNames={{
                  input: "text-sm",
                }}
              />
              <Select
                selectedKeys={[member.role]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  updateMember(member.id, "role", value);
                }}
                className="w-32"
                classNames={{
                  trigger: "h-10",
                }}
              >
                {roles.map((role) => (
                  <SelectItem key={role.value}>{role.label}</SelectItem>
                ))}
              </Select>
              {members.length > 1 && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => removeMember(member.id)}
                  className="min-w-10"
                >
                  <Icon icon="solar:trash-bin-minimalistic-linear" width={16} />
                </Button>
              )}
            </m.div>
          ))}
        </AnimatePresence>
      </div>

      <Button
        variant="flat"
        startContent={<Icon icon="solar:add-circle-linear" width={18} />}
        onPress={addMember}
        className="w-full"
      >
        Add member
      </Button>

      <div className="flex gap-2 mt-4">
        <Button
          variant="flat"
          className="flex-1"
          onPress={handleSkip}
          isDisabled={isLoading}
        >
          Skip
        </Button>
        <Button
          type="submit"
          color="primary"
          className="flex-1"
          isLoading={isLoading}
        >
          Invite Team
        </Button>
      </div>
    </form>
  );
}
