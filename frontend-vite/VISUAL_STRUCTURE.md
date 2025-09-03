# Visual Structure & Component Hierarchy

## 🏗️ Architecture Overview

```
main.tsx (Entry Point)
    ↓
App.tsx (Router/Orchestrator)
    ↓
Layout.tsx (Page Structure)
    ├── Header.tsx (Fixed Navigation)
    └── MainContent.tsx (Scrollable Container)
            ↓
        [Page Components]
```

## 📁 Directory Structure

```
src/
├── main.tsx                    # React entry point, mounts App to DOM
├── App.tsx                      # Main orchestrator, routing logic
├── types/                       # TypeScript type definitions
│   └── index.ts                # Centralized type exports
├── styles/
│   └── globals.css             # Global styles, Tailwind config
├── services/
│   └── api.ts                  # API service singleton
├── hooks/
│   └── useApi.ts               # Custom hooks for API calls
└── components/
    ├── layout/                 # Layout wrapper components
    │   ├── Layout.tsx          # Main layout container
    │   ├── Header.tsx          # App header/navigation
    │   └── MainContent.tsx     # Content wrapper
    ├── functional/             # Business logic components
    │   └── Placeholder.tsx     # Temporary development component
    └── ui/                     # [Future] Pure UI components
```

## 🔄 Import Hierarchy

### Level 0: Entry Point
- **main.tsx**
  - Imports: `App`, `globals.css`
  - Purpose: Bootstrap React application

### Level 1: Application Root
- **App.tsx**
  - Imports: `Layout`, page components (currently `Placeholder`)
  - Purpose: Route management, app-level state orchestration
  - Should NOT contain: UI implementation details, hardcoded content

### Level 2: Layout Components
- **Layout.tsx**
  - Imports: `Header`, `MainContent`
  - Purpose: Define page structure, manage viewport
  - Provides: Consistent app shell for all pages

- **Header.tsx**
  - Imports: None (self-contained)
  - Purpose: App navigation, branding
  - Features: Sticky positioning, safe area handling

- **MainContent.tsx**
  - Imports: None (receives children)
  - Purpose: Content container with scroll management

### Level 3: Page/Feature Components
- **Placeholder.tsx** (Temporary)
  - Imports: `useThemes`, `useWords` hooks
  - Purpose: Development testing, API verification
  - Will be replaced by: Actual game screens

### Level 4: Shared Resources
- **hooks/useApi.ts**
  - Imports: `apiService`, `types`
  - Purpose: Data fetching abstractions
  - Exports: `useThemes`, `useWords`, `useApiMutation`

- **services/api.ts**
  - Imports: `axios`, `types`
  - Purpose: HTTP client configuration, API methods
  - Pattern: Singleton service instance

- **types/index.ts**
  - Imports: None
  - Purpose: Central type definitions
  - Exports: All TypeScript interfaces/types

## 🎯 Design Principles

### Component Responsibilities

1. **App.tsx**
   - Router configuration
   - Global state providers
   - Feature flags/environment config
   - NO hardcoded UI content

2. **Layout Components**
   - Structural styling only
   - Viewport management
   - Responsive behavior
   - NO business logic

3. **Functional Components**
   - Business logic implementation
   - API integration
   - User interactions
   - State management

4. **UI Components** (Future)
   - Pure presentational components
   - Reusable across features
   - Props-driven styling
   - NO direct API calls

### Import Rules

1. **Avoid Circular Dependencies**
   - Components should only import from lower or same levels
   - Shared resources (types, utils) can be imported anywhere

2. **Centralized Exports**
   - Types from `@/types`
   - API hooks from `@/hooks/useApi`
   - Services from `@/services`

3. **Path Aliases**
   - Use `@/` for src directory
   - Configured in `tsconfig.json` and `vite.config.ts`

## 🚀 Future Structure

When implementing actual game features:

```
components/
├── functional/
│   ├── game/
│   │   ├── GameIntro.tsx      # Welcome screen
│   │   ├── ThemeSelect.tsx    # Theme selection
│   │   ├── WordReveal.tsx     # Word display
│   │   └── GamePlay.tsx       # Main game screen
│   └── settings/
│       └── ThemeManager.tsx   # Theme CRUD operations
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    ├── Modal.tsx
    └── LoadingSpinner.tsx
```

## 🔧 Development Workflow

1. **New Features**: Start in `components/functional/`
2. **Reusable UI**: Extract to `components/ui/`
3. **API Integration**: Create hooks in `hooks/`
4. **Type Safety**: Define types in `types/index.ts`
5. **Routing**: Update `App.tsx` to include new pages

## 📝 Notes

- The current `Placeholder.tsx` is temporary for development
- When adding routing, consider React Router or TanStack Router
- State management (if needed) should be added at App.tsx level
- Keep Layout components thin - they're just structure
