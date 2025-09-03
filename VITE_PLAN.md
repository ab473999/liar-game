# Vite Frontend Migration Plan

## Overview
Complete migration from Next.js (JavaScript) to Vite + React + TypeScript with Zustand state management.

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
   - Game (word reveal + play stages)
   - Settings (theme management)
   - Theme Settings (word management)

2. **State Management**
   - Player count
   - Theme selection
   - Game flow state
   - Skin/theme switching
   - Language support
   - Loading states

3. **UI Systems**
   - Responsive layout system
   - Dark/light/custom skins via CSS variables
   - Tailwind utility classes
   - Icon system (Lucide React)

## Migration Phases

### Phase 1: Project Setup & Foundation
**Status**: ⏳ Not Started

- [ ] Initialize Vite project with React + TypeScript
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Set up Tailwind CSS
- [ ] Configure path aliases (@/ imports)
- [ ] Set up ESLint + Prettier
- [ ] Configure environment variables (.env)
- [ ] Set up development scripts

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
**Status**: ⏳ Not Started

- [ ] **Zustand Store Setup**
  - [ ] Game store (player count, theme, game state)
  - [ ] UI store (skin/theme, language)
  - [ ] API store (loading states, error handling)

- [ ] **Routing Setup**
  - [ ] Install and configure React Router v6
  - [ ] Define route structure
  - [ ] Create route guards/wrappers

- [ ] **API Layer**
  - [ ] Create API service class
  - [ ] Type definitions for API responses
  - [ ] Error handling utilities
  - [ ] Custom hooks for data fetching

**Key Files**:
```
frontend-vite/src/
├── stores/
│   ├── gameStore.ts
│   ├── uiStore.ts
│   └── apiStore.ts
├── services/
│   ├── api.ts
│   └── types.ts
├── hooks/
│   └── useApi.ts
└── router/
    └── index.tsx
```

### Phase 3: Component Library Migration
**Status**: ⏳ Not Started

#### 3.1 Layout Components
- [ ] Layout wrapper
- [ ] Header component
- [ ] MainContent wrapper
- [ ] Navigation components

#### 3.2 UI Components
- [ ] IconButton
- [ ] ThemeBox
- [ ] WordBox
- [ ] LoadingState

#### 3.3 Form Components
- [ ] PlayerSelector
- [ ] ThemeForm
- [ ] AddNewWord

**Type Definitions Required**:
```typescript
// Example types needed
interface Theme {
  id: string;
  type: string;
  nameEn: string;
  nameKo?: string;
  nameIt?: string;
}

interface Word {
  id: string;
  word: string;
  themeId: string;
}

interface GameState {
  playerNum: number;
  currentPlayer: number;
  theme: string;
  word: string;
  liarPosition: number;
  stage: 'select' | 'play';
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
- [ ] Port Play component (discussion phase)
- [ ] Implement PlayerWordReveal (press-hold mechanic)
- [ ] Game state management with Zustand
- [ ] Replay functionality

**Test Checklist**:
- [ ] Word reveal for each player
- [ ] Liar assignment logic
- [ ] Stage transitions
- [ ] Replay word reveal

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

- [ ] **Internationalization**
  - [ ] Translation system setup
  - [ ] English translations
  - [ ] Translation hooks

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
  - [ ] Complete game flow
  - [ ] Settings management

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
  language: 'en' | 'ko' | 'it';
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSkin: (skin: SkinType) => void;
  setLanguage: (lang: Language) => void;
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
│   │   ├── useThemes.ts
│   │   └── useTranslation.ts
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

### Overall Progress: 0% ⏳

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| 1. Setup | ⏳ Not Started | 0% | - |
| 2. Infrastructure | ⏳ Not Started | 0% | - |
| 3. Components | ⏳ Not Started | 0% | - |
| 4. Pages | ⏳ Not Started | 0% | - |
| 5. Features | ⏳ Not Started | 0% | - |
| 6. Testing | ⏳ Not Started | 0% | - |
| 7. Validation | ⏳ Not Started | 0% | - |
| 8. Cutover | ⏳ Not Started | 0% | - |

### Daily Log
<!-- Add entries as work progresses -->
| Date | Phase | Work Completed | Issues/Blockers |
|------|-------|----------------|-----------------|
| - | - | Plan created | - |
