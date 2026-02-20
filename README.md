# Fiscon

**Version:** 0.0.0

Administrative inspection dashboard for managing outsourced service providers. Fiscon provides a complete workflow for creating, analyzing, and reporting on inspections, with role-based access control, PDF document viewing, and Excel report exports.

## Features

- **Dashboard** — KPI cards, status charts, recent inspections, and quick actions at a glance
- **Inspections** — Create inspections with PDF upload, analyze documents in a split-panel view (editable employee list + embedded PDF viewer), sortable table with status tracking
- **Companies** — Full CRUD management of companies and their nested contracts (admin only)
- **Reports** — Conformance KPIs, trend charts, company conformance tables, problem analysis, and Excel export
- **User Management** — Create and manage users with role-based permissions (admin only)
- **Authentication** — Role-based access with two profiles:
  - **Fiscal** — Dashboard, Inspections, Reports
  - **Administrador** — All features including Companies and User Management
- **Dark Mode** — Theme toggle via `next-themes`

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 + Shadcn/ui |
| Routing | React Router 7 (lazy-loaded pages) |
| Data Fetching | TanStack Query |
| Tables | TanStack Table |
| State Management | Zustand |
| Forms | React Hook Form + Zod v4 |
| Charts | Recharts |
| PDF Viewer | react-pdf |
| Excel Export | xlsx |
| Date Utilities | date-fns |
| Unit Testing | Vitest + Testing Library |
| E2E Testing | Cypress |
| Linting | ESLint (functional programming rules) |
| Formatting | Prettier |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone <repository-url>
cd fiscon
npm install
```

### Development

```bash
npm run dev
```

The dev server starts with HMR at `http://localhost:5173`.

### Mock Credentials

| Email | Password | Role |
|---|---|---|
| admin@fiscon.com | admin | Administrador |
| fiscal@fiscon.com | fiscal | Fiscal |

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | TypeScript compile + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:ui` | Run tests with Vitest UI dashboard |
| `npm run test:coverage` | Generate coverage report |
| `npm run cypress` | Open Cypress E2E UI |
| `npm run cypress:run` | Run Cypress E2E headless |

Run a single test file:

```bash
npx vitest run src/path/to/file.test.ts
```

## Project Structure

```
src/
├── api/                # API layer + mock data store
├── assets/             # Static assets
├── components/
│   ├── guards/         # AuthGuard, AdminGuard
│   ├── layout/         # Header, sidebar, app shell
│   ├── shared/         # Reusable components
│   └── ui/             # Shadcn/ui primitives
├── hooks/              # Custom hooks (TanStack Query wrappers)
├── lib/                # Utilities (cn, excel-export)
├── pages/              # Feature pages
│   ├── dashboard/
│   ├── empresas/
│   ├── fiscalizacoes/
│   ├── login/
│   ├── perfil/
│   ├── relatorios/
│   └── usuarios/
├── schemas/            # Zod validation schemas
├── stores/             # Zustand stores (auth, notifications, sidebar)
├── test/               # Test utilities and setup
├── types/              # TypeScript type definitions
├── main.tsx            # App entry point
└── routes.tsx          # Route definitions
```

### Data Flow

```
Components → Hooks (src/hooks/) → API Layer (src/api/) → Backend
```

- Components never import from `src/api/` directly — always through hooks
- Hooks use TanStack Query (`useQuery`/`useMutation`) with cache invalidation
- The mock API simulates delays and CRUD operations; swap to a real backend by replacing `src/api/*.api.ts` files

## Code Style

This project enforces a **functional programming paradigm** via ESLint:

- **No `let`** — `const` only
- **No loops** — use `.map()`, `.filter()`, `.reduce()`, etc.
- **No mutation** — use spread operators (`[...arr, item]`, `{ ...obj, key: val }`)
- **Readonly types** preferred
- **Import order** — alphabetized, grouped: builtin > external > internal

Formatting (Prettier): no semicolons, double quotes, trailing commas, 90-char line width.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Follow the code style rules — run `npm run lint` before committing
4. Write tests for new features (`npm run test`)
5. Commit your changes (`git commit -m "Add my feature"`)
6. Push to the branch (`git push origin feature/my-feature`)
7. Open a Pull Request

### Guidelines

- Follow the functional programming paradigm enforced by ESLint
- Components should consume data through hooks, never directly from the API layer
- Use Zod schemas for all form and data validation
- Keep pages lazy-loaded via React Router
- Respect the role-based access control — use `AuthGuard` and `AdminGuard` for protected routes
