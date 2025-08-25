# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Package Manager: Bun** - Always use `bun` instead of npm/yarn/pnpm

**Development:**
- `bun run dev` - Start Next.js development server with Turbopack
- `bunx convex dev` - Start Convex backend development (run in separate terminal)

**Build & Production:**
- `bun run build` - Build Next.js application with Turbopack
- `bun run start` - Start production server

**Code Quality:**
- `bun run lint` - Run ESLint with auto-fix
- `bun run typecheck` - Run TypeScript type checking without emitting files

## Architecture

**Stack:**
- Next.js 15.5.0 with App Router and Turbopack
- Convex backend for real-time database and serverless functions
- @convex-dev/auth for authentication with Google OAuth and OTP
- HeroUI for UI components
- Tailwind CSS 4 for styling
- TypeScript with strict mode

**Key Directories:**
- `/app` - Next.js App Router pages and layouts
  - `(protected)` - Authenticated routes (dashboard, admin, onboarding, settings)
  - `(unprotected)` - Public routes (auth, home, policies)
- `/convex` - Backend functions and schema
  - `core/` - Core business logic (users, organizations, onboarding)
  - `helpers/` - Auth and utility helpers
  - `schema/` - Database table definitions
- `/components` - React components organized by feature
- `/hooks` - Custom React hooks
- `/store` - Jotai atoms for state management

**Convex Development Rules:**
- **ALWAYS read `/home/honey/code/leadnova/convex_rules.md` before writing any Convex function**
- Follow strict guidelines in `convex_rules.md`
- NEVER use filters in queries - always use indexes
- Use new function syntax with explicit args, returns validators
- Always include argument and return validators for all functions
- Use `v.null()` validator when returning null
- Use context7 MCP server for latest Convex documentation

**Authentication Flow:**
1. Uses @convex-dev/auth with Google OAuth and Resend OTP
2. After user creation/update, automatically creates organization
3. Protected routes use middleware for auth checks
4. User profile stored in `users` table with organization relationship

**Path Aliases:**
- `@/*` - Project root
- `@configs/*` - Config files directory

**Styling:**
- Always import colors from `/home/honey/code/leadnova/style/hero.ts`
- HeroUI theme configuration with custom Meyoo theme
- Light/dark mode support with Zinc color palette
- Primary: Indigo, Secondary: Blue, Success: Emerald, Warning: Orange, Danger: Rose

**Component Guidelines:**
- Use micro components for small, reusable UI elements
- Place shared components in `/components/shared` directory
- Follow naming conventions:
  - Components: PascalCase (e.g., `UserProfile.tsx`)
  - Hooks: camelCase starting with 'use' (e.g., `useDebounce.ts`)
  - Utilities: camelCase (e.g., `formatDate.ts`)
  - Convex functions: camelCase (e.g., `createUser`, `listMessages`)