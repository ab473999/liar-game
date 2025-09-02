# Component Reorganization Refactoring Guide

## Overview
This guide outlines the refactoring process to reorganize components into three distinct categories:
- **layout**: Core layout components (Layout, Header, MainContent)
- **functional**: Feature-specific components (forms, grids, selectors)
- **ui**: Reusable UI primitives (buttons, boxes, states)

## Directory Structure

```
frontend/
├── app/                                      # Next.js pages (assembled views)
│   ├── layout.js                             # Root layout using Layout component
│   ├── page.js                               # Home page using PlayerSelector, ThemeGrid
│   ├── game/
│   │   └── page.js                           # Game page using PlayerWordReveal
│   └── settings/
│       ├── page.js                           # Settings page using ThemeForm, ThemeGrid
│       └── [theme]/
│           └── page.js                       # Theme page using AddNewWord, WordsTable
│
└── components/
    ├── layout/                               # Core layout components
    │   ├── Layout.js           ✅ NEW        # Main layout wrapper
    │   ├── Header.js           ✅ MOVE       # Move from components/
    │   └── MainContent.js      ✅ NEW        # Main content wrapper
    │
    ├── functional/                           # Feature-specific components
    │   ├── ThemeGrid.js        ✅ NEW        # Extract from app/page.js
    │   ├── PlayerSelector.js   ✅ NEW        # Extract from app/page.js
    │   ├── LoadingState.js     ✅ NEW        # Extract from app/page.js
    │   ├── ThemeForm.js        ✅ NEW        # Extract from app/settings/page.js
    │   ├── AddNewWord.js       ✅ NEW        # Extract from app/settings/[theme]/page.js
    │   ├── WordsTable.js       ✅ NEW        # Extract from app/settings/[theme]/page.js
    │   └── PlayerWordReveal.js ✅ RENAME     # Rename PressHoldReveal.js
    │
    ├── ui/                                   # Reusable UI primitives
    │   ├── ThemeBox.js         ✅ NEW        # Individual theme button
    │   ├── WordBox.js          ✅ NEW        # Individual word row
    │   └── IconButton.js       ✅ NEW        # Reusable icon button
    │
    ├── contexts/                             # Context providers
    │   ├── GameContextWrapper.js ✅ MOVE     # Move from components/
    │   ├── LanguageContext.js    ✅ MOVE     # Move from components/
    │   └── SkinContext.js        ✅ MOVE     # Move from components/
    │
    └── functional/                           # (continued)
        ├── skin_switcher/                    # Skin switching functionality
        │   └── SkinSwitcher.js   ✅ MOVE     # Move from components/
        ├── game/                             # Game-specific components
        │   ├── Select.js         ✅ MOVE     # Move from components/
        │   ├── Play.js           ✅ MOVE     # Move from components/
        │   └── Intro.js          ✅ MOVE     # Move from components/
        └── utilities/                        # Utility components
            └── DocumentTitle.js  ✅ MOVE     # Move from components/
```

## Refactoring Tasks

### Phase 1: Create Directory Structure
- [ ] Create `components/layout/` directory
- [ ] Create `components/functional/` directory
- [ ] Create `components/functional/skin_switcher/` directory
- [ ] Create `components/functional/game/` directory
- [ ] Create `components/functional/utilities/` directory
- [ ] Create `components/ui/` directory
- [ ] Create `components/contexts/` directory

### Phase 2: Create UI Components

#### 1. IconButton Component
- [ ] Create `components/ui/IconButton.js`
- [ ] Props: `icon`, `onClick`, `href`, `ariaLabel`, `variant`
- [ ] Support both Link and button elements
- [ ] Apply consistent styling from current buttons

#### 2. ThemeBox Component
- [ ] Create `components/ui/ThemeBox.js`
- [ ] Extract theme button styling from `app/page.js`
- [ ] Props: `theme`, `onClick`

#### 3. WordBox Component
- [ ] Create `components/ui/WordBox.js`
- [ ] Extract word row from `app/settings/[theme]/page.js`
- [ ] Props: `word`, `onUpdate`, `onDelete`, `saving`

### Phase 3: Create/Move Layout Components

#### 1. Move Header
- [ ] Move `components/Header.js` to `components/layout/Header.js`
- [ ] Update imports to use IconButton
- [ ] Update all pages importing Header

#### 2. Create Layout Component
- [ ] Create `components/layout/Layout.js`
- [ ] Extract layout logic from `app/layout.js`
- [ ] Include providers and wrappers

#### 3. Create MainContent Component
- [ ] Create `components/layout/MainContent.js`
- [ ] Extract main content wrapper from `app/layout.js`
- [ ] Props: `children`

### Phase 4: Create Functional Components

#### 1. ThemeGrid Component
- [ ] Create `components/functional/ThemeGrid.js`
- [ ] Extract theme grid from `app/page.js` and `app/settings/page.js`
- [ ] Use ThemeBox component
- [ ] Props: `themes`, `onThemeSelect`, `linkTo`

#### 2. PlayerSelector Component
- [ ] Create `components/functional/PlayerSelector.js`
- [ ] Extract player selector from `app/page.js`
- [ ] Props: `playerNum`, `setPlayerNum`, `min`, `max`

#### 3. LoadingState Component
- [ ] Create `components/functional/LoadingState.js`
- [ ] Extract loading state from `app/page.js`
- [ ] Make it reusable with customizable text

