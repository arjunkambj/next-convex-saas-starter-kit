"use client";

import { Icon } from "@iconify/react";
import { cn } from "@heroui/theme";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";

import { footerItems } from "@/constants/dashboard-sidebar";

export const FooterItems = () => {
  const pathname = usePathname();

  const isActive = useCallback((href: string) => pathname === href, [pathname]);

  const footerItemsContent = useMemo(
    () =>
      footerItems.map((item) => (
        <Link
          key={item.key}
          aria-current={isActive(item.href || "") ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 min-h-9",
            "no-underline w-full",
            isActive(item.href || "")
              ? "bg-primary text-white font-medium shadow-sm"
              : "text-default-800 hover:text-default-900 hover:bg-default-200"
          )}
          href={(item.href || "/overview") as Route}
        >
          {item.icon && (
            <Icon
              aria-hidden
              className="shrink-0 transition-colors w-5 h-5"
              icon={item.icon}
            />
          )}
          <span className="text-sm font-medium">{item.label}</span>
        </Link>
      )),
    [isActive]
  );

  return <div className="flex gap-1 flex-col pt-4">{footerItemsContent}</div>;
};
