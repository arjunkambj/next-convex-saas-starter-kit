import { heroui } from "@heroui/theme";

const config = heroui({
  themes: {
    // Custom Meyoo Theme - Vibrant and Modern
    light: {
      extend: "light",
      colors: {
        // Primary - Indigo
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          foreground: "#ffffff",
          DEFAULT: "#3b82f6",
        },
        // Secondary - Blue
        secondary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          foreground: "#ffffff",
          DEFAULT: "#3b82f6",
        },
        // Success - Emerald
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          foreground: "#ffffff",
          DEFAULT: "#10b981",
        },
        // Warning - Orange
        warning: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          foreground: "#ffffff",
          DEFAULT: "#ea580c",
        },
        // Danger - Rose
        danger: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          foreground: "#ffffff",
          DEFAULT: "#e11d48",
        },
        // Default - Zinc for professional cool grays
        default: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          foreground: "#18181b",
          DEFAULT: "#d4d4d8",
        },
        // Backgrounds and Content
        background: "#f9fafc",
        foreground: "#11181C",
        content1: {
          DEFAULT: "#ffffff",
          foreground: "#11181C",
        },
        content2: {
          DEFAULT: "#f4f4f5",
          foreground: "#11181C",
        },
        content3: {
          DEFAULT: "#e4e4e7",
          foreground: "#11181C",
        },
        content4: {
          DEFAULT: "#d4d4d8",
          foreground: "#11181C",
        },
        focus: "#6366f1",
        divider: {
          DEFAULT: "#e4e4e7",
        },
      },
    },
    // Dark variant of Meyoo theme - Vibrant and Modern
    dark: {
      extend: "dark",
      colors: {
        // Primary - Indigo
        primary: {
          50: "#312e81",
          100: "#3730a3",
          200: "#4338ca",
          300: "#4f46e5",
          400: "#6366f1",
          500: "#818cf8",
          600: "#a5b4fc",
          700: "#c7d2fe",
          800: "#e0e7ff",
          900: "#eef2ff",
          foreground: "#ffffff",
          DEFAULT: "#4f46e5",
        },
        // Secondary - Blue
        secondary: {
          50: "#1e3a8a",
          100: "#1e40af",
          200: "#1d4ed8",
          300: "#2563eb",
          400: "#3b82f6",
          500: "#60a5fa",
          600: "#93c5fd",
          700: "#bfdbfe",
          800: "#dbeafe",
          900: "#eff6ff",
          foreground: "#ffffff",
          DEFAULT: "#2563eb",
        },
        // Success - Emerald
        success: {
          50: "#064e3b",
          100: "#065f46",
          200: "#047857",
          300: "#059669",
          400: "#10b981",
          500: "#34d399",
          600: "#6ee7b7",
          700: "#a7f3d0",
          800: "#d1fae5",
          900: "#ecfdf5",
          foreground: "#ffffff",
          DEFAULT: "#10b981",
        },
        // Warning - Orange
        warning: {
          50: "#7c2d12",
          100: "#9a3412",
          200: "#c2410c",
          300: "#ea580c",
          400: "#f97316",
          500: "#fb923c",
          600: "#fdba74",
          700: "#fed7aa",
          800: "#ffedd5",
          900: "#fff7ed",
          foreground: "#ffffff",
          DEFAULT: "#ea580c",
        },
        // Danger - Rose
        danger: {
          50: "#881337",
          100: "#9f1239",
          200: "#be123c",
          300: "#e11d48",
          400: "#f43f5e",
          500: "#fb7185",
          600: "#fda4af",
          700: "#fecdd3",
          800: "#ffe4e6",
          900: "#fff1f2",
          foreground: "#ECEDEE",
          DEFAULT: "#e11d48",
        },
        // Default - Zinc for dark mode
        default: {
          50: "#18181b",
          100: "#27272a",
          200: "#3f3f46",
          300: "#52525b",
          400: "#71717a",
          500: "#a1a1aa",
          600: "#d4d4d8",
          700: "#e4e4e7",
          800: "#f4f4f5",
          900: "#fafafa",
          foreground: "#fafafa",
          DEFAULT: "#3f3f46",
        },
        // Backgrounds and Content for dark mode with zinc
        background: "#09090b",
        foreground: "#ECEDEE",
        content1: {
          DEFAULT: "#18181b",
          foreground: "#ECEDEE",
        },
        content2: {
          DEFAULT: "#27272a",
          foreground: "#ECEDEE",
        },
        content3: {
          DEFAULT: "#3f3f46",
          foreground: "#ECEDEE",
        },
        content4: {
          DEFAULT: "#52525b",
          foreground: "#ECEDEE",
        },
        focus: "#6366f1",
        divider: {
          DEFAULT: "#3f3f46",
        },
      },
    },
  },
  layout: {
    disabledOpacity: "0.5",
    // You can add custom shadow definitions here
    boxShadow: {
      small: "none", // Remove small shadow
      medium: "none", // Remove medium shadow
      large: "none", // Remove large shadow
    },
  },
});

export default config;
