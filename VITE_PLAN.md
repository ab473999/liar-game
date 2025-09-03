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
│   └── index.ts      ✅ (TypeScript interfaces)
├── services/
│   └── api.ts        ✅ (API service class)
├── hooks/
│   └── useApi.ts     ✅ (React hooks for API)
└── App.tsx          ✅ (API testing interface)
```

### Phase 3: Component Library Migration & Core Setup
**Status**: 🔄 In Progress (50%)

**Order of Implementation & Rationale:**
1. **Layout Components First** - Establishes the visual structure without dependencies
2. **React Router Second** - Enables navigation between pages once layout exists
3. **Zustand Third** - Add state management as we build actual components
4. **Components Last** - Build with routing and state management already in place

#### 3.1 Layout Components (FIRST PRIORITY)
**Status**: ✅ COMPLETED
- [x] Create `components/layout/Layout.tsx` - Main wrapper (min-h-screen flex flex-col)
- [x] Create `components/layout/Header.tsx` - Fixed header (sticky top-0)
- [x] Create `components/layout/MainContent.tsx` - Scrollable content (flex-1 flex flex-col)
- [x] Refactor App.tsx to use Layout component

**Layout Architecture:**
```
App.tsx (will become router wrapper)
  └─ Layout component
      ├─ Header (fixed, h-16)
      └─ MainContent (fills remaining height)
          └─ Page content (scrollable internally)
```

#### 3.2 React Router Setup (SECOND PRIORITY)
**Status**: ✅ COMPLETED
- [x] Install React Router v6
- [x] Transform App.tsx to router setup
- [x] Define initial routes:
  - `/` - Home page
  - `/game` - Game page
  - `/settings` - Settings page
- [x] Create placeholder pages
- [x] Add React Router v7 future flags to prevent warnings

#### 3.3 Zustand Store Setup (THIRD PRIORITY)
- [ ] Install Zustand
- [ ] Game store (player count, theme, game state)
- [ ] UI store (skin/theme settings)
- [ ] Create store hooks

#### 3.4 UI Components
- [ ] IconButton
- [ ] ThemeBox
- [ ] WordBox
- [ ] LoadingState

#### 3.5 Form Components
- [ ] PlayerSelector
- [ ] ThemeForm
- [ ] AddNewWord

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
**Status**: ⏳ Not Started

#### 4.1 Home Page
- [ ] Port home page layout
- [ ] Implement PlayerSelector with Zustand
- [ ] Implement ThemeGrid
- [ ] Connect to API for themes
- [ ] Add loading/error states

**Test Checklist**:
- [ ] Player count increment/decrement
- [ ] Theme selection and navigation
- [ ] Loading state display
- [ ] Error handling

#### 4.2 Game Flow
- [ ] Port Select component (word reveal)
- [ ] Implement PlayerWordReveal (press-hold mechanic)
- [ ] Game state management with Zustand
- [ ] Options page after word reveal (back to home / replay buttons)
- [ ] Replay functionality (re-do word reveal with same setup)

**Test Checklist**:
- [ ] Word reveal for each player
- [ ] Liar assignment logic  
- [ ] Proper liar/word display
- [ ] Replay word reveal
- [ ] Navigation back to home

#### 4.3 Settings Pages
- [ ] Main settings page
- [ ] Theme management
- [ ] Individual theme settings
- [ ] Word CRUD operations

**Test Checklist**:
- [ ] Create new theme
- [ ] Add/edit/delete words
- [ ] Navigation between settings

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

### Overall Progress: 31% ✅

| Phase              | Status          | Progress | Notes                                              |
|--------------------|-----------------|----------|---------------------------------------------------|
| 1. Setup           | ✅ Completed    | 100%     | Vite, TS, Tailwind v3, nginx configured          |
| 2. Infrastructure  | ✅ Completed    | 100%     | TypeScript types, API service, hooks, CORS fixed |
| 3. Components      | 🔄 In Progress  | 50%      | Layout + Router complete, Zustand next           |
| 4. Pages           | ⏳ Not Started  | 0%       | -                                                 |
| 5. Features        | ⏳ Not Started  | 0%       | -                                                 |
| 6. Testing         | ⏳ Not Started  | 0%       | -                                                 |
| 7. Validation      | ⏳ Not Started  | 0%       | -                                                 |
| 8. Cutover         | ⏳ Not Started  | 0%       | -                                                 |

### Daily Log
<!-- Add entries as work progresses -->
| Date         | Phase    | Work Completed                                                                                                                                                                                                                           | Issues/Blockers                                     |
|--------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| -            | -        | Plan created                                                                                                                                                                                                                             | -                                                   |
| Dec 3, 2024  | Phase 1  | ✅ Vite project initialized<br>✅ TypeScript configured<br>✅ Tailwind CSS v3 setup<br>✅ Path aliases configured<br>✅ Environment variables<br>✅ Nginx HTTPS proxy on port 5173<br>✅ Removed custom font (Do Hyeon) → system fonts | Fixed: Tailwind v4 → v3 downgrade for stability    |
| Dec 3, 2024  | Phase 2  | ✅ Core Infrastructure Complete<br>✅ TypeScript types defined<br>✅ API service layer with Axios<br>✅ Custom hooks (useThemes, useWords)<br>✅ API tested in App.tsx<br>✅ CORS configuration fixed<br>✅ Backend updated: Removed all non-English language fields from routes and services | English-only implementation per requirement |
| Dec 3, 2024  | Phase 3.1 | ✅ Layout Components Complete<br>✅ Layout.tsx - Main app wrapper<br>✅ Header.tsx - Sticky header with LIAR branding<br>✅ MainContent.tsx - Flex content container<br>✅ App.tsx refactored to use Layout<br>✅ Placeholder component for API testing | Component architecture established |
| Dec 3, 2024  | Phase 3.2 | ✅ React Router v6 Setup Complete<br>✅ React Router installed<br>✅ App.tsx configured with BrowserRouter<br>✅ Three routes created (/, /game, /settings)<br>✅ Placeholder pages for each route<br>✅ Future flags added for v7 compatibility | Routing infrastructure ready |
