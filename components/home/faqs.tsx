"use client";

import React from "react";
import { Accordion, AccordionItem, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";

import faqs from "./components/faqs";

export default function Faqs() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
        {/* Pill */}
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
            Got Questions?
          </span>
          <span className="block text-3xl md:text-5xl bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
            We&apos;ve Got Answers
          </span>
        </h2>
        <Spacer y={2} />
        <Accordion
          fullWidth
          keepContentMounted
          itemClasses={{
            base: "px-0 md:px-2 lg:px-3 border-b border-divider/60",
            title: "font-medium text-default-900",
            trigger: "py-5 flex-row-reverse",
            content: "pt-0 pb-5 text-base text-default-600",
            indicator: "rotate-0 data-[open=true]:-rotate-45",
          }}
          items={faqs}
          selectionMode="multiple"
        >
          {faqs.map((item, i) => (
            <AccordionItem
              key={i}
              indicator={
                <Icon
                  className="text-secondary"
                  icon="lucide:plus"
                  width={24}
                />
              }
              title={item.title}
            >
              {item.content}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
