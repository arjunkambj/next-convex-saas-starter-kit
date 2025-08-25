"use client";

import React from "react";
import { Button, Divider, Input, addToast } from "@heroui/react";
import { AnimatePresence, m } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import AuthCard from "./components/AuthCard";
import OAuthButtons from "./components/OAuthButtons";
import EmailInput from "./components/EmailInput";
import OtpInput from "./components/OtpInput";
import AuthLinks from "./components/AuthLinks";

export default function SignupCard() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isNameValid, setIsNameValid] = React.useState(true);
  const [isOtpValid, setIsOtpValid] = React.useState(true);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 20 : -20, opacity: 0 }),
  };

  const getPageTitle = () => {
    if (page === 0) return "Get started for free";
    if (page === 1) return "Complete your profile";
    return "Verify your email";
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.length) {
      setIsEmailValid(false);
      return;
    }
    setIsEmailValid(true);
    setPage([1, 1]);
  };

  const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.length) {
      setIsNameValid(false);
      return;
    }
    setIsNameValid(true);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("name", name);
      await signIn("resend-otp", formData);
      setPage([2, 1]);
      addToast({
        title: "Code Sent",
        description: "Check your email for the verification code",
        color: "success",
        timeout: 3000,
      });
    } catch (error) {
      console.error("Signup error:", error);
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
        title: "Account Created!",
        description: "Your account has been successfully created.",
        color: "success",
        timeout: 3000,
      });
      setTimeout(() => {
        router.push("/overview");
      }, 1000);
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

  const handleSubmit = page === 0 ? handleEmailSubmit : page === 1 ? handleDetailsSubmit : handleOtpSubmit;

  return (
    <AuthCard title={getPageTitle()} showBack={page > 0} onBack={() => setPage([Math.max(0, page - 1), -1])}>
      {page === 0 && (
        <>
          <OAuthButtons mode="signup" />
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
          className="flex flex-col gap-4"
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
                className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                startContent={<Icon className="pointer-events-none text-2xl" icon="solar:letter-bold" />}
              >
                Continue with Email
              </Button>
            </>
          ) : page === 1 ? (
            <>
              <Input
                errorMessage={!isNameValid ? "Enter your name" : undefined}
                isInvalid={!isNameValid}
                name="name"
                placeholder="John Doe"
                type="text"
                value={name}
                variant="bordered"
                label="Full Name"
                startContent={<Icon className="text-default-400" icon="solar:user-linear" width={20} />}
                onValueChange={(value) => {
                  setIsNameValid(true);
                  setName(value);
                }}
              />
              <Button fullWidth className="bg-gradient-to-br from-primary-500 to-primary-600 text-white" type="submit">
                Continue
              </Button>
            </>
          ) : (
            <>
              <OtpInput value={otp} onChange={setOtp} isInvalid={!isOtpValid} email={email} />
              <Button
                fullWidth
                className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                type="submit"
              >
                Verify & Create Account
              </Button>
            </>
          )}
        </m.form>
      </AnimatePresence>
      {page === 0 && <AuthLinks mode="signup" />}
    </AuthCard>
  );
}