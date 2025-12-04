# PEN2-Stack Frontend

A modern Next.js 15 application with React 19, Tailwind CSS 4, and shadcn/ui components.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Components:** Radix UI, shadcn/ui
- **Forms:** TanStack React Form + Zod validation
- **Data Tables:** TanStack Table
- **Theming:** next-themes

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (main)/       # Main layout group
│   │   │   ├── todos/    # Todo feature pages
│   │   │   └── documents/# Documentation pages
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # Shared UI components
│   │   └── ui/           # shadcn/ui components
│   ├── config/           # App configuration
│   ├── features/         # Shared features (data-table, skeletons)
│   ├── helpers/          # Utility helpers (axios, error-handling)
│   ├── lib/              # Library utilities
│   └── modules/          # Feature modules
│       └── todos/        # Todo module components & actions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🏗️ Architecture Patterns

### Module-Based Structure
Each feature is organized into a dedicated module under `src/modules/`:
- `*.actions.ts` - Server actions for API calls
- `*.tsx` - React components
- `*.const.ts` - Constants and configurations

### Server Actions
Uses Next.js Server Actions for data fetching with `revalidatePath` for cache invalidation.

### Component Patterns
- **Sheets** for create/edit forms (slide-in panels)
- **Data Tables** with TanStack Table for list views
- **Suspense** boundaries with loading skeletons

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 📚 Documentation

Visit `/documents` in the running application for detailed architecture and pattern documentation.
