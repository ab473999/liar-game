# Vite Frontend Migration Plan

## Overview
Complete migration from Next.js (JavaScript) to Vite + React + TypeScript with Zustand state management.

**Important**: Application is **English-only**. All multi-language support has been removed from the backend.

### Migration Strategy
- **Parallel Development**: Run both frontends simultaneously during migration
- **Incremental Migration**: Build and test one page/feature at a time
- **Port Configuration**: 
  - Current Next.js: Port 3000
  - New Vite: Port 5173 (default Vite port)
- **Final Cutover**: Delete old frontend, rename frontend-vite → frontend, update nginx

## IMMEDIATE PRIORITIES (Updated Dec 2024)

### 1. Settings Page (/settings) - 🚀 TOP PRIORITY
Build the main settings page with:
- [ ] Add new theme functionality (name input, auto-generate type)
- [ ] Display list of existing themes (clickable to navigate)
- [ ] Show/hide AI themes toggle
- [ ] Navigation to /settings/[theme.type] on theme click

### 2. Theme Settings Page (/settings/[theme.type]) - 🚀 TOP PRIORITY
Build individual theme management page with:
- [ ] Edit theme name functionality
- [ ] Add new words (name input)
- [ ] Edit existing word names (inline editing)
- [ ] Delete word functionality
- [ ] Back navigation to /settings

### 3. WordReveal Component - HIGH PRIORITY
Build the core game mechanic:
- [ ] Press-and-hold to reveal word/role
- [ ] Show word for normal players
- [ ] Show "You are the Liar" for liar
- [ ] Player counter display
- [ ] Next player button
- [ ] Complete game flow

### 4. Skin System - MEDIUM PRIORITY
Implement theming:
- [ ] CSS variable management for skins
- [ ] Skin switcher component
- [ ] Persist skin preference in localStorage
- [ ] Support all skin themes (dark, light, midnight, ocean, pink, og)

### 5. Cutover - FINAL STEP
Complete migration:
- [ ] Final testing on staging
- [ ] Backup current frontend
- [ ] Stop old frontend service  
- [ ] Rename directories (frontend-vite → frontend)
- [ ] Update nginx configuration
- [ ] Update deployment scripts
- [ ] Restart services
- [ ] Smoke testing

## Current Stack Analysis

### Existing Architecture
```
Next.js (App Router) + JavaScript
├── Context API (GameContext, LanguageContext, SkinContext)
├── Tailwind CSS
├── Component Structure
│   ├── /components/ui/ - Reusable UI components
│   ├── /components/functional/ - Feature components
│   ├── /components/layout/ - Layout components
│   └── /components/contexts/ - Context providers
└── API Integration (Backend port 8001)
```

### Key Features to Migrate
1. **Core Pages**
   - Home (player selection + theme selection)
   - Game (word reveal for all players)
   - Settings (theme management)
   - Theme Settings (word management)

2. **State Management**
   - Player count
   - Theme selection
   - Game flow state
   - Skin/theme switching
   - ~~Language support~~ (Removed - English only)
   - Loading states

3. **UI Systems**
   - Responsive layout system
   - Dark/light/custom skins via CSS variables
   - Tailwind utility classes
   - Icon system (Lucide React)

## Game Mechanics & Navigation Flow

### How the Liar Game Works
The Liar Game is a social deduction party game where:
1. **Setup**: Players select the number of participants and choose a theme
2. **Word Reveal**: Each player privately views their role:
   - Normal players see the secret word
   - One random player (the liar) sees "You are the Liar" instead
3. **Real-Life Discussion**: Players discuss the topic without saying the word directly
4. **Voting**: Players vote on who they think is the liar (happens in person)

### Navigation Flow
```
Home (/)
   │
   ├─[Select Players & Theme]
   │
   ▼
Game (/game)
   │
   ├─Word Reveal Phase
   │  └─Each player takes turn viewing word/role
   │
   └─Options (after all players revealed)
      ├─→ Back to Home (/) - Start new game
      └─→ Replay - Re-do word reveal with same setup
   
Settings (/settings)
   └─[Standalone page for game configuration]
      ├─ Manage themes
      ├─ Add/edit/delete words
      └─ Change UI skin
```

**Note**: The discussion and voting happen in real life, not in the app. The app's role ends after all players have viewed their word/role.

