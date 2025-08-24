"use client";

import React from "react";
import { Button, Input, Divider } from "@heroui/react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function SignupCard() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isNameValid, setIsNameValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    React.useState(true);

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
    // Move to details page after email submission
    setPage([1, 1]);
  };

  const handleDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (!name.length) {
      setIsNameValid(false);
      hasError = true;
    }

    if (!password.length || password.length < 8) {
      setIsPasswordValid(false);
      hasError = true;
    }

    if (password !== confirmPassword) {
      setIsConfirmPasswordValid(false);
      hasError = true;
    }

    if (hasError) return;

    setIsNameValid(true);
    setIsPasswordValid(true);
    setIsConfirmPasswordValid(true);

    // Here you can send the signup data to your API
    console.log(`Email: ${email}, Name: ${name}, Password: ${password}`);
  };

  const handleSubmit = page === 0 ? handleEmailSubmit : handleDetailsSubmit;

  const getPageTitle = () => {
    if (page === 0) return "Create account";
    return "Complete your profile";
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-large bg-content1 shadow-small flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
        <LazyMotion features={domAnimation}>
          <m.div layout className="flex min-h-[40px] items-center gap-2 pb-2">
            {page > 0 && (
              <m.div>
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
              className="text-xl font-medium"
              transition={{ duration: 0.25 }}
            >
              {getPageTitle()}
            </m.h1>
          </m.div>

          {/* OAuth buttons and email - only on page 0 */}
          {page === 0 && (
            <>
              <div className="flex flex-col gap-2">
                <Button
                  startContent={
                    <Icon icon="flat-color-icons:google" width={24} />
                  }
                  variant="flat"
                  fullWidth
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
                >
                  Continue with Github
                </Button>
              </div>
              <div className="flex items-center gap-4 py-2">
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
              className="flex flex-col gap-3"
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
                    color="primary"
                    type="submit"
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
                  <Input
                    errorMessage={!isNameValid ? "Enter your name" : undefined}
                    isInvalid={!isNameValid}
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    value={name}
                    variant="bordered"
                    label="Full Name"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:user-linear"
                        width={20}
                      />
                    }
                    onValueChange={(value) => {
                      setIsNameValid(true);
                      setName(value);
                    }}
                  />
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
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
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
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    type={isConfirmVisible ? "text" : "password"}
                    value={confirmPassword}
                    variant="bordered"
                    onValueChange={(value) => {
                      setIsConfirmPasswordValid(true);
                      setConfirmPassword(value);
                    }}
                  />
                  <Button fullWidth color="primary" type="submit">
                    Create Account
                  </Button>
                </>
              )}
            </m.form>
          </AnimatePresence>
        </LazyMotion>

        {/* Sign in link */}
        <p className="text-small text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Sign in
          </Link>
        </p>

        {/* Terms and Privacy Policy */}
        <p className="text-tiny text-default-400 text-center">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-tiny">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-tiny">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
