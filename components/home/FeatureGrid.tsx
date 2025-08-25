"use client";

import { Card, CardBody, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function FeaturesSection() {
  return (
    <section className=" py-16 md:py-32 bg-content2/40">
      <div className="mx-auto max-w-7xl px-6 space-y-16">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-content1 px-4 py-2 ring-1 ring-divider shadow-sm">
            <span className="text-primary-500">
              <Icon icon="mdi:help-rhombus" width={20} height={20} />
            </span>
            <span className="text-sm text-default-800">
              Frequently Asked Questions
            </span>
          </div>
          {/* Heading */}
          <h2 className="px-2 text-center font-bold tracking-tight">
            <span className="block text-3xl md:text-5xl text-default-900">
              Got questions?
            </span>
            <span className="block text-3xl md:text-5xl bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              We&apos;ve got answers
            </span>
          </h2>
        </div>
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-6">
            {/* 1. Left image, right content */}
            <Card className="relative col-span-full lg:col-span-4 overflow-hidden border border-divider">
              <CardBody className="grid h-full items-center gap-0 p-0 sm:grid-cols-2">
                <img
                  src="https://placehold.co/960x540.png?text=Tailor%E2%80%91made"
                  srcSet="https://placehold.co/960x540@2x.png?text=Tailor%E2%80%91made 2x"
                  alt="Tailor-made"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full aspect-[16/9] object-cover sm:aspect-auto"
                />
                <div className="flex h-full flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:settings-bold" className="size-5" />
                    <h3 className="text-xl font-semibold">Tailor‑made</h3>
                  </div>
                  <p className="mt-2 text-foreground">
                    Tweak themes and workflows in seconds—no code, just your
                    way.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* 2. Full-bleed background with overlay */}
            <Card className="relative col-span-full lg:col-span-2 overflow-hidden border border-divider">
              <div className="absolute inset-0">
                <img
                  src="https://placehold.co/640x640.png?text=Secure"
                  alt="Secure"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
              </div>
              <CardBody className="relative flex h-60 flex-col justify-end p-6">
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="solar:shield-bold" className="size-5" />
                  <h3 className="text-xl font-semibold">
                    Security, on autopilot
                  </h3>
                </div>
                <p className="mt-2 text-sm text-white/90">
                  Zero‑trust defaults, encrypted data, and silent auto‑updates.
                </p>
              </CardBody>
            </Card>

            {/* 3. Split: title over image, caption below */}
            <Card className="relative col-span-full md:col-span-3 border border-divider">
              <CardBody className="flex h-full flex-col p-0">
                <div className="relative">
                  <img
                    src="https://placehold.co/960x540.png?text=Fast"
                    alt="Blazing fast"
                    className="w-full aspect-[16/9] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-white">
                    <Icon icon="solar:rocket-2-bold" className="size-4" />
                    <span className="text-sm font-medium">Blazing fast</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-foreground">
                    Edge‑caching and optimized assets make every tap feel
                    instant.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* 4. Single hero image with label and details */}
            <Card className="relative col-span-full md:col-span-3 border border-divider">
              <CardBody className="flex h-full flex-col p-0">
                <div className="relative">
                  <img
                    src="https://placehold.co/960x540.png?text=Analytics"
                    alt="Actionable analytics"
                    className="w-full aspect-[16/9] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-white">
                    <Icon icon="solar:chart-square-bold" className="size-4" />
                    <span className="text-sm font-medium">Analytics</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">
                    Actionable analytics
                  </h3>
                  <p className="mt-2 text-foreground">
                    See trends, funnels, and live alerts at a glance—then act.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
