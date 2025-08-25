"use client";

import React, { useCallback } from "react";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex-helpers/react/cache/hooks";

import { api } from "@/convex/_generated/api";

const navigationItems = [
  {
    key: "settings",
    href: "/settings/general",
    icon: "solar:settings-linear",
    label: "Settings",
  },
  {
    key: "billing",
    href: "/settings/billing-invoices",
    icon: "solar:card-linear",
    label: "Billing",
  },
  {
    key: "help",
    href: "/settings/help",
    icon: "solar:question-circle-linear",
    label: "Help & Support",
  },
];

const UserProfile = React.memo(() => {
  const user = useQuery(api.core.users.getCurrentUser);
  const { signOut } = useAuthActions();

  const handleLogout = useCallback(async () => {
    await signOut();
    window.location.href = "/signin";
  }, [signOut]);

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = user?.image;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name={userName}
          size="sm"
          src={userImage || undefined}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownSection showDivider>
          <DropdownItem
            key="profile"
            className="h-14 gap-2"
            textValue="Profile"
          >
            <p className="font-semibold">{userName}</p>
            <p className="text-xs text-default-500">{userEmail}</p>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection showDivider>
          {navigationItems.map((item) => (
            <DropdownItem
              key={item.key}
              as={Link}
              className="data-[hover=true]:bg-default-100"
              href={item.href}
              startContent={<Icon icon={item.icon} width={18} />}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="logout"
            color="danger"
            startContent={<Icon icon="solar:logout-2-linear" width={18} />}
            onPress={handleLogout}
          >
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
});

UserProfile.displayName = "UserProfile";

export default UserProfile;
