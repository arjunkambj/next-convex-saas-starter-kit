# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About Project

LeadNova is a production-grade Next.js and Convex starter kit that provides a complete foundation for building modern SaaS applications. It includes:

- **Landing page** with marketing components
- **Authentication system** using @convex-dev/auth with Google OAuth and OTP via Resend
- **Convex backend** for real-time database and serverless functions
- **RBAC and organization management** with role-based access control
- **Admin panel** for user and organization management
- **Team management** with invitation system
- **Multi-step onboarding flow** with progress tracking
- **Email integration** with Resend
- **Production-ready architecture** with proper separation of concerns

## Must Follow Rules

### Server/Client Component Architecture

- **IMPORTANT: Server Components Rule** - Always keep pages in `/app` folder as server components
- All client-side logic should be extracted into subcomponents in `/components`
- Use `"use client"` directive only in component files, never in pages
- Server components handle data fetching and initial rendering
- Client components handle interactivity and real-time updates

### Convex Integration Pattern

- **NEVER use Convex logic directly in components** - Always import Convex queries/mutations from the `/hooks` folder
- Create custom hooks in `/hooks` folder that wrap Convex functionality
- This separation ensures clean architecture and proper server/client boundaries
- Example pattern:
  ```tsx
  // hooks/useUser.ts
  export function useCurrentUser() {
    return useQuery(api.core.users.getCurrentUser);
  }
  
  // components/UserProfile.tsx
  import { useCurrentUser } from "@/hooks/useUser";
  ```

### Navigation

- **ALWAYS use `Link` from `next/navigation`** for client-side navigation
- **Use `useRouter` from `next/navigation`** when programmatic navigation is needed
- Never use `next/router` (Pages Router API)
- Always include type assertions for router.push/replace to avoid TypeScript errors:
  ```tsx
  router.replace("/dashboard" as any);
  ```

## Commands

**Package Manager: Bun** - Always use `bun` instead of npm/yarn/pnpm

**Development:**
- `bun run dev` - Start Next.js development server with Turbopack
- `bunx convex dev` - Start Convex backend development (run in separate terminal)

**Build & Production:**
- `bun run build` - Build Next.js application with Turbopack
- `bun run start` - Start production server
- `bunx convex deploy` - Deploy Convex backend to production

**Code Quality:**
- `bun run lint` - Run ESLint with auto-fix
- `bun run typecheck` - Run TypeScript type checking without emitting files

## Architecture

### Technology Stack

- **Frontend Framework:** Next.js 15.5.0 with App Router and Turbopack
- **Backend:** Convex for real-time database and serverless functions
- **Authentication:** @convex-dev/auth with Google OAuth and OTP
- **UI Components:** HeroUI component library
- **Styling:** Tailwind CSS 4 with custom theme
- **State Management:** Jotai atoms for client state
- **Type Safety:** TypeScript with strict mode
- **Email Service:** Resend for transactional emails

### Directory Structure

```
leadnova/
├── app/                      # Next.js App Router
│   ├── (protected)/         # Authenticated routes
│   │   ├── admin/          # Admin panel
│   │   ├── dashboard/      # Main dashboard
│   │   ├── onboarding/     # Multi-step onboarding
│   │   ├── overview/       # User overview
│   │   └── settings/       # User settings
│   └── (unprotected)/      # Public routes
│       ├── auth/           # Authentication pages
│       └── home/           # Marketing pages
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── dashboard/          # Dashboard components
│   ├── onboarding/         # Onboarding flow components
│   ├── shared/             # Shared/reusable components
│   └── ui/                 # Base UI components
├── convex/                  # Backend functions
│   ├── core/               # Core business logic
│   │   ├── users.ts        # User management
│   │   ├── organizations.ts # Organization logic
│   │   └── onboarding.ts   # Onboarding flow
│   ├── helpers/            # Utility functions
│   │   └── auth.ts         # Auth helpers
│   └── schema/             # Database schema
│       └── core.ts         # Table definitions
├── hooks/                   # Custom React hooks
│   ├── useUser.ts          # User-related hooks
│   ├── useOrganization.ts  # Organization hooks
│   ├── useOnboarding.ts    # Onboarding hooks
│   └── useDebounce.ts      # Utility hooks
├── lib/                     # Utility libraries
│   └── onboarding.ts       # Onboarding utilities
└── store/                   # Jotai atoms
```

