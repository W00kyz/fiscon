# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

fiscon is a dashboard de fiscalização administrativa de terceirizadas. React 19 + TypeScript + Vite + Shadcn/ui + Tailwind CSS v4. Stack: React Router 7, TanStack Query, TanStack Table, Zustand, Zod v4, Recharts, React Hook Form, date-fns, xlsx.

## Commands

- `npm run dev` — start dev server with HMR
- `npm run build` — TypeScript compile + production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
- `npm run lint:fix` — run ESLint with auto-fix
- `npm run test` — run unit tests (Vitest)
- `npm run test:ui` — run tests with Vitest UI dashboard
- `npm run test:coverage` — generate coverage report
- `npm run cypress` — open Cypress E2E UI
- `npm run cypress:run` — run Cypress E2E headless

To run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

- **Entry:** `src/main.tsx` — QueryClientProvider + TooltipProvider + RouterProvider + Toaster
- **Routing:** `src/routes.tsx` — React Router 7 (`react-router` not `react-router-dom`), lazy-loaded pages, AuthGuard + AdminGuard
- **Path alias:** `@/*` → `./src/*` (configured in tsconfig.app.json + vite.config.ts)

### Data Flow

Components → Hooks (`src/hooks/`) → API Layer (`src/api/`) → Mock Store (`src/api/mock-data/store.ts`)

- **Components never import from `src/api/` directly** — always via hooks
- **Hooks** use TanStack Query (useQuery/useMutation) with cache invalidation
- **Mock API** simulates delays and CRUD operations; swap to real backend by replacing `src/api/*.api.ts` files
- **Zustand stores** (`src/stores/`): auth (persisted), notifications, sidebar state

### Key Modules

- **Dashboard** (`/`) — KPIs, status charts, quick actions
- **Fiscalizações** (`/fiscalizacoes`) — sortable table (finalizado always last), creation with PDF upload, analysis page with split-panel (editable employee list + PDF viewer)
- **Empresas** (`/empresas`) — Admin only, CRUD with nested contratos
- **Relatórios** (`/relatorios`) — Filterable reports, Excel export (xlsx library)
- **Usuários** (`/usuarios`) — Admin only, user management

### User Roles

- **Fiscal**: Dashboard, Fiscalizações, Relatórios
- **Administrador**: All above + Empresas, Usuários

### Mock Auth

- admin@fiscon.com / admin (administrador)
- fiscal@fiscon.com / fiscal (fiscal)

## Code Style Rules

**Functional programming paradigm** enforced via ESLint:

- **No `let`** — use `const` only (`functional/no-let: error`)
- **No loops** — use `.map()`, `.filter()`, `.reduce()`, etc. (`functional/no-loop-statements: error`)
- **No mutation** — no `obj.prop = x`, no `.push()` (`functional/immutable-data: error`, `no-param-reassign: error`). Use spread: `[...arr, item]`, `{ ...obj, key: val }`, `array.toSorted()`
- **Prefer readonly types** (`functional/prefer-readonly-type: warn`)
- **Import order:** alphabetized, grouped as builtin → external → internal

**ESLint overrides** (controlled mutation exceptions):
- `src/components/ui/**` — Shadcn generated code
- `src/api/mock-data/store.ts` — mock database
- `src/lib/excel-export.ts` — xlsx library
- `**/*.test.*` — test files

### Formatting (Prettier)

- No semicolons
- Double quotes
- Trailing commas everywhere
- 90-character line width

## Zod v4 + react-hook-form

Use `z.number()` not `z.coerce.number()` for form schemas — `z.coerce` causes type incompatibility with `@hookform/resolvers`. Use `{ valueAsNumber: true }` in register() for number inputs.
