export const DASHBOARD_SIDEBAR_ITEMS = [
  {
    label: "Can be Anything",
    items: [
      {
        key: "lorum-ipsum-2",
        href: "/lorum-ipsum-2",
        icon: "solar:chart-square-linear",
        activeIcon: "solar:chart-square-bold",
        label: "Lorum Ipsum",
      },
    ],
  },
  {
    label: "Can be Anything 2",
    items: [
      {
        key: "lorum-ipsum",
        href: "/lorum-ipsum",
        icon: "solar:layers-minimalistic-linear",
        activeIcon: "solar:layers-minimalistic-bold",
        label: "Lorum Ipsum",
      },
    ],
  },
];

export const DASHBOARD_FOOTER_ITEMS = [
  {
    key: "team-management",
    href: "/team-management",
    icon: "solar:users-group-two-rounded-linear",
    activeIcon: "solar:users-group-two-rounded-bold",
    label: "Team Management",
  },
  {
    key: "settings",
    href: "/settings",
    icon: "solar:settings-linear",
    activeIcon: "solar:settings-bold",
    label: "Settings",
  },
];

// Legacy exports for backward compatibility
export const sectionItems = DASHBOARD_SIDEBAR_ITEMS;
export const footerItems = DASHBOARD_FOOTER_ITEMS;
export const dashboardSidebar = {
  sectionItems: DASHBOARD_SIDEBAR_ITEMS,
  footerItems: DASHBOARD_FOOTER_ITEMS,
};
