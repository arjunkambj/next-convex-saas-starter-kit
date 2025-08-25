"use client";

import React from "react";
import { Accordion, AccordionItem, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";

import faqs from "./components/faqs";

export default function Faqs() {
  return (
    <section
      id="faq"
      className="mx-auto w-full  px-4 py-16 md:py-32 md:px-6 lg:px-8 scroll-mt-28"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
        {/* Pill */}
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-center">
          <span className="text-sm font-medium bg-content1 px-4 py-1 rounded-full  border border-divider text-default-500 tracking-wider uppercase">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-default-900">
            Got Questions?
          </h2>
          <p className="text-lg text-default-600 max-w-2xl">
            We&apos;ve got answers.
          </p>
        </div>
        {/* Heading */}

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