## Migration Phases

### Phase 1: Project Setup & Foundation
**Status**: ✅ COMPLETED

- [x] Initialize Vite project with React + TypeScript
- [x] Configure TypeScript (tsconfig.json)
- [x] Set up Tailwind CSS (v3)
- [x] Configure path aliases (@/ imports)
- [ ] Set up ESLint + Prettier (optional, can add later)
- [x] Configure environment variables (.env)
- [x] Set up development scripts
- [x] Configure nginx for HTTPS access on port 5173
- [x] Test app running at https://liar.nyc:5173

**Key Files**:
```
frontend-vite/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .env
└── .env.example
```

### Phase 2: Core Infrastructure
**Status**: ✅ COMPLETED

- [x] **TypeScript Types & Interfaces**
  - [x] Define Theme, Word, GameState types
  - [x] API response types
  - [x] Store state types

- [x] **API Layer**
  - [x] Create API service class
  - [x] Type definitions for API responses
  - [x] Error handling utilities
  - [x] Custom hooks for data fetching
  - [x] **Test API calls in App.tsx** (verify themes & words endpoints)
  - [x] Fix CORS issues for Vite development

**Key Files Created**:
```
frontend-vite/src/
├── types/
│   └── index.ts     ✅ (TypeScript interfaces)
├── services/
│   └── api.ts       ✅ (API service class)
├── hooks/
│   └── useApi.ts    ✅ (React hooks for API)
└── App.tsx          ✅ (API testing interface)
```

### Phase 3: Component Library Migration & Core Setup
**Status**: ✅ COMPLETED

**Order of Implementation & Rationale:**
1. **Layout Components First** - Establishes the visual structure without dependencies
2. **React Router Second** - Enables navigation between pages once layout exists
3. **Zustand Third** - Add state management as we build actual components
4. **Components Last** - Build with routing and state management already in place

#### 3.1 Layout Components
**Status**: ✅ COMPLETED
- [x] Create `components/layout/Layout.tsx` - Main wrapper (min-h-screen flex flex-col)
- [x] Create `components/layout/Header.tsx` - Fixed header (sticky top-0)
- [x] Create `components/layout/MainContent.tsx` - Scrollable content (flex-1 flex flex-col)
- [x] Create `components/layout/MainContentTop.tsx` - Top section for player counter
- [x] Create `components/layout/MainContentBody.tsx` - Body section for main content
- [x] Refactor App.tsx to use Layout component

#### 3.2 React Router Setup
**Status**: ✅ COMPLETED
- [x] Install React Router v6
- [x] Transform App.tsx to router setup
- [x] Define initial routes:
  - `/` - Home page
  - `/game` - Game page  
  - `/settings` - Settings page
- [x] Create page components
- [x] Add React Router v7 future flags to prevent warnings

#### 3.3 Zustand Store Setup
**Status**: ✅ COMPLETED
- [x] Install Zustand
- [x] Game store (player count, theme, game state, liar position)
- [x] Store persistence with localStorage
- [x] DevTools integration for debugging
- [x] Create store hooks and exports

#### 3.4 UI Components
**Status**: ✅ PARTIALLY COMPLETED
- [x] ThemeBox - Theme selection boxes
- [ ] IconButton - Reusable icon button (needed for settings)
- [ ] WordBox - Word display/edit component (needed for settings)
- [ ] LoadingState - Loading spinner component

#### 3.5 Functional Components
**Status**: ✅ PARTIALLY COMPLETED
- [x] PlayerCounter - Player number selector with increment/decrement
- [x] ThemeGrid - Grid of theme boxes with selection logic
- [x] Placeholder - API testing component (can be removed later)
- [ ] ThemeForm - Form for adding/editing themes
- [ ] AddNewWord - Form for adding words

**Type Definitions Required**:
```typescript
// Example types needed
interface Theme {
  id: string;
  type: string;
  name: string;  // English only
}

interface Word {
  id: string;
  word: string;  // English only
  themeId: string;
}

interface GameState {
  playerNum: number;
  currentPlayer: number;
  theme: string;
  word: string;
  liarPosition: number;
  stage: 'intro' | 'select' | 'options';
  revealedPlayers: number[];
}
```

