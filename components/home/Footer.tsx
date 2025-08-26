"use client";

import React from "react";
import { Link } from "@heroui/react";
import { Icon } from "@iconify/react";

import Logo from "@/components/shared/Logo";
import { footerNavigation } from "@/constants/footerNavigation";

const footerSections = [
  {
    title: "Quick Links",
    links: footerNavigation.main.filter(
      (item) => item.name !== "Features" && item.name !== "Integrations"
    ),
  },
  {
    title: "Legal",
    links: footerNavigation.legal,
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative  border-divider border-t border-divider overflow-hidden"
    >
      <div className="relative z-10  mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-10">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-default-600 max-w-sm">
              LeadNova helps teams see where leads come from and what converts.
            </p>
            {/* Social links */}
            <div className="mt-6 flex space-x-6">
              {footerNavigation.social.map((item) => (
                <Link
                  key={item.name}
                  isExternal
                  className="text-default-700 hover:text-primary transition-colors"
                  href={item.href}
                >
                  <span className="sr-only">{item.name}</span>
                  <Icon className="h-6 w-6" icon={item.icon} width={24} />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1 md:ml-4">
              <h3 className="text-sm font-semibold leading-6 text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((item) => (
                  <li key={item.name}>
                    <Link
                      className="text-sm leading-6 text-default-600 hover:text-primary transition-colors"
                      href={item.href}
                      size="sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-16 border-t border-divider pt-10">
          <div className="flex justify-center">
            {/* Copyright */}
            <p className="text-xs text-default-500">
              &copy; 2025 LeadNova. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
