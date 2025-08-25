"use client";

import React from "react";
import { Button, Input, InputOtp } from "@heroui/react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function ForgotPasswordCard() {
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isOtpValid, setIsOtpValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    React.useState(true);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.length) {
      setIsEmailValid(false);
      return;
    }
    setIsEmailValid(true);
    // Move to OTP page after email submission
    setPage([1, 1]);
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setIsOtpValid(false);
      return;
    }
    setIsOtpValid(true);
    // Move to password reset page
    setPage([2, 1]);
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (!password.length || password.length < 8) {
      setIsPasswordValid(false);
      hasError = true;
    }

    if (password !== confirmPassword) {
      setIsConfirmPasswordValid(false);
      hasError = true;
    }

    if (hasError) return;

    setIsPasswordValid(true);
    setIsConfirmPasswordValid(true);

    // Here you can send the new password to your API
    console.log(`Email: ${email}, New Password: ${password}`);
  };

  const handleSubmit =
    page === 0
      ? handleEmailSubmit
      : page === 1
        ? handleOtpSubmit
        : handlePasswordSubmit;

  const getPageTitle = () => {
    if (page === 0) return "Reset your password";
    if (page === 1) return "Check your email";
    return "Create new password";
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-2xl border border-divider bg-content1 flex w-full max-w-[420px] flex-col gap-6 px-6 py-8">
        <LazyMotion features={domAnimation}>
          <m.div layout className="flex flex-col items-center pb-2">
            {page > 0 && (
              <m.div className="w-full mb-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => setPage([page - 1, -1])}
                >
                  <Icon
                    className="text-default-500"
                    icon="solar:alt-arrow-left-linear"
                    width={16}
                  />
                </Button>
              </m.div>
            )}
            <m.h1
              layout
              className="text-2xl font-semibold tracking-tight text-center"
              transition={{ duration: 0.25 }}
            >
              <span className="bg-gradient-to-r from-default-900 to-default-700 bg-clip-text text-transparent">
                {getPageTitle()}
              </span>
            </m.h1>
          </m.div>

          {page === 0 && (
            <p className="text-small text-default-500 text-center">
              Enter your email and we&apos;ll send you a link to reset your
              password
            </p>
          )}

          <AnimatePresence custom={direction} initial={false} mode="wait">
            <m.form
              key={page}
              animate="center"
              className="flex flex-col gap-4"
              custom={direction}
              exit="exit"
              initial="enter"
              transition={{
                duration: 0.25,
              }}
              variants={variants}
              onSubmit={handleSubmit}
            >
              {page === 0 ? (
                <>
                  <Input
                    errorMessage={
                      !isEmailValid ? "Enter a valid email" : undefined
                    }
                    isInvalid={!isEmailValid}
                    name="email"
                    placeholder="User@acme.com"
                    type="email"
                    value={email}
                    variant="bordered"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:letter-linear"
                        width={20}
                      />
                    }
                    onValueChange={(value) => {
                      setIsEmailValid(true);
                      setEmail(value);
                    }}
                  />
                  <Button
                    fullWidth
                    size="lg"
                    className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                    type="submit"
                  >
                    Send Reset Code
                  </Button>
                </>
              ) : page === 1 ? (
                <>
                  <p className="text-small text-default-500 text-center">
                    We&apos;ve sent a verification code to {email}
                  </p>
                  <InputOtp
                    length={6}
                    value={otp}
                    onValueChange={setOtp}
                    variant="bordered"
                    className="mx-auto"
                    errorMessage={
                      !isOtpValid ? "Invalid verification code" : undefined
                    }
                    isInvalid={!isOtpValid}
                  />
                  <Button
                    fullWidth
                    size="lg"
                    className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                    type="submit"
                  >
                    Verify Code
                  </Button>
                  <p className="text-small text-default-500 text-center">
                    Didn&apos;t receive code?{" "}
                    <Link href="#" className="text-primary">
                      Resend
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-small text-default-500 text-center">
                    Enter your new password below
                  </p>
                  <Input
                    endContent={
                      <button type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <Icon
                            className="text-default-400 pointer-events-none text-2xl"
                            icon="solar:eye-closed-linear"
                          />
                        ) : (
                          <Icon
                            className="text-default-400 pointer-events-none text-2xl"
                            icon="solar:eye-bold"
                          />
                        )}
                      </button>
                    }
                    errorMessage={
                      !isPasswordValid
                        ? "Password must be at least 8 characters"
                        : undefined
                    }
                    isInvalid={!isPasswordValid}
                    label="New Password"
                    name="password"
                    placeholder="Enter new password"
                    type={isVisible ? "text" : "password"}
                    value={password}
                    variant="bordered"
                    onValueChange={(value) => {
                      setIsPasswordValid(true);
                      setPassword(value);
                    }}
                  />
                  <Input
                    endContent={
                      <button type="button" onClick={toggleConfirmVisibility}>
                        {isConfirmVisible ? (
                          <Icon
                            className="text-default-400 pointer-events-none text-2xl"
                            icon="solar:eye-closed-linear"
                          />
                        ) : (
                          <Icon
                            className="text-default-400 pointer-events-none text-2xl"
                            icon="solar:eye-bold"
                          />
                        )}
                      </button>
                    }
                    errorMessage={
                      !isConfirmPasswordValid
                        ? "Passwords don't match"
                        : undefined
                    }
                    isInvalid={!isConfirmPasswordValid}
                    label="Confirm New Password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    type={isConfirmVisible ? "text" : "password"}
                    value={confirmPassword}
                    variant="bordered"
                    onValueChange={(value) => {
                      setIsConfirmPasswordValid(true);
                      setConfirmPassword(value);
                    }}
                  />
                  <Button
                    fullWidth
                    className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                    type="submit"
                  >
                    Reset Password
                  </Button>
                </>
              )}
            </m.form>
          </AnimatePresence>
        </LazyMotion>

        {/* Back to login link */}
        <p className="text-small text-default-500 text-center">
          Remember your password?{" "}
          <Link href="/login" className="text-primary ">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
