"use client";

import React from "react";
import { Button, Input, Divider, InputOtp } from "@heroui/react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function LoginCard() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isOtpValid, setIsOtpValid] = React.useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
    // Here you can verify the OTP with your API
    console.log(`Email: ${email}, OTP: ${otp}`);
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.length) {
      setIsPasswordValid(false);
      return;
    }
    setIsPasswordValid(true);
    // Here you can send the email and password to your API for authentication.
    console.log(`Email: ${email}, Password: ${password}`);
  };

  const handleSubmit =
    page === 0
      ? handleEmailSubmit
      : page === 1
        ? handleOtpSubmit
        : handlePasswordSubmit;

  const getPageTitle = () => {
    if (page === 0) return "Welcome back";
    if (page === 1) return "Check your email";
    if (page === 2) return "Enter your password";
    return "Sign in";
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-2xl border border-divider bg-content1 shadow-sm flex w-full max-w-[420px] flex-col gap-6 px-6 py-8">
        <LazyMotion features={domAnimation}>
          <m.div layout className="flex flex-col items-center pb-2">
            {page > 0 && (
              <m.div className="w-full mb-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => setPage([0, -1])}
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
              className="text-3xl font-semibold tracking-tight text-center"
              transition={{ duration: 0.25 }}
            >
              <span className="bg-gradient-to-r from-default-900 to-default-700 bg-clip-text text-transparent">
                {getPageTitle()}
              </span>
            </m.h1>
          </m.div>

          {/* OAuth buttons - always visible on page 0 */}
          {page === 0 && (
            <>
              <div className="flex flex-col gap-3">
                <Button
                  startContent={
                    <Icon icon="flat-color-icons:google" width={24} />
                  }
                  variant="flat"
                  fullWidth
                  className="bg-content2 hover:bg-content3"
                >
                  Continue with Google
                </Button>
                <Button
                  startContent={
                    <Icon
                      className="text-default-500"
                      icon="fe:github"
                      width={24}
                    />
                  }
                  variant="flat"
                  fullWidth
                  className="bg-content2 hover:bg-content3"
                >
                  Continue with Github
                </Button>
              </div>
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
              transition={{
                duration: 0.25,
              }}
              variants={variants}
              onSubmit={handleSubmit}
            >
              {page === 0 ? (
                <>
                  <Input
                    className="w-full"
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
                    type="submit"
                    className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
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
                    className="w-full max-w-xs mx-auto"
                    errorMessage={
                      !isOtpValid ? "Invalid verification code" : undefined
                    }
                    isInvalid={!isOtpValid}
                  />
                  <Button
                    fullWidth
                    className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                    type="submit"
                  >
                    Verify
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
                      !isPasswordValid ? "Enter a valid password" : undefined
                    }
                    isInvalid={!isPasswordValid}
                    name="password"
                    placeholder="Enter your password"
                    type={isVisible ? "text" : "password"}
                    size="lg"
                    value={password}
                    variant="bordered"
                    onValueChange={(value) => {
                      setIsPasswordValid(true);
                      setPassword(value);
                    }}
                  />
                  <Button
                    fullWidth
                    size="lg"
                    className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                    type="submit"
                  >
                    Sign In
                  </Button>
                  <p className="text-small text-default-500 text-center">
                    <Link href="/forgot-password" className="text-primary">
                      Forgot password?
                    </Link>
                  </p>
                </>
              )}
            </m.form>
          </AnimatePresence>
        </LazyMotion>

        {/* Bottom links - conditional based on page */}
        {page === 0 && (
          <p className="text-small text-default-500 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary">
              Sign up
            </Link>
          </p>
        )}

        {page === 1 && (
          <p className="text-small text-default-500 text-center">
            <Link
              href="#"
              className="text-primary"
              onClick={() => setPage([2, 1])}
            >
              Use password instead
            </Link>
          </p>
        )}

        {/* Terms and Privacy Policy - visible on all pages */}
        <p className="text-tiny text-default-400 text-center">
          By continuing, you agree to our{" "}
          <Link href="/privacy/terms" className="text-tiny text-primary">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy/policy" className="text-tiny text-primary">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
