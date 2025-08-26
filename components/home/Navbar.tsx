"use client";

import { useState, useEffect } from "react";
import Logo from "../shared/Logo";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { homeNavLinks } from "@/constants/homeNavlink";
import { Button } from "@heroui/react";
import { Authenticated, Unauthenticated } from "convex/react";
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-4 z-50 mx-auto w-full bg-transparent px-2`}
    >
      <nav
        className={`mx-auto flex max-w-4xl items-center justify-between rounded-2xl border border-divider/70 px-4 py-3 sm:px-5 bg-content1/70 backdrop-blur-md shadow-xs transition-[transform,background,box-shadow] duration-300 ease-out ${
          isScrolled ? "scale-[0.97]" : "scale-[0.99]"
        } transition-transform`}
      >
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {homeNavLinks.map((link) => (
            <Link
              key={link.href}
              href={{
                pathname: "/",
                hash: link.href.startsWith("#")
                  ? link.href.slice(1)
                  : undefined,
              }}
              className="text-sm text-default-600 transition-colors hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Authenticated>
          <Button as={Link} href="/overview" color="primary">
            App
          </Button>
        </Authenticated>
        <Unauthenticated>
          <Button as={Link} href="/signin" color="primary">
            Get Started
          </Button>
        </Unauthenticated>

        <button
          aria-label="Toggle menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl  md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Icon
            icon={mobileOpen ? "lucide:x" : "lucide:menu"}
            width={24}
            height={24}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mx-auto mt-2 w-full max-w-5xl rounded-2xl border border-divider/50 bg-content1 p-3 shadow-sm md:hidden">
          <div className="flex flex-col gap-1">
            {homeNavLinks.map((link) => (
              <Link
                key={link.href}
                href={{
                  pathname: "/",
                  hash: link.href.startsWith("#")
                    ? link.href.slice(1)
                    : undefined,
                }}
                className="rounded-lg px-3 py-2 text-sm text-default-700 hover:bg-content2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              as={Link}
              href="/signin"
              color="primary"
              radius="lg"
              size="sm"
              className="mt-1 w-full"
              onPress={() => setMobileOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