### Database Schema

**users**
- Core user data with authentication info
- Links to organization via `organizationId`
- Tracks onboarding status with `isOnboarded`
- Supports roles: `clientAdmin`, `manager`, `member`, `superAdmin`, `oppsDev`
- Status tracking: `active`, `inactive`, `invited`, `suspended`, `deleted`, `expired`
- Invitation tracking with `invitedBy`, `invitedAt`, `inviteExpiresAt`

**organizations**
- Organization details with owner reference
- Member list array
- Timestamps for creation and updates

**onboarding**
- Tracks user onboarding progress
- Links user to organization
- Step-based progress (1-3)
- Completion status and timestamps

## Onboarding Flow

### Overview
The application features a comprehensive multi-step onboarding flow that guides new users through initial setup.

### Steps
1. **Create Organization** (`/onboarding/create-organization`)
   - User creates or updates their organization
   - Sets organization name and optional image
   - Automatically becomes organization owner

2. **Invite Team** (`/onboarding/invite-team`)
   - Optional step to invite team members
   - Can be skipped to proceed to overview
   - Sends email invitations via Resend

3. **Overview** (`/onboarding/overview`)
   - Final onboarding step
   - Shows summary and next steps
   - Marks onboarding as complete

### Implementation Pattern
```tsx
// Redirect logic in OnboardingRedirect component
const route = getOnboardingRoute(
  onboardingStatus.onboardingStep,
  onboardingStatus.isCompleted,
  user.isOnboarded
);

// Step utilities in lib/onboarding.ts
export const ONBOARDING_STEPS = {
  CREATE_ORGANIZATION: 1,
  INVITE_TEAM: 2,
  OVERVIEW: 3,
};
```

### Key Components
- `OnboardingRedirect` - Handles step-based routing
- `OnboardingCard` - Consistent UI wrapper for onboarding screens
- `OnboardingProgress` - Visual progress indicator
- `OrganizationForm` - Organization creation/update form
- `TeamInviteForm` - Team invitation interface

## Development Patterns

### Custom Hook Pattern
All Convex interactions must go through custom hooks:

```tsx
// hooks/useOnboarding.ts
export function useOnboardingStatus() {
  return useQuery(api.core.onboarding.getOnboardingStatus);
}

export function useCreateOrganization() {
  return useMutation(api.core.onboarding.createOrganization);
}
```

### Component Structure
```tsx
// Server Component (page.tsx)
export default function Page() {
  return <ClientComponent />;
}

// Client Component
"use client";
import { useCustomHook } from "@/hooks/useCustomHook";

export default function ClientComponent() {
  const data = useCustomHook();
  // Component logic
}
```

### Utility Libraries
Place shared utilities in `/lib` folder:
```tsx
// lib/onboarding.ts
export function getOnboardingRoute(
  step: number | undefined,
  isCompleted: boolean | undefined,
  isOnboarded: boolean | undefined
): string {
  // Route determination logic
}
```

## Convex Development Rules

### Core Principles
- **ALWAYS read `/home/honey/code/leadnova/convex_rules.md` before writing any Convex function**
- Follow strict guidelines in `convex_rules.md`
- Use context7 MCP server for latest Convex documentation

### Query Guidelines
- **NEVER use filters in queries** - always use indexes
- Define indexes in schema and use `withIndex` in queries
- Example:
  ```tsx
  const users = await ctx.db
    .query("users")
    .withIndex("byOrganization", (q) => 
      q.eq("organizationId", orgId)
    )
    .collect();
  ```

### Function Syntax
- Use new function syntax with explicit validators:
  ```tsx
  export const getUser = query({
    args: { userId: v.id("users") },
    returns: v.union(v.object({ /* user fields */ }), v.null()),
    handler: async (ctx, args) => {
      return await ctx.db.get(args.userId);
    },
  });
  ```

