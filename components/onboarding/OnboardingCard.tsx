"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";

interface OnboardingCardProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  backHref?: string;
  children: React.ReactNode;
}

export default function OnboardingCard({
  title,
  subtitle,
  showBack = false,
  onBack,
  backHref,
  children,
}: OnboardingCardProps) {
  return (
    <div className="flex h-full w-full items-center justify-center px-4">
      <div className="rounded-2xl border border-divider bg-content1 flex w-full max-w-[520px] flex-col gap-6 px-8 py-10">
        <LazyMotion features={domAnimation}>
          <m.div layout className="flex flex-col items-center">
            {showBack && (
              <m.div className="w-full mb-4">
                {backHref ? (
                  <Button
                    as={Link}
                    href={backHref}
                    isIconOnly
                    size="sm"
                    variant="flat"
                  >
                    <Icon
                      className="text-default-500"
                      icon="solar:alt-arrow-left-linear"
                      width={16}
                    />
                  </Button>
                ) : (
                  <Button isIconOnly size="sm" variant="flat" onPress={onBack}>
                    <Icon
                      className="text-default-500"
                      icon="solar:alt-arrow-left-linear"
                      width={16}
                    />
                  </Button>
                )}
              </m.div>
            )}

            <m.h1
              layout
              className="text-3xl font-semibold tracking-tight text-center"
              transition={{ duration: 0.25 }}
            >
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                {title}
              </span>
            </m.h1>

            {subtitle && (
              <m.p
                layout
                className="text-sm text-default-500 text-center mt-2"
                transition={{ duration: 0.25 }}
              >
                {subtitle}
              </m.p>
            )}
          </m.div>

          <m.div layout transition={{ duration: 0.25 }}>
            {children}
          </m.div>
        </LazyMotion>
      </div>
    </div>
  );
}
