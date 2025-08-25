"use client";

import React from "react";
import Link from "next/link";

interface AuthLinksProps {
  mode: "login" | "signup";
}

export default function AuthLinks({ mode }: AuthLinksProps) {
  return (
    <>
      {mode === "login" && (
        <p className="text-small text-default-500 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary">
            Sign up
          </Link>
        </p>
      )}
      {mode === "signup" && (
        <p className="text-small text-default-500 text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary">
            Sign in
          </Link>
        </p>
      )}
      <p className="text-tiny text-default-400 text-center">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="text-tiny text-primary">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-tiny text-primary">
          Privacy
        </Link>
      </p>
    </>
  );
}
