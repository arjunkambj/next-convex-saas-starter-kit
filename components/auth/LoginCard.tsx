"use client";

import React from "react";
import { Button, Divider, addToast } from "@heroui/react";
import { AnimatePresence, m } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import AuthCard from "./components/AuthCard";
import OAuthButtons from "./components/OAuthButtons";
import EmailInput from "./components/EmailInput";
import OtpInput from "./components/OtpInput";
import AuthLinks from "./components/AuthLinks";

export default function LoginCard() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isOtpValid, setIsOtpValid] = React.useState(true);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 20 : -20, opacity: 0 }),
  };

  const getPageTitle = () => {
    if (page === 0) return "Welcome back";
    return "Check your email";
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.length) {
      setIsEmailValid(false);
      return;
    }
    setIsEmailValid(true);
    try {
      const formData = new FormData();
      formData.set("email", email);
      await signIn("resend-otp", formData);
      setPage([1, 1]);
      addToast({
        title: "Code Sent",
        description: "Check your email for the verification code",
        color: "success",
        timeout: 3000,
      });
    } catch (error) {
      console.error("OTP send error:", error);
      addToast({
        title: "Error",
        description: "Failed to send verification code",
        color: "danger",
        timeout: 3000,
      });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setIsOtpValid(false);
      return;
    }
    setIsOtpValid(true);
    try {
      const formData = new FormData();
      formData.set("code", otp);
      await signIn("resend-otp", formData);
      addToast({
        title: "Welcome back!",
        description: "Successfully signed in.",
        color: "success",
        timeout: 2000,
      });
      setTimeout(() => {
        router.push("/overview");
      }, 500);
    } catch (error) {
      console.error("OTP verification error:", error);
      setIsOtpValid(false);
      addToast({
        title: "Verification Failed",
        description: "Invalid or expired code. Please try again.",
        color: "danger",
        timeout: 4000,
      });
    }
  };

  const handleSubmit = page === 0 ? handleEmailSubmit : handleOtpSubmit;

  return (
    <AuthCard
      title={getPageTitle()}
      showBack={page > 0}
      onBack={() => setPage([0, -1])}
    >
      {page === 0 && (
        <>
          <OAuthButtons mode="login" />
          <div className="flex items-center gap-4 py-3">
            <Divider className="flex-1" />
            <p className="text-tiny text-default-500 shrink-0">OR</p>
            <Divider className="flex-1" />
          </div>
        </>
      )}
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <m.form
          key={page}
          animate="center"
          className="flex w-full flex-col gap-4"
          custom={direction}
          exit="exit"
          initial="enter"
          transition={{ duration: 0.25 }}
          variants={variants}
          onSubmit={handleSubmit}
        >
          {page === 0 ? (
            <>
              <EmailInput
                value={email}
                onChange={(value) => {
                  setIsEmailValid(true);
                  setEmail(value);
                }}
                isInvalid={!isEmailValid}
              />
              <Button
                fullWidth
                type="submit"
                color="primary"
                startContent={
                  <Icon
                    className="pointer-events-none text-2xl"
                    icon="solar:letter-bold"
                  />
                }
              >
                Continue with Email
              </Button>
            </>
          ) : (
            <>
              <OtpInput
                value={otp}
                onChange={setOtp}
                isInvalid={!isOtpValid}
                email={email}
              />
              <Button fullWidth color="primary" type="submit">
                Verify
              </Button>
            </>
          )}
        </m.form>
      </AnimatePresence>
      {page === 0 && <AuthLinks mode="login" />}
    </AuthCard>
  );
}
