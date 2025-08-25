"use client";

import { useMemo, useState } from "react";
import { Button, Card, CardBody, Chip, Tab, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  plans,
  enterprisePlan,
  priceFor,
  type BillingCycle,
  type Plan,
} from "./components/pricing";

function PlanPrice({
  billing,
  amount,
}: {
  billing: BillingCycle;
  amount: number;
}) {
  const price = useMemo(() => priceFor(billing, amount), [billing, amount]);
  return (
    <div className="flex items-end gap-1">
      <span className="text-3xl font-semibold md:text-4xl">${price}</span>
      <span className="text-xs text-default-500 mb-1">/month</span>
    </div>
  );
}

function FeatureRow({
  label,
  available,
  note,
}: {
  label: string;
  available: boolean;
  note?: string;
}) {
  return (
    <li className="flex items-center gap-2 text-xs md:text-sm text-default-700">
      {available ? (
        <Icon className="text-success" icon="lucide:check" width={16} />
      ) : (
        <Icon className="text-default-400" icon="lucide:x" width={16} />
      )}
      <span
        className={!available ? "line-through text-default-400" : undefined}
      >
        {label}
      </span>
      {note ? (
        <Chip
          size="sm"
          variant="flat"
          className="ml-1 bg-content2 text-default-700"
        >
          {note}
        </Chip>
      ) : null}
    </li>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: BillingCycle }) {
  return (
    <Card
      shadow="none"
      className={`rounded-2xl border ${
        plan.highlight
          ? "border-primary-200 bg-primary-50/40"
          : "border-divider bg-content1"
      }`}
    >
      <CardBody className="p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-default-900">
              {plan.name}
            </p>
            <p className="text-xs text-default-500">{plan.tagline}</p>
          </div>
          {plan.highlight ? (
            <Chip color="primary" size="sm" variant="flat">
              Best Deal
            </Chip>
          ) : null}
        </div>

        <div className="mt-4">
          <PlanPrice billing={billing} amount={plan.priceMonthly} />
          <p className="mt-1 text-[11px] text-default-500">
            Switch or cancel at any time
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {plan.features.map((f) => (
            <FeatureRow
              key={f.label}
              label={f.label}
              available={f.available}
              note={f.note}
            />
          ))}
        </ul>

        <Button
          color={plan.highlight ? "primary" : "default"}
          className={`mt-6 w-full ${plan.highlight ? "text-white" : "bg-content2 hover:bg-content3"}`}
          radius="sm"
        >
          Select Plan
        </Button>

        <p className="mt-2 text-center text-[11px] text-default-500">
          14‑Day Money‑Back Guarantee
        </p>
      </CardBody>
    </Card>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section
      id="pricing"
      className="mx-auto w-full max-w-6xl px-4 py-24 md:px-6 lg:px-8 scroll-mt-28"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-center">
        <span className="text-sm font-medium bg-content1 px-4 py-1 rounded-full  border border-divider text-default-500 tracking-wider uppercase">
          Pricing
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-default-900">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-default-600 max-w-2xl">
          Start free. Scale when you’re ready.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <Tabs
          aria-label="Billing cycle"
          selectedKey={billing}
          onSelectionChange={(k) => setBilling(k as BillingCycle)}
        >
          <Tab key="monthly" title="Billed Monthly" />
          <Tab
            key="yearly"
            title={
              <div className="flex items-center gap-2">
                <span>Billed Yearly</span>
                <Chip size="sm" color="success" variant="flat">
                  -25%
                </Chip>
              </div>
            }
          />
        </Tabs>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((p) => (
          <PlanCard key={p.id} plan={p} billing={billing} />
        ))}
      </div>

      {/* Enterprise */}
      <Card
        shadow="none"
        className="mt-8 rounded-2xl border border-divider bg-content1"
      >
        <CardBody className="flex flex-col items-start gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex items-center gap-3">
            <Icon
              className="text-default-600"
              icon="solar:buildings-bold-duotone"
              width={18}
            />
            <div>
              <p className="text-base font-semibold text-default-900">
                {enterprisePlan.name}
              </p>
              <p className="text-xs text-default-500">
                {enterprisePlan.tagline}
              </p>
            </div>
          </div>
          <Button
            radius="sm"
            size="lg"
            className="bg-content2 hover:bg-content3"
          >
            Contact Sales
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
