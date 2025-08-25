"use client";

import React from "react";
import { Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function EmailInput({
  value,
  onChange,
  isInvalid = false,
  errorMessage = "Enter a valid email",
  placeholder = "User@acme.com",
  size = "md",
  label,
}: EmailInputProps) {
  return (
    <Input
      className="w-full"
      errorMessage={isInvalid ? errorMessage : undefined}
      isInvalid={isInvalid}
      name="email"
      placeholder={placeholder}
      type="email"
      value={value}
      variant="bordered"
      size={size}
      label={label}
      startContent={
        <Icon
          className="text-default-400"
          icon="solar:letter-linear"
          width={20}
        />
      }
      onValueChange={onChange}
    />
  );
}