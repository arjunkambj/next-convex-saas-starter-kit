"use client";

import { Button, Spacer } from "@heroui/react";
import HeroAppBox from "./components/HeroAppBox";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-16">
      {/* Subtle background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-40 h-[28rem] w-[90rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-500/15 via-default-300/10 to-transparent blur-3xl" />
        <div className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-secondary-500/15 blur-3xl" />
        <div className="absolute -right-24 top-40 h-56 w-56 rounded-full bg-primary-400/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-content1 px-4 py-1.5 ring-1 ring-divider shadow-sm">
          <HeroAvatarGroup />
          <span className="text-xs text-default-800">1000+ accounts ipsum</span>
        </div>

        <Spacer y={4} />

        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl md:text-[56px] xl:text-[64px] leading-[1.08] bg-gradient-to-r from-default-900 to-default-700 bg-clip-text text-transparent">
          Lorem ipsum dolor sit amet,
          <br className="hidden sm:block" />
          consectetur adipi elit.
        </h1>

        <p className="mt-3 text-[15px] sm:text-base md:text-[18px] text-default-600 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="mt-6 flex  items-center justify-center gap-3">
          <Button
            color="primary"
            as={Link}
            href="/login"
            size="lg"
            endContent={<Icon icon="lucide:chevron-right" width={20} />}
            className="bg-gradient-to-br from-primary-500 to-primary-600 text-white"
          >
            Start Tracking
          </Button>
          <Button variant="flat" color="default" size="lg" className="px-10">
            Free Demo
          </Button>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-default-500">
          14-Day Money-Back Guarantee
        </p>
      </div>

      <div className="mt-8 md:mt-8">
        <HeroAppBox />
      </div>
    </section>
  );
}

const HeroAvatarGroup = () => {
  const avatars = [1, 2, 3, 4, 5].map(
    (n) => `https://i.pravatar.cc/80?img=${n}`
  );
  return (
    <div className="flex -space-x-2">
      {avatars.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`User ${idx + 1}`}
          className="h-6 w-6 rounded-full ring-2 ring-default-200 object-cover"
          loading="lazy"
        />
      ))}
    </div>
  );
};
