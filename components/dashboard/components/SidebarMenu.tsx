"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/theme";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  items?: SidebarItem[];
  isCategoryOpen?: boolean;
};

export type SidebarMenuProps = {
  items: SidebarItem[];
  className?: string;
};

const SidebarMenu = ({ items, className }: SidebarMenuProps) => {
  const pathname = usePathname();

  const isActive = useCallback(
    (href: string) => {
      return pathname === href;
    },
    [pathname]
  );

  // Memoize defaultExpandedKeys to prevent hydration issues
  const defaultExpandedKeys = useMemo(() => {
    return items
      .filter((item) => item.isCategoryOpen !== false)
      .map((item) => item.key);
  }, [items]);

  const renderMenuItem = useCallback(
    (item: SidebarItem) => (
      <Link
        key={item.key}
        aria-current={isActive(item.href || "") ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 min-h-9",
          "no-underline",
          isActive(item.href || "")
            ? "bg-primary text-white font-medium shadow-sm"
            : "text-default-800 hover:text-default-900 hover:bg-default-200"
        )}
        href={(item.href || "/overview") as Route}
        prefetch={true}
      >
        {item.icon && (
          <Icon
            aria-hidden
            className="shrink-0 transition-colors w-5 h-5"
            icon={item.icon}
          />
        )}
        <span className="text-sm font-medium truncate">{item.title}</span>
      </Link>
    ),
    [isActive]
  );

  const renderCategory = useCallback(
    (category: SidebarItem) => (
      <AccordionItem
        key={category.key}
        aria-label={category.title}
        classNames={{
          base: "bg-transparent shadow-none border-none px-0 focus-visible:ring-0 focus:ring-0 ring-0 focus:outline-none",
          heading: "pr-0 focus-visible:ring-0 focus:ring-0 ring-0",
          trigger:
            "px-3 py-0 min-h-9 h-9 hover:bg-transparent data-[hover=true]:bg-transparent focus-visible:ring-0 focus:ring-0 ring-0",
          content: "py-0 pl-0",
          indicator: "text-default-500 data-[open=true]:rotate-90",
        }}
        indicator={
          <Icon
            aria-hidden
            className="transition-transform"
            icon="solar:alt-arrow-right-linear"
            width={16}
          />
        }
        title={
          <div className="flex h-9 items-center gap-3">
            {category.icon && (
              <Icon
                aria-hidden
                className="text-default-500"
                icon={category.icon}
                width={18}
              />
            )}
            <span className="text-xs font-medium text-default-500 uppercase tracking-wide">
              {category.title}
            </span>
          </div>
        }
      >
        <div className="space-y-0.5 overflow-hidden">
          {category.items?.map(renderMenuItem)}
        </div>
      </AccordionItem>
    ),
    [renderMenuItem]
  );

  const accordionContent = useMemo(
    () => (
      <Accordion
        className="px-0 gap-2"
        defaultExpandedKeys={defaultExpandedKeys}
        selectionMode="multiple"
        variant="splitted"
      >
        {items.map(renderCategory)}
      </Accordion>
    ),
    [defaultExpandedKeys, items, renderCategory]
  );

  return <nav className={cn("w-full", className)}>{accordionContent}</nav>;
};

export default SidebarMenu;
