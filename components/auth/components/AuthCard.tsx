"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { m, LazyMotion, domAnimation } from "framer-motion";

interface AuthCardProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  showBack = false,
  onBack,
  children,
}: AuthCardProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-2xl border border-divider bg-content1 shadow-sm flex w-full max-w-[420px] flex-col gap-6 px-6 py-8">
        <LazyMotion features={domAnimation}>
          <m.div layout className="flex flex-col items-center pb-2">
            {showBack && (
              <m.div className="w-full mb-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={onBack}
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
                {title}
              </span>
            </m.h1>
          </m.div>
          {children}
        </LazyMotion>
      </div>
    </div>
  );
}