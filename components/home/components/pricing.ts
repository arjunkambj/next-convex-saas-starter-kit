export type BillingCycle = "monthly" | "yearly";

export type PlanTier = "free" | "pro" | "ultra" | "enterprise";

export type Plan = {
  id: PlanTier;
  name: string;
  tagline: string;
  priceMonthly: number; // USD per month
  highlight?: boolean;
  features: Array<{ label: string; available: boolean; note?: string }>;
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Basic",
    tagline: "Indie Hackers",
    priceMonthly: 0,
    features: [
      { label: "Lorem ipsum dolor sit", available: true },
      { label: "Consectetur adipiscing elit", available: true },
      { label: "Sed do eiusmod tempor", available: true },
      { label: "Incididunt ut labore", available: true },
      { label: "Et dolore magna aliqua", available: true },
      { label: "Ut enim ad minim veniam", available: true },
      { label: "Quis nostrud exercitation", available: false },
      { label: "Ullamco laboris nisi", available: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Small Projects",
    priceMonthly: 29,
    highlight: true,
    features: [
      { label: "Lorem ipsum dolor sit", available: true, note: "Flexible" },
      { label: "Consectetur adipiscing elit", available: true },
      { label: "Sed do eiusmod tempor", available: true },
      { label: "Incididunt ut labore", available: true },
      { label: "Et dolore magna aliqua", available: true },
      { label: "Ut enim ad minim veniam", available: true },
      { label: "Quis nostrud exercitation", available: false },
      { label: "Ullamco laboris nisi", available: false },
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    tagline: "Growing Businesses",
    priceMonthly: 59,
    features: [
      { label: "Lorem ipsum dolor sit", available: true, note: "Flexible" },
      { label: "Consectetur adipiscing elit", available: true },
      { label: "Sed do eiusmod tempor", available: true },
      { label: "Incididunt ut labore", available: true },
      { label: "Et dolore magna aliqua", available: true },
      { label: "Ut enim ad minim veniam", available: true },
      { label: "Quis nostrud exercitation", available: true },
      { label: "Ullamco laboris nisi", available: true, note: "Coming Soon" },
    ],
  },
];

export const enterprisePlan: Plan = {
  id: "enterprise",
  name: "Enterprise",
  tagline: "App Studios & Agencies",
  priceMonthly: 0,
  features: [],
};

export function priceFor(billing: BillingCycle, monthlyPrice: number): number {
  if (billing === "yearly") {
    return Math.round(monthlyPrice * 0.75); // ~25% off
  }
  return monthlyPrice;
}
