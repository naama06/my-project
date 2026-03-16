# Copilot Instructions for my-project

## Project Overview
This is a **React + TypeScript + Vite** template project. It's a minimal, modern frontend setup with HMR (Hot Module Replacement), ESLint, and TypeScript strict mode enabled.

**Stack:**
- React 19.2
- TypeScript 5.9
- Vite 7.3 (build tool with React plugin)
- ESLint with TypeScript support (flat config)

## Architecture & Key Patterns

### Directory Structure
```
src/
  ├── App.tsx          # Main component with state example
  ├── main.tsx         # React DOM entry point (StrictMode enabled)
  ├── index.css        # Global styles
  ├── App.css          # Component-scoped styles
  └── assets/          # Static imports (React logo, etc.)
```

### Core Setup Pattern
- **Entry point**: `src/main.tsx` initializes React with `createRoot()` and wraps `<App/>` in `StrictMode`
- **Component pattern**: Functional components with hooks (see `App.tsx` for `useState` example)
- **Asset imports**: Static assets are imported as modules (`import viteLogo from '/vite.svg'`)
- **CSS strategy**: Component-scoped CSS files co-located with components (e.g., `App.tsx` + `App.css`)

## Development Workflow

### Build & Run Commands
```bash
npm run dev      # Start dev server with HMR (Vite default: http://localhost:5173)
npm run build    # Compile TypeScript + bundle with Vite
npm run lint     # Run ESLint on all .ts/.tsx files
npm run preview  # Preview production build locally
```

**HMR behavior**: Code changes auto-reload in browser without full refresh. Changes to React components update immediately.

## ESLint Configuration

**Config file**: `eslint.config.js` (flat config format, not legacy .eslintrc)

**Key rules**:
- `@eslint/js` - Base JS recommendations
- `typescript-eslint/recommended` - TypeScript strict checks
- `react-hooks/rules-of-hooks` - Enforce hooks conventions
- `react-refresh` - Warn on non-fast-refresh exports

**Convention**: Components must export as default or use named exports compatible with Fast Refresh (avoid exporting plain objects/functions that lose identity).

## TypeScript Configuration

**Structure**:
- `tsconfig.json` - Root config with references to app/node configs
- `tsconfig.app.json` - App source (src/) with DOM/React lib support
- `tsconfig.node.json` - Build/config files (vite.config.ts, eslint.config.js)

**Key setting**: Likely uses `"strict": true` for app config (enforces null checks, explicit types).

## Development Conventions

1. **React best practices**:
   - Use functional components with hooks
   - Keep components in `src/`, co-locate styles with `.css` files
   - Example: `App.tsx` with state via `useState` hook

2. **Styling**: 
   - Import `.css` files directly in components (`import './App.css'`)
   - No CSS-in-JS framework configured; plain CSS or consider PostCSS if extended

3. **File naming**:
   - Components: PascalCase (`App.tsx`)
   - Utilities/modules: camelCase
   - CSS files: match component name (`App.css`)

4. **Type safety**:
   - Always include explicit return types in functions
   - Use `!` (non-null assertion) sparingly; document why needed (see `main.tsx` root DOM element)

## Common Tasks

**Adding a new component**:
1. Create `src/NewComponent.tsx`
2. Add `NewComponent.css` if needed
3. Import and use in `App.tsx` or parent
4. Export as default or named export

**Running linter checks**: `npm run lint` before commits to catch TypeScript/React rule violations.

**Building for production**: `npm run build` outputs to `dist/` (Vite default), ready for static hosting.

## External Integrations & Notes

- **No testing framework** configured by default (add Jest/Vitest if needed)
- **React Compiler** not enabled (see README for performance considerations)
- **No global state management** (no Redux, Context configured by default)
- **Build output**: Vite bundles to `dist/` with code splitting and CSS extraction

When modifying or extending this project, prioritize maintaining TypeScript strictness and React hook rules via ESLint checks.