#### 4. ThemeForm Component
- [ ] Create `components/functional/ThemeForm.js`
- [ ] Extract theme creation form from `app/settings/page.js`
- [ ] Props: `onSubmit`, `onCancel`

#### 5. AddNewWord Component
- [ ] Create `components/functional/AddNewWord.js`
- [ ] Extract word creation form from `app/settings/[theme]/page.js`
- [ ] Props: `onSubmit`

#### 6. WordsTable Component
- [ ] Create `components/functional/WordsTable.js`
- [ ] Extract words list from `app/settings/[theme]/page.js`
- [ ] Use WordBox component
- [ ] Props: `words`, `onUpdate`, `onDelete`

#### 7. Rename PressHoldReveal
- [ ] Rename `components/PressHoldReveal.js` to `components/functional/PlayerWordReveal.js`
- [ ] Update all imports

### Phase 5: Update Pages

#### 1. Update app/layout.js
- [ ] Import Layout from `components/layout/Layout`
- [ ] Simplify to use Layout component
- [ ] Remove extracted logic

#### 2. Update app/page.js
- [ ] Import ThemeGrid, PlayerSelector, LoadingState
- [ ] Replace inline implementations with components
- [ ] Clean up component logic

#### 3. Update app/settings/page.js
- [ ] Import ThemeForm, ThemeGrid, LoadingState
- [ ] Replace inline implementations with components
- [ ] Clean up component logic

#### 4. Update app/settings/[theme]/page.js
- [ ] Import AddNewWord, WordsTable, LoadingState
- [ ] Replace inline implementations with components
- [ ] Clean up component logic

#### 5. Update app/game/page.js
- [ ] Update imports for renamed PlayerWordReveal
- [ ] Import IconButton for Play component

#### 6. Update components/Play.js
- [ ] Import and use IconButton for navigation buttons
- [ ] Clean up button implementations

#### 7. Update components/Select.js
- [ ] Update import for PlayerWordReveal

### Phase 6: Move Existing Components

#### 1. Move Context Providers
- [ ] Move `GameContextWrapper.js` to `components/contexts/`
- [ ] Move `LanguageContext.js` to `components/contexts/`
- [ ] Move `SkinContext.js` to `components/contexts/`
- [ ] Update all imports for context providers

#### 2. Move Functional Components
- [ ] Move `SkinSwitcher.js` to `components/functional/skin_switcher/`
- [ ] Move `Select.js` to `components/functional/game/`
- [ ] Move `Play.js` to `components/functional/game/`
- [ ] Move `Intro.js` to `components/functional/game/`
- [ ] Move `DocumentTitle.js` to `components/functional/utilities/`
- [ ] Update all imports for moved components

### Phase 7: Cleanup and Testing

#### 1. Remove Old Files
- [ ] Delete old Header.js location after moving
- [ ] Delete old PressHoldReveal.js after renaming
- [ ] Clean up root components/ directory

#### 2. Update Imports
- [ ] Search for all old import paths and update them
- [ ] Ensure all components are importing from correct locations

#### 3. Test All Pages
- [ ] Test home page functionality
- [ ] Test settings page functionality
- [ ] Test theme management page
- [ ] Test game flow
- [ ] Test responsive behavior

## Component Specifications

### IconButton Props
```jsx
{
  icon: ReactElement,      // The icon component
  onClick?: Function,      // Click handler (for buttons)
  href?: string,          // Link destination (for links)
  ariaLabel: string,      // Accessibility label
  variant?: 'primary' | 'secondary' | 'danger', // Style variant
  size?: 'sm' | 'md' | 'lg'  // Size variant
}
```

### ThemeGrid Props
```jsx
{
  themes: Array<Theme>,    // Array of theme objects
  onThemeSelect?: Function, // Handler when theme is selected
  linkTo?: string,         // Base path for theme links (e.g., "/settings/")
  columns?: number         // Number of grid columns (default: 3)
}
```

### PlayerSelector Props
```jsx
{
  playerNum: number,       // Current player count
  setPlayerNum: Function,  // Update handler
  min?: number,           // Minimum players (default: 3)
  max?: number            // Maximum players (default: 20)
}
```

## Benefits After Refactoring

1. **Separation of Concerns**: Clear distinction between layout, functionality, and UI
2. **Reusability**: Components like IconButton and ThemeGrid can be reused
3. **Maintainability**: Easier to find and update specific components
4. **Consistency**: Shared components ensure consistent styling
5. **Testing**: Smaller components are easier to unit test
6. **Performance**: Potential for better optimization with focused components

## Progress Tracker

- [x] Phase 1: Directory Structure (7/7) ✅
- [x] Phase 2: UI Components (3/3) ✅
- [x] Phase 3: Layout Components (3/3) ✅
- [x] Phase 4: Functional Components (7/7) ✅
- [x] Phase 5: Update Pages (7/7) ✅
- [x] Phase 6: Move Existing Components (10/10) ✅
- [x] Phase 7: Cleanup and Testing (3/3) ✅

**Total Progress: 40/40 tasks completed** 🎉

## Notes

- Maintain all existing functionality
- Preserve current styling using CSS variables
- Keep components flexible for future enhancements
- Document prop types in each component
- Consider adding PropTypes or TypeScript in future
