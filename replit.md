# Irma's Pizzelles - E-commerce Website

## Overview

This is a full-stack e-commerce website for "Irma's Pizzelles," a small business selling handcrafted traditional Italian pizzelle cookies. The application features a modern React frontend with a Node.js/Express backend, designed for premium food e-commerce with Italian heritage aesthetics.

**Core Business Features:**
- Product catalog with pizzelle varieties (anise, vanilla, chocolate)
- Shopping cart with 1-5 dozen per order limit
- Waitlist signup for notifications
- User authentication (login/signup)
- Checkout with shipping information collection
- Responsive design with light/dark theme support

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React with TypeScript, using Vite as the build tool
- **Routing:** Wouter for client-side navigation (lightweight alternative to React Router)
- **State Management:** 
  - React Context for cart state (`CartProvider`) and theme (`ThemeProvider`)
  - TanStack Query for server state management and API calls
- **UI Components:** shadcn/ui component library built on Radix UI primitives
- **Styling:** Tailwind CSS with custom design tokens following Italian premium aesthetic (warm cream/gold/brown palette with Playfair Display and Lato fonts)
- **Forms:** React Hook Form with Zod validation

### Backend Architecture
- **Runtime:** Node.js with Express.js
- **API Pattern:** RESTful API with `/api` prefix for all routes
- **Database:** PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management:** Express sessions with connect-pg-simple for PostgreSQL session storage
- **Storage Interface:** Abstracted `IStorage` interface allowing swap between in-memory and database implementations

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components (layout, sections, ui primitives)
│   │   ├── pages/        # Route pages (home, shop, about, faq, etc.)
│   │   ├── lib/          # Utilities, contexts, query client
│   │   └── hooks/        # Custom React hooks
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── db.ts         # Database connection
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle schema definitions
└── migrations/       # Database migrations
```

### Key Design Decisions

1. **Monorepo Structure:** Frontend and backend in single repository with shared TypeScript types via `@shared/*` path alias. Simplifies deployment and type safety across the stack.

2. **Component Library:** Using shadcn/ui provides accessible, customizable components without heavy bundle size. Components are copied into the project for full control.

3. **Database Abstraction:** The `IStorage` interface allows the app to run with in-memory storage during development and switch to PostgreSQL for production without code changes.

4. **Build Process:** Custom build script bundles server dependencies for faster cold starts on Replit, using esbuild for the server and Vite for the client.

## External Dependencies

### Database
- **PostgreSQL:** Primary database, configured via `DATABASE_URL` environment variable
- **Drizzle ORM:** Schema-first approach with `drizzle-kit` for migrations

### Planned Integrations (from requirements)
- **Stripe:** Payment processing for checkout (referenced in build allowlist)
- **Nodemailer/SendGrid:** Automated email receipts and waitlist confirmations
- **Shippo/EasyPost:** Shipping label generation for admin

### Key NPM Packages
- `express` + `express-session` - Server framework and session handling
- `drizzle-orm` + `drizzle-zod` - Database ORM with Zod schema generation
- `@tanstack/react-query` - Data fetching and caching
- `react-hook-form` + `@hookform/resolvers` - Form handling with validation
- `zod` - Schema validation for forms and API
- Full Radix UI primitive set for accessible components

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - For express-session (when implemented)
- Additional keys needed for Stripe, email, and shipping integrations