### Validators
- Always include argument validators
- Always include return validators
- Use `v.null()` for functions returning null
- Use proper union types for nullable returns

## Authentication Flow

1. **Initial Auth** - User signs in via Google OAuth or OTP
2. **User Creation** - User record created in `users` table
3. **Organization Setup** - Organization auto-created or user prompted to create
4. **Onboarding** - Multi-step flow to complete setup
5. **Dashboard Access** - Full access after onboarding completion

### Auth Helpers
```tsx
// convex/helpers/auth.ts
export async function getAuthUserId(ctx) {
  // Returns authenticated user ID
}
```

## Styling Guidelines

### Theme Configuration
- Import colors from `/home/honey/code/leadnova/style/hero.ts`
- HeroUI theme with custom Meyoo theme
- Color palette:
  - Primary: Indigo
  - Secondary: Blue
  - Success: Emerald
  - Warning: Orange
  - Danger: Rose
- Light/dark mode support with Zinc base colors

### Component Styling
- Use Tailwind CSS classes
- Leverage HeroUI component variants
- Maintain consistent spacing and typography
- Follow responsive design patterns

## Component Guidelines

### Naming Conventions
- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Hooks:** camelCase with 'use' prefix (e.g., `useDebounce.ts`)
- **Utilities:** camelCase (e.g., `formatDate.ts`)
- **Convex functions:** camelCase (e.g., `createUser`, `listMessages`)

### Component Organization
- Place feature-specific components in feature folders
- Share reusable components in `/components/shared`
- Keep micro components small and focused
- Extract complex logic into custom hooks

### Form Handling
- Use controlled components with React state
- Validate on client before Convex mutations
- Show loading states during async operations
- Handle errors gracefully with user feedback

## Path Aliases

Configure TypeScript and build tools to use:
- `@/*` - Project root
- `@configs/*` - Config files directory
- `@/components/*` - Components directory
- `@/hooks/*` - Hooks directory
- `@/lib/*` - Utilities directory

## Error Handling

### Client-Side
- Wrap Convex calls in try-catch blocks
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback UI for error states

### Server-Side (Convex)
- Validate inputs early
- Throw descriptive errors
- Use proper HTTP status codes
- Handle edge cases gracefully

## Testing Strategy

### Unit Tests
- Test utility functions in `/lib`
- Test custom hooks with React Testing Library
- Mock Convex queries/mutations

### Integration Tests
- Test complete user flows
- Verify onboarding process
- Test authentication flows
- Validate organization management

## Performance Optimization

### Next.js Optimizations
- Use Turbopack for faster builds
- Implement proper code splitting
- Optimize images with Next.js Image component
- Use dynamic imports for heavy components

### Convex Optimizations
- Design efficient indexes
- Minimize query complexity
- Use pagination for large datasets
- Cache frequently accessed data

## Security Best Practices

### Authentication
- Always verify user authentication in Convex functions
- Use role-based access control
- Validate user permissions before operations
- Secure sensitive operations with additional checks

### Data Protection
- Never expose sensitive data in client components
- Sanitize user inputs
- Use environment variables for secrets
- Implement rate limiting for public endpoints

## Deployment

### Environment Variables
Required environment variables:
- `CONVEX_DEPLOYMENT` - Convex deployment URL
- `NEXT_PUBLIC_CONVEX_URL` - Public Convex URL
- `AUTH_SECRET` - Authentication secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `RESEND_API_KEY` - Resend API key

### Production Checklist
- [ ] Run `bun run typecheck` - Ensure no TypeScript errors
- [ ] Run `bun run lint` - Fix all linting issues
- [ ] Test all critical user flows
- [ ] Verify environment variables
- [ ] Deploy Convex backend with `bunx convex deploy`
- [ ] Deploy Next.js to Vercel or preferred platform

## Important Instruction Reminders

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary
- ALWAYS prefer editing existing files over creating new ones
- NEVER proactively create documentation files unless explicitly requested
- Follow existing patterns and conventions in the codebase
- Maintain consistency with established architecture