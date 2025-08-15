# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Mahuru Activation 2025** platform - a comprehensive te reo Māori learning platform featuring 30 days of progressive language activation activities. Built with Next.js 15 and Firebase, it's designed for Te Wānanga o Aotearoa.

## Common Development Commands

### Development & Build
```bash
bun dev                    # Start development server with Turbopack
bun build                  # Build for production
bun start                  # Start production server
```

### Code Quality
```bash
bun run lint               # TypeScript checking and linting (runs tsc --noEmit && next lint)
bun run format             # Code formatting with Biome
```

### Testing
This project currently has no test suite configured. All commands are focused on development, building, and deployment.

### Firebase Management
```bash
bun run firebase:setup     # Interactive Firebase setup script
bun run firebase:validate  # Validate Firebase configuration
bun run firebase:check     # Quick validation check
bun run setup              # Complete setup (interactive + validation)
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Backend**: Firebase (Authentication, Firestore)  
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI primitives
- **Package Manager**: Bun
- **Linting**: ESLint + Next.js config
- **Formatting**: Biome

### Key Architecture Patterns

**Context-Based State Management**: The app uses React Context providers in a layered architecture:
- `AuthProvider` - Firebase authentication state
- `AdminProvider` - Admin permissions and CMS access  
- `CMSProvider` - Content management system data

**Firebase Integration**: Core Firebase services are initialized in `src/lib/firebase.ts` with environment validation and fallback error handling.

**Content Management**: Dynamic content is managed through the CMS system with types defined in `src/types/cms.ts`. Activities are seeded from `src/data/mahuru-activities.ts`.

**Admin System**: Role-based admin access with permissions for content editing, layout management, user management, and analytics.

### Project Structure
```
src/
├── app/                   # Next.js app directory (App Router)
│   ├── admin/            # Admin dashboard and CMS pages
│   ├── activity/[day]/   # Dynamic learning activity pages  
│   └── ...               # Other app routes
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── ui/              # Base UI components (Radix-based)
│   └── firebase/        # Firebase initialization components
├── contexts/            # React context providers (Auth, Admin, CMS)
├── hooks/               # Custom React hooks (useAuth, useCMS, useAdmin)
├── lib/                 # Utility functions and Firebase configuration
│   ├── firebase.ts      # Firebase initialization and config
│   ├── firebase-auth.ts # Authentication utilities
│   └── env-validation.ts # Environment variable validation
├── types/               # TypeScript type definitions
└── data/                # Static data (activities content)
```

### Key Files & Their Purpose

**Core Application**:
- `src/app/layout.tsx` - Root layout with metadata and font configuration
- `src/app/ClientBody.tsx` - Client-side provider wrapper with error boundary
- `src/lib/firebase.ts` - Firebase initialization with environment validation

**Authentication & Authorization**:
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/hooks/useAuth.ts` - Authentication hook with Firebase integration
- `src/lib/firebase-auth.ts` - Authentication utilities and user management

**Content Management**:
- `src/types/cms.ts` - Comprehensive CMS type definitions
- `src/contexts/CMSContext.tsx` - Content management state
- `src/data/mahuru-activities.ts` - Te reo Māori learning activities data

### Environment Configuration

Required environment variables (see `.env.local`):
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_ADMIN_EMAILS
NEXT_PUBLIC_SITE_URL
```

The application includes robust environment validation with fallback error handling in `src/lib/env-validation.ts`.

### Development Notes

**Linting Configuration**: ESLint is configured with Next.js TypeScript rules. The `@typescript-eslint/no-explicit-any` rule is set to "warn" to allow gradual type improvement. Current linting produces warnings about unused variables and imports but no errors.

**Firebase Setup**: Use the provided scripts for Firebase configuration. The app includes validation scripts to ensure proper setup.

**Admin Access**: Admin functionality is protected by role-based permissions defined in the `AdminUser` interface.

**Cultural Content**: The platform features authentic te reo Māori content with 30 progressive learning activities across beginner, intermediate, and advanced levels.