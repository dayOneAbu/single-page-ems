# Employee Management System

A modern, responsive Employee Management and Registration web application built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and persistent **SQLite** storage via Node.js native `node:sqlite`.

---

## Features

- **Employee Directory**: Interactive, searchable, and filterable data table powered by TanStack React Table.
- **Comprehensive Registration**: Multi-section employee onboarding form (Personal Info, Address, Identity, Employment, Emergency Contacts, Education, Banking, Skills).
- **Zod Schema Validation**: Robust client- and server-side validation with `react-hook-form` and `@hookform/resolvers/zod`.
- **Built-in SQLite Storage**: Zero-config persistent database using native `node:sqlite` (`DatabaseSync`) with automatic table creation and initial sample seeding.
- **Live Health Status**: Real-time database connection monitoring pill directly in the header.
- **Production-Ready Dockerization**: Multi-stage Docker build utilizing Next.js standalone output for a lightweight (~82 MB) runtime image running under a non-root user.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), `@base-ui/react`
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Data Table**: [TanStack Table v9](https://tanstack.com/table)
- **Database**: Native SQLite (`node:sqlite`) with Write-Ahead Logging (WAL)
- **Runtime & Package Manager**: [Bun](https://bun.sh/) (v1.4+) / [Node.js](https://nodejs.org/) (v22+)
- **Containerization**: [Docker](https://www.docker.com/) (Multi-stage build with `node:22-alpine` runner)

---

## Project Structure

```text
page-form/
├── app/
│   ├── api/
│   │   ├── employees/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts       # GET, PUT, DELETE single employee
│   │   │   └── route.ts           # GET (list/filter) & POST (create) employees
│   │   └── health/
│   │       └── route.ts           # SQLite database health probe
│   ├── favicon.ico
│   ├── globals.css                # Tailwind CSS v4 theme and styling
│   ├── layout.tsx                 # Root layout with typography and toasts
│   └── page.tsx                   # Main page (tabs: Directory & Registration)
├── components/
│   ├── employe-form.tsx           # Multi-section employee registration form
│   ├── employees/
│   │   ├── employee-data.ts       # Department, country, and form static options
│   │   ├── employee-dialog.tsx    # Employee detail & edit dialog modal
│   │   └── employees-table.tsx    # TanStack table with search and filters
│   └── ui/                        # Reusable accessible UI component primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── field.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── table.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       └── toaster.tsx
├── hooks/
│   └── use-toast.ts               # Toast notification hook
├── lib/
│   ├── api-client.ts              # Frontend client functions for API routes
│   ├── db.ts                      # SQLite database connection, queries, and seeding
│   ├── employee-types.ts          # TypeScript interfaces and Zod validation schema
│   ├── node-sqlite.d.ts           # Type definitions for node:sqlite
│   └── utils.ts                   # Utility functions (cn styling helper)
├── public/                        # Static assets (SVGs, logos)
├── .dockerignore                  # Docker build context exclusions
├── Dockerfile                     # Multi-stage optimized Dockerfile
├── next.config.ts                 # Next.js standalone and Turbopack configuration
├── package.json                   # Dependencies and scripts (bun-managed)
├── tsconfig.json                  # TypeScript compiler configuration
└── README.md                      # Documentation
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `v1.4.0` or higher (or [Node.js](https://nodejs.org/) `v22.5.0+`)

### Installation

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd page-form
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

Run the development server:

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

1. Build the application:
   ```bash
   bun run build
   ```

2. Start the production server:
   ```bash
   bun start
   # or run the standalone output directly:
   node .next/standalone/server.js
   ```

---

## Docker Deployment

The application includes an optimized multi-stage [Dockerfile](Dockerfile) utilizing Next.js standalone output:

### 1. Build the Docker Image

```bash
docker build -t page-form:latest .
```

### 2. Run the Container

```bash
docker run -d --name page-form -p 3000:3000 page-form:latest
```

### 3. Persist Database with a Volume (Recommended)

Because SQLite writes `employees.db` directly in `/app`, mount a volume to preserve data across container restarts:

```bash
docker run -d \
  --name page-form \
  -p 3000:3000 \
  -v page_data:/app \
  page-form:latest
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Checks SQLite database connection status |
| `GET` | `/api/employees` | Returns all employees. Supports `?search=` and `?department=` |
| `POST` | `/api/employees` | Validates and creates a new employee |
| `GET` | `/api/employees/:id` | Fetches details for a specific employee |
| `PUT` | `/api/employees/:id` | Validates and updates an existing employee |
| `DELETE` | `/api/employees/:id` | Deletes an employee by ID |

---

## Database Details

- The database file [`employees.db`](employees.db) is initialized automatically on first startup by [`lib/db.ts`](lib/db.ts).
- SQLite runs in **Write-Ahead Logging (WAL)** mode. You may see temporary runtime companions:
  - `employees.db-wal` (Write-Ahead Log)
  - `employees.db-shm` (Shared Memory index)
  These files are actively managed by SQLite and ignored in Git and Docker.
