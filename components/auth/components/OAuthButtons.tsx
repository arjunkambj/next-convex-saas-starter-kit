"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { addToast } from "@heroui/react";

interface OAuthButtonsProps {
  mode?: "login" | "signup";
}

export default function OAuthButtons({}: OAuthButtonsProps) {
  const { signIn } = useAuthActions();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { redirectTo: "/overview" });
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    addToast({
      title: "Coming Soon",
      description: "GitHub authentication will be available soon",
      color: "warning",
      timeout: 2000,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        startContent={<Icon icon="flat-color-icons:google" width={24} />}
        variant="flat"
        fullWidth
        className="bg-content2 hover:bg-content3"
        onPress={handleGoogleSignIn}
        isLoading={isGoogleLoading}
      >
        Continue with Google
      </Button>
      <Button
        startContent={
          <Icon className="text-default-500" icon="fe:github" width={24} />
        }
        variant="flat"
        fullWidth
        className="bg-content2 hover:bg-content3"
        onPress={handleGithubSignIn}
      >
        Continue with Github
      </Button>
    </div>
  );
}
