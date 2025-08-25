"use client";

import React from "react";
import { InputOtp } from "@heroui/react";
import Link from "next/link";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  email?: string;
  onResend?: () => void;
}

export default function OtpInput({
  value,
  onChange,
  isInvalid = false,
  errorMessage = "Invalid verification code",
  email,
  onResend,
}: OtpInputProps) {
  return (
    <>
      {email && (
        <p className="text-small text-default-500 text-center">
          We&apos;ve sent a verification code to {email}
        </p>
      )}
      <InputOtp
        length={6}
        value={value}
        onValueChange={onChange}
        variant="bordered"
        className="w-full max-w-xs mx-auto"
        errorMessage={isInvalid ? errorMessage : undefined}
        isInvalid={isInvalid}
      />
      {onResend && (
        <p className="text-small text-default-500 text-center">
          Didn&apos;t receive code?{" "}
          <Link href="#" onClick={onResend} className="text-primary">
            Resend
          </Link>
        </p>
      )}
    </>
  );
}