### Phase 4: Page Implementation
**Status**: 🔄 In Progress (50%)

#### 4.1 Home Page
**Status**: ✅ COMPLETED
- [x] Port home page layout with MainContentTop/MainContentBody
- [x] Implement PlayerCounter with Zustand
- [x] Implement ThemeGrid with theme selection
- [x] Connect to API for themes
- [x] Random word selection from theme
- [x] Random liar assignment
- [x] Navigation to game page with state

**Working Features**:
- [x] Player count increment/decrement (3-20 players)
- [x] Theme selection and navigation
- [x] API integration for themes and words
- [x] Game state initialization

#### 4.2 Game Flow
**Status**: 🔄 PARTIALLY IMPLEMENTED
- [x] Basic game page structure
- [x] Game state validation (redirect if no state)
- [x] Display theme and player count
- [ ] **WordReveal component** (press-hold mechanic) - NEEDS IMPLEMENTATION
- [ ] Player progression logic
- [ ] Options after all players revealed
- [ ] Replay functionality

**Test Checklist**:
- [ ] Word reveal for each player
- [ ] Liar assignment display
- [ ] Player progression
- [ ] Replay with same setup
- [ ] Navigation back to home

#### 4.3 Settings Pages
**Status**: ⏳ NOT STARTED - TOP PRIORITY
- [ ] Main settings page (/settings)
- [ ] Theme list display
- [ ] Add new theme functionality
- [ ] Navigate to theme details
- [ ] Theme settings page (/settings/[theme])
- [ ] Word CRUD operations
- [ ] AI themes toggle

### Phase 5: Feature Parity
**Status**: ⏳ Not Started

- [ ] **Skin System**
  - [ ] CSS variable management
  - [ ] Skin switcher component
  - [ ] Persist skin preference
  - [ ] All skin themes working

- [ ] ~~**Internationalization**~~ (Removed - English only)
  - ~~Translation system setup~~
  - ~~English translations~~
  - ~~Translation hooks~~

- [ ] **Analytics**
  - [ ] Google Analytics integration
  - [ ] Event tracking

### Phase 6: Testing & Optimization
**Status**: ⏳ Not Started

- [ ] **Unit Tests** 
  - [ ] Zustand stores
  - [ ] Utility functions
  - [ ] API services

- [ ] **Component Tests**
  - [ ] Critical user flows
  - [ ] Form validations
  - [ ] Error states

- [ ] **E2E Tests**
  - [ ] Full word reveal flow (all players)
  - [ ] Settings management
  - [ ] Replay functionality

- [ ] **Performance**
  - [ ] Bundle size optimization
  - [ ] Code splitting
  - [ ] Lazy loading

### Phase 7: Migration Validation
**Status**: ⏳ Not Started

- [ ] Feature comparison checklist
- [ ] Visual regression testing
- [ ] Performance benchmarking
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Accessibility audit

### Phase 8: Cutover
**Status**: ⏳ Not Started

- [ ] Final testing on staging
- [ ] Backup current frontend
- [ ] Stop old frontend service
- [ ] Rename directories
- [ ] Update nginx configuration
- [ ] Update deployment scripts
- [ ] Restart services
- [ ] Smoke testing
- [ ] Monitor for issues

## Technical Decisions

### State Management Architecture
```typescript
// Proposed Zustand store structure
interface GameStore {
  // State
  playerNum: number;
  theme: string | null;
  currentPlayer: number;
  liarPosition: number;
  word: string | null;
  stage: GameStage;
  
  // Actions
  setPlayerNum: (num: number) => void;
  setTheme: (theme: string) => void;
  startGame: () => void;
  nextPlayer: () => void;
  resetGame: () => void;
}

interface UIStore {
  // State
  skin: SkinType;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSkin: (skin: SkinType) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

### Folder Structure
```
frontend-vite/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── features/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Game.tsx
│   │   ├── Settings.tsx
│   │   └── ThemeSettings.tsx
│   ├── stores/
│   │   ├── gameStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useGame.ts
│   │   └── useThemes.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── skins.ts
│   ├── utils/
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
└── package.json
```

## Development Workflow

### Parallel Development Setup
```bash
# Terminal 1: Current Next.js frontend
cd frontend
npm run dev  # Port 3000

# Terminal 2: New Vite frontend
cd frontend-vite
npm run dev  # Port 5173
```

### Testing Strategy
1. **Component-by-component testing**: Test each migrated component in isolation
2. **Page-level testing**: Ensure complete pages work as expected
3. **Flow testing**: Test complete user journeys
4. **A/B testing**: Compare old vs new implementation

## Risk Mitigation

### Potential Challenges
1. **Route handling differences**: Next.js App Router vs React Router
2. **SSR/SSG loss**: Moving from Next.js to pure client-side
3. **Image optimization**: Next.js Image component benefits
4. **API route migration**: If using Next.js API routes

### Mitigation Strategies
- Keep detailed testing checklist
- Maintain feature parity document
- Regular comparison testing
- Incremental rollout capability

## Success Metrics
- ✅ All features working identically to current version
- ✅ Performance equal or better (initial load, interactions)
- ✅ Bundle size reasonable (<500KB gzipped)
- ✅ TypeScript coverage 100%
- ✅ No runtime errors in production
- ✅ All tests passing

## Timeline Estimate
- **Phase 1-2**: 2-3 days (Setup & Infrastructure)
- **Phase 3-4**: 5-7 days (Components & Pages)
- **Phase 5-6**: 3-4 days (Features & Testing)
- **Phase 7-8**: 2-3 days (Validation & Cutover)

**Total: 12-17 days** (assuming full-time development)

## Next Steps
1. Review and approve this plan
2. Set up the Vite project structure
3. Begin Phase 1 implementation
4. Create detailed component migration checklist

---

## Progress Tracker

### Overall Progress: 45% ✅

| Phase              | Status          | Progress | Notes                                                    |
|--------------------|-----------------|----------|----------------------------------------------------------|
| 1. Setup           | ✅ Completed    | 100%     | Vite, TS, Tailwind v3, nginx configured                  |
| 2. Infrastructure  | ✅ Completed    | 100%     | TypeScript types, API service, hooks, CORS fixed         |
| 3. Components      | ✅ Completed    | 100%     | Layout, Router, Zustand, Core components complete        |
| 4. Pages           | 🔄 In Progress  | 50%      | Home complete, Game partial, Settings needed             |
| 5. Features        | ⏳ Not Started  | 0%       | Skins system needed                                      |
| 6. Testing         | ⏳ Not Started  | 0%       | -                                                        |
| 7. Validation      | ⏳ Not Started  | 0%       | -                                                        |
| 8. Cutover         | ⏳ Not Started  | 0%       | -                                                        |

### Daily Log
<!-- Add entries as work progresses -->
| Date         | Phase    | Work Completed                                                                                                                                                                                                                           | Issues/Blockers                                     |
|--------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| -            | -        | Plan created                                                                                                                                                                                                                             | -                                                   |
| Dec 3, 2024  | Phase 1  | ✅ Vite project initialized<br>✅ TypeScript configured<br>✅ Tailwind CSS v3 setup<br>✅ Path aliases configured<br>✅ Environment variables<br>✅ Nginx HTTPS proxy on port 5173<br>✅ Removed custom font (Do Hyeon) → system fonts | Fixed: Tailwind v4 → v3 downgrade for stability    |
| Dec 3, 2024  | Phase 2  | ✅ Core Infrastructure Complete<br>✅ TypeScript types defined<br>✅ API service layer with Axios<br>✅ Custom hooks (useThemes, useWords)<br>✅ API tested in App.tsx<br>✅ CORS configuration fixed<br>✅ Backend updated: Removed all non-English language fields from routes and services | English-only implementation per requirement |
| Dec 2024     | Phase 3  | ✅ All Core Components Complete<br>✅ Layout components (Header, MainContent, MainContentTop/Body)<br>✅ React Router v6 with all routes<br>✅ Zustand store with game state management & persistence<br>✅ PlayerCounter component<br>✅ ThemeGrid with API integration<br>✅ ThemeBox UI component | Full component infrastructure ready |
| Dec 2024     | Phase 4  | ✅ Home Page Complete<br>✅ Player selection (3-20 players)<br>✅ Theme selection with API<br>✅ Random word and liar assignment<br>✅ Navigation to game with state<br>🔄 Basic Game page structure<br>⏳ Settings pages not started | Need: WordReveal component, Settings pages |
