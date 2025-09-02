# Liar Game Frontend Layout Structure

This document describes the visual hierarchy, component arrangement, and sizing system of the Liar Game application after refactoring.

## Width & Height Inheritance System

### Height Inheritance Chain
```
<html> (browser viewport)
  └─ <body> (inherits viewport)
      └─ Layout wrapper div: min-h-screen (minimum viewport height)
          └─ <main>: min-h-screen (redundant, ensures full height)
              └─ Content sections: min-h-[400px] or min-h-[500px] (component-specific)
```

### Width Inheritance Chain
```
<html> (browser viewport)
  └─ <body> (full width)
      └─ Layout wrapper div: full width
          ├─ Header: full width → max-w-6xl container
          └─ <main>: full width → max-w-lg container (default)
              └─ Page-specific overrides:
                  ├─ Settings page: max-w-4xl
                  └─ Theme settings: max-w-2xl
```

## Global Layout Structure (app/layout.js → components/layout/Layout.js)

### Visual Sketch
```
┌─────────────────────────────────────────────────────────────┐
│ <html>                                 WIDTH: viewport      │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ <body>                               WIDTH: 100%      │   │
│ │ ┌─────────────────────────────────────────────────┐   │   │
│ │ │ Layout div                 WIDTH: 100%          │   │   │
│ │ │                            HEIGHT: min-h-screen │   │   │
│ │ │ ┌───────────────────────────────────────────┐   │   │   │
│ │ │ │ Header (fixed)          WIDTH: 100%       │   │   │   │
│ │ │ │                         HEIGHT: h-16      │   │   │   │
│ │ │ │ ┌─────────────────────────────────────┐   │   │   │   │
│ │ │ │ │ max-w-6xl container                 │   │   │   │   │
│ │ │ │ └─────────────────────────────────────┘   │   │   │   │
│ │ │ └───────────────────────────────────────────┘   │   │   │
│ │ │                                                 │   │   │
│ │ │ ┌───────────────────────────────────────────┐   │   │   │
│ │ │ │ <main>               WIDTH: 100%          │   │   │   │
│ │ │ │                      HEIGHT: min-h-screen │   │   │   │
│ │ │ │                      PADDING: pt-16       │   │   │   │
│ │ │ │ ┌─────────────────────────────────────┐   │   │   │   │
│ │ │ │ │ max-w-lg container                  │   │   │   │   │
│ │ │ │ │ (centered via mx-auto)              │   │   │   │   │
│ │ │ │ └─────────────────────────────────────┘   │   │   │   │
│ │ │ └───────────────────────────────────────────┘   │   │   │
│ │ └─────────────────────────────────────────────────┘   │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure & Page Rendering
```jsx
// app/layout.js
<html lang="en">
  <body>
    <Layout>{children}</Layout>    // {children} = Your page component
  </body>
  <GoogleAnalytics />
</html>

// components/layout/Layout.js
<div className="min-h-screen">      // SETS: minimum height = viewport
  <SkinProvider>
    <LanguageProvider>
      <DocumentTitle />
      <Header />                    // Fixed position, height: 64px (h-16)
      <MainContent>                 // Wrapper for pages
        <GameContextWrapper>
          {children}                // {children} = Your page component
        </GameContextWrapper>
      </MainContent>
      <Analytics />
    </LanguageProvider>
  </SkinProvider>
</div>

// components/layout/MainContent.js
<main className="pt-16 min-h-screen flex flex-col items-center justify-center">
  <div className="max-w-lg mx-auto">  // SETS: max-width 32rem (512px)
    {children}                         // Your page renders HERE!
  </div>
</main>

// Example: How app/page.js renders
<main className="pt-16 min-h-screen...">         // From MainContent
  <div className="max-w-lg mx-auto">             // From MainContent
    <section className="text-center...">         // From app/page.js
      <PlayerSelector />
      <ThemeGrid />
    </section>
  </div>
</main>
```

## Header Component (components/layout/Header.js)

### Sizing Details
```
┌────────────────────────────────────────────────────────-─────┐
│ <header>                       WIDTH: 100% (full viewport)   │
│                                HEIGHT: h-16 (64px)           │
│                                POSITION: fixed top           │
│ ┌───────────────────────────────────────────────────────-──┐ │
│ │ max-w-6xl container          WIDTH: max 72rem (1152px)   │ │
│ │                              HEIGHT: h-16 (inherits)     │ │
│ │ ┌─────┬─────────────────-────┬─────┐                     │ │
│ │ │ w-12│    absolute center   │ w-12│                     │ │
│ │ │48px │   (transform)        │ 48px│                     │ │
│ │ └─────┴──────────────────-───┴─────┘                     │ │
│ └────────────────────────────────────────────────────-─────┘ │
└───────────────────────────────────────────────────────-──────┘
```

## Page Rendering Context & Width/Height Dependencies

### How Pages Relate to Layout Structure

All pages are rendered as `{children}` through this hierarchy:

```
app/layout.js
  └─ <Layout>{children}</Layout>
      └─ components/layout/Layout.js
          └─ <MainContent>{children}</MainContent>
              └─ components/layout/MainContent.js
                  └─ <main className="pt-16 min-h-screen...">
                      └─ <div className="max-w-lg mx-auto">
                          └─ {children} ← YOUR PAGE RENDERS HERE
```

**By default, ALL pages inherit:**
- From `<main>`: `min-h-screen`, `pt-16` (header space - 64px matching header height)
- From inner `<div>`: `max-w-lg` width constraint (512px)
- **Note**: No side padding (p-8 was removed)

### Quick Reference: Page Layout Behavior

| Page                                 | Inherits Layout? | Width                | Height              | Padding                |
|--------------------------------------|------------------|----------------------|---------------------|------------------------|
| Home (`/`)                           | ✅ Yes           | `max-w-lg` (512px)   | `min-h-screen`      | `pt-16` only (no side padding) |
| Game (`/game`)                       | ✅ Yes           | `max-w-lg` (512px)   | `min-h-screen`      | `pt-16` only (no side padding) |
| Settings (`/settings`)               | ❌ No            | `max-w-4xl` (896px)  | Own `min-h-screen`  | Own `p-6`              |
| Theme Settings (`/settings/[theme]`) | ❌ No            | `max-w-2xl` (672px)  | Own `min-h-screen`  | Own `p-6`              |

### Home Page (app/page.js)
```jsx
// Renders INSIDE the max-w-lg container
export default function Home() {
  return (
    <section className="text-center flex flex-col space-y-2">
      <PlayerSelector />    // Component 1
      <ThemeGrid />         // Component 2
    </section>
  );
}
```
- **Container Width**: INHERITS `max-w-lg` (512px) from MainContent
- **Container Height**: INHERITS `min-h-screen` from MainContent
- **Vertical Spacing**: `space-y-2` = 8px gap between PlayerSelector and ThemeGrid
- **Special cases**: 
  - Loading state adds its own `min-h-[400px]`
  - Error state adds its own `min-h-[400px]`

#### Spacing Hierarchy for PlayerSelector
```
┌─ MainContent (<main>) ─────────────────────────────────────┐
│ padding-top: pt-16 (64px matching header height)           │
│ NO side padding anymore!                                   │
│ display: flex items-center justify-center                  │ ← CENTERS VERTICALLY!
│                                                            │
│ ┌─ max-w-lg container ───────────────────────────────────┐ │
│ │ (no padding - content can touch edges on narrow screens)│ │
│ │ ┌─ <section> ────────────────────────────────────────┐ │ │
│ │ │ display: flex flex-col space-y-2                   │ │ │
│ │ │                                                    │ │ │
│ │ │ ┌─ PlayerSelector <form> ────────────────────────┐ │ │ │
│ │ │ │ (no vertical margin/padding on form itself)    │ │ │ │
│ │ │ │                                                │ │ │ │
│ │ │ │ ┌─ Inner <div> ──────────────────────────────┐ │ │ │ │
│ │ │ │ │ margin: m-4 (16px all sides)               │ │ │ │ │
│ │ │ │ │ ┌─ Content (buttons + text) ─────────────┐ │ │ │ │ │
│ │ │ │ │ │ Actual player selector UI              │ │ │ │ │ │
│ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │
│ │ │ │ └────────────────────────────────────────────┘ │ │ │ │
│ │ │ └────────────────────────────────────────────────┘ │ │ │
│ │ │                                                    │ │ │
│ │ │ [8px gap from space-y-2]                           │ │ │
│ │ │                                                    │ │ │
│ │ │ ┌─ ThemeGrid ────────────────────────────────────┐ │ │ │
│ │ │ │ margin-top: mt-4 (16px) on grid container      │ │ │ │
│ │ │ │ (Total gap: 8px + 16px = 24px from selector)   │ │ │ │
│ │ │ └────────────────────────────────────────────────┘ │ │ │
│ │ └────────────────────────────────────────────────────┘ │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

#### PlayerSelector Component
```jsx
<form className="flex flex-col items-center">
  <div className="m-4 flex flex-col items-center">
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        <ChevronUp />
        <div className="text-3xl px-2 py-0 min-w-[60px] text-center">
          {playerNum}
        </div>
        <ChevronDown />
      </div>
      <span>players</span>
    </div>
  </div>
</form>
```
- **Lives in**: Home page, constrained by parent's `max-w-lg`
- **Width**: Auto (content-based), number display has `min-w-[60px]`
- **Height**: Auto (content-based)
- **Centering**: Self-centers with `flex-col items-center`

#### ThemeGrid Component
```jsx
<div className="w-full">
  <div className="relative -mx-8 px-4 sm:mx-0 sm:px-0">
    <div className="sm:max-w-2xl sm:mx-auto">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4">
        <ThemeBox />  // Each is h-16 (64px)
        <ThemeBox />
        <ThemeBox />
      </div>
    </div>
  </div>
</div>
```
- **Lives in**: Home page AND Settings page
- **Width Behavior**: 
  - Mobile: Breaks out of parent constraints with negative margins, fills screen width
  - Desktop: Constrained to `max-w-2xl` (672px) regardless of parent
- **Grid**: **ALWAYS 3 columns** (never changes!)
- **Gaps**: `gap-3` (12px) on mobile, `gap-4` (16px) on desktop
- **Each ThemeBox**: Height fixed at `h-16` (64px)
- **Top Margin**: `mt-4` (16px) on the grid itself

### Settings Page (app/settings/page.js)
```jsx
// BREAKS OUT of the max-w-lg container!
export default function Settings() {
  return (
    <div className="min-h-screen p-6">           // Own full-height wrapper
      <div className="max-w-4xl mx-auto">        // Own width constraint
        // Content
      </div>
    </div>
  );
}
```
- **Width**: OVERRIDES with `max-w-4xl` (896px) - ignores parent's max-w-lg
- **Height**: OVERRIDES with own `min-h-screen` 
- **Padding**: OVERRIDES with `p-6` instead of parent's `p-8`
- **Why**: The outer div creates a new stacking context, bypassing MainContent constraints

### Theme Settings Page (app/settings/[theme]/page.js)
```jsx
// Also BREAKS OUT of the max-w-lg container!
export default function ThemeSettings() {
  return (
    <div className="min-h-screen p-6">           // Own full-height wrapper
      <div className="max-w-2xl mx-auto">        // Own width constraint
        // Content
      </div>
  </div>
  );
}
```
- **Width**: OVERRIDES with `max-w-2xl` (672px) - ignores parent's max-w-lg
- **Height**: OVERRIDES with own `min-h-screen`
- **Padding**: OVERRIDES with `p-6` instead of parent's `p-8`

### Game Page (app/game/page.js)
```jsx
// Renders INSIDE the max-w-lg container
export default function Game() {
  return (
    <div>{gameView}</div>  // Either Select or Play component
  );
}
```
- **Container Width**: INHERITS `max-w-lg` (512px) from MainContent
- **Container Height**: INHERITS `min-h-screen` from MainContent
- **Content**: Switches between two stages

#### Component Placement Summary for Game Page

| Component        | Parent Chain                     | Width              | Height               | Key Features                       |
|------------------|----------------------------------|--------------------|----------------------|------------------------------------|
| PlayerWordReveal | Game → Select → PlayerWordReveal | Inherits max-w-lg  | Sets min-h-[500px]   | Absolute circle, overflow-visible  |
| Play             | Game → Play                      | Inherits max-w-lg  | Auto (no min-height) | Simple layout with mt-12 buttons   |

### Visual Comparison: Inheritance vs Override

#### Pages that INHERIT (Home, Game):
```
┌─ MainContent (<main>) ──────────────────────────┐
│ padding: pt-16 only, min-height: min-h-screen   │
│ ┌─ max-w-lg container ────────────────────────┐ │
│ │ ┌─ Page Component ────────────────────────┐ │ │
│ │ │ Your content lives here                 │ │ │
│ │ │ Width constrained to 512px (max-w-lg)   │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

#### Pages that OVERRIDE (Settings, Theme Settings):
```
┌─ MainContent (<main>) ──────────────────────────┐
│ ┌─ max-w-lg container ────────────────────────┐ │
│ │ ┌─ Page Component ────────────────────────┐ │ │
│ │ │ ┌─ Own full-height div ───────────────┐ │ │ │
│ │ │ │ This BREAKS OUT of constraints      │ │ │ │
│ │ │ │ ┌─ Own max-w-4xl container ───────┐ │ │ │ │
│ │ │ │ │ Content with custom width       │ │ │ │ │
│ │ │ │ └─────────────────────────────────┘ │ │ │ │
│ │ │ └─────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

The override pages effectively create their own layout context!

## Component-Specific Sizing

### Fixed Dimensions

1. **Header** (components/layout/Header.js)
   - Height: `h-16` (64px)
   - Side buttons: `w-12` (48px each)

2. **ThemeBox** (components/ui/ThemeBox.js)
   - Height: `h-16` (64px)
   - Width: Flexible (grid child)

3. **IconButton** (components/ui/IconButton.js)
   - Sizes: `p-2` (sm), `p-3` (md), `p-4` (lg)
   - No fixed width/height

4. **SkinSwitcher** (components/functional/skin_switcher/SkinSwitcher.js)
   - Dropdown width: `w-32` (128px)

5. **PlayerSelector** (components/functional/PlayerSelector.js)
   - Number display: `min-w-[60px]`

6. **LoadingState** (components/functional/LoadingState.js)
   - Container: `min-h-[400px]`
   - Spinner: `w-12 h-12` (48px × 48px)

7. **PlayerWordReveal** (components/functional/PlayerWordReveal.js)
   - Container: `min-h-[500px]`

### Flexible Dimensions

1. **WordBox** (components/ui/WordBox.js)
   - Width: `flex-1` (fills available space)
   - Height: Auto (content-based)

2. **ThemeGrid** (components/functional/ThemeGrid.js)
   - Grid: **ALWAYS `grid-cols-3`** (no variable columns!)
   - Gap: `gap-3` on mobile, `gap-4` on desktop
   - Container: `max-w-2xl` (672px) on desktop, full width on mobile
   - Item width: Flexible (1/3 of container minus gaps)

3. **ThemeForm** (components/functional/ThemeForm.js)
   - Input container: `w-full max-w-md` (inherits parent width, max 28rem)

## Home Page (app/page.js)

### Visual Sketch
```
┌─────────────────────────────────────────────────────────────┐
│                         Home Page                            │
│                                                              │
│          ┌──────────────────────────────────┐               │
│          │         Player Selector          │               │
│          │  ┌───┐                           │               │
│          │  │ ▲ │                           │               │
│          │  ├───┤                           │               │
│          │  │ 5 │  players                  │               │
│          │  ├───┤                           │               │
│          │  │ ▼ │                           │               │
│          │  └───┘                           │               │
│          └──────────────────────────────────┘               │
│                                                             │
│          ┌──────────────────────────────────┐               │
│          │         Theme Grid (3 cols)      │               │
│          │ ┌──────┐ ┌──────┐ ┌──────┐      │               │
│          │ │ Food │ │Place │ │ Job  │      │               │
│          │ └──────┘ └──────┘ └──────┘      │               │
│          │ ┌──────┐ ┌──────┐ ┌──────┐      │               │
│          │ │Bible │ │ ...  │ │ ...  │      │               │
│          │ └──────┘ └──────┘ └──────┘      │               │
│          └──────────────────────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

```jsx
<section className="text-center flex flex-col space-y-2">
  
  <!-- Player Number Selector Component -->
  <PlayerSelector                            // Dedicated component
    playerNum={playerNum}
    setPlayerNum={setPlayerNum}
  />
  
  <!-- Theme Grid Component -->
  <ThemeGrid                                 // Reusable grid component
    themes={themes}
    onThemeSelect={(theme) => {
      setTheme(theme.type);
      setThemeKr(theme.typeKr);
    }}
  />
  
</section>
```

### Loading State

#### Visual Sketch
```
┌─────────────────────────────────────────────────────────────┐
│                      Loading State                           │
│                                                              │
│                                                              │
│                        ┌─────┐                               │
│                        │  ⟳  │  (spinning)                   │
│                        └─────┘                               │
│                                                              │
│                     Loading...                               │
│              Getting things ready...                         │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

```jsx
<LoadingState                                // Reusable loading component
  title={t("common.loading")}                // Translated title
  subtitle={t("common.preparingGame")}       // Translated subtitle
/>
```

## Settings Page (app/settings/page.js)

### Visual Sketch
```
┌─────────────────────────────────────────────────────────────┐
│                      Settings Page                           │
│                                                              │
│              ┌────────────────────────────┐                  │
│              │    [+] Add Theme           │                  │
│              └────────────────────────────┘                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Theme Form (when visible)          │    │
│  │                                                     │    │
│  │                Theme Name (required)                │    │
│  │              ┌─────────────────────┐                │    │
│  │              │                     │                │    │
│  │              └─────────────────────┘                │    │
│  │                                                     │    │
│  │                           [ Add ] [ Cancel ]        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Themes Grid                      │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │    │
│  │  │  Theme 1 │ │  Theme 2 │ │  Theme 3 │          │    │
│  │  └──────────┘ └──────────┘ └──────────┘          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │    │
│  │  │  Theme 4 │ │  Theme 5 │ │  Theme 6 │          │    │
│  │  └──────────┘ └──────────┘ └──────────┘          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

```jsx
<div className="min-h-screen p-6">           // OVERRIDES default layout
  <div className="max-w-4xl mx-auto">        // WIDER than default (896px)
    
    <!-- Add Theme Button (conditional) -->
    {!showCreateForm && (
      <button onClick={() => setShowCreateForm(true)}>
        <Plus /> Add Theme
      </button>
    )}
    
    <!-- Error Display -->
    {error && <div>{error}</div>}
    
    <!-- Loading State -->
    {loading && <LoadingState />}            // Reusable component
    
    <!-- Theme Form Component -->
    {showCreateForm && (
      <ThemeForm                             // Dedicated form component
        onSubmit={handleCreateTheme}
        onCancel={() => setShowCreateForm(false)}
      />
    )}
    
    <!-- Themes Grid -->
    <div className="rounded-lg">
      <div className="p-6">
        <ThemeGrid                           // Reusable grid component
          themes={themes}
          linkTo="/settings/"                // Links to theme settings
        />
      </div>
    </div>
    
  </div>
</div>
```

## Theme Settings Page (app/settings/[theme]/page.js)

### Visual Sketch
```
┌─────────────────────────────────────────────────────────────┐
│                   Theme Settings Page                        │
│                                                              │
│   Food                                                       │
│   ────                                                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Add New Word                       │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────┐ [+] Add      │    │
│  │  │ Enter a new word...             │              │    │
│  │  └─────────────────────────────────┘              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Words (12)                       │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────┐ ⟳  [🗑]      │    │
│  │  │ Pizza                           │              │    │
│  │  └─────────────────────────────────┘              │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────┐     [🗑]      │    │
│  │  │ Hamburger                       │              │    │
│  │  └─────────────────────────────────┘              │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────┐     [🗑]      │    │
│  │  │ Sushi                           │              │    │
│  │  └─────────────────────────────────┘              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Note: ⟳ = saving spinner, [🗑] = delete button (visible on hover)
```

```jsx
<div className="min-h-screen p-6">           // OVERRIDES default layout
  <div className="max-w-2xl mx-auto">        // NARROWER than default (672px)
    
    <!-- Header -->
    <div className="flex justify-between mb-6">
      <h1>{themeTypeDisplay}</h1>            // Formatted theme name
    </div>
    
    <!-- Error Display -->
    {error && <div>{error}</div>}
    
    <!-- Loading State -->
    {loading && <LoadingState />}            // Reusable component
    
    <!-- Add New Word Section -->
    <div className="p-6 rounded-lg shadow">
      <h2>Add New Word</h2>
      <form className="flex gap-3">
        <input 
          className="flex-1"                 // Fills available width
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
        />
        <button type="submit">
          <Plus /> Add
        </button>
      </form>
    </div>
    
    <!-- Words Table Component -->
    <WordsTable                              // Dedicated table component
      words={words}
      onUpdate={handleUpdateWord}
      onDelete={handleDeleteWord}
      savingIds={savingWords}               // Track saving state per word
    />
    
  </div>
</div>
```

## Game Page (app/game/page.js)

The game page is a container that switches between two game stage components:

```jsx
<div>
  {stage === 1 ? (
    <Select                                  // Word reveal stage
      globalState={{playerNum, theme, dbData}}
      nextStage={progressNextStage}
      setVocab={updateGlobalVocab}
      isReplay={isReplay}
      existingVocab={vocab}
      existingSelectData={selectData}
      existingGameSetup={gameSetup}
    />
  ) : (
    <Play                                    // Discussion stage
      resetToWordReveal={resetToWordReveal}
    />
  )}
</div>
```

**Game Flow:**
- Stage 1: Select Component - Players take turns revealing the word
- Stage 2: Play Component - Discussion phase with option to go home or replay

### Stage 1: Select Component (components/functional/game/Select.js)

#### Visual Sketch (Word Reveal)
```
┌─────────────────────────────────────────────────────────────┐
│                    Player Word Reveal                        │
│                                                              │
│                      Player 3 of 5                           │
│                                                              │
│              ┌────────────────────────────┐                  │
│              │                            │                  │
│              │                            │                  │
│              │    Press and Hold to       │                  │
│              │      Reveal Word           │                  │
│              │                            │                  │
│              │         [ HOLD ]           │                  │
│              │                            │                  │
│              └────────────────────────────┘                  │
│                                                              │
│                 (Shows word on press hold)                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

When held:
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                        Pizza                                 │
│                       (Food)                                 │
│                                                              │
│              OR for the liar:                                │
│                                                              │
│                    You are the LIAR!                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### PlayerWordReveal Component (The "Press and Hold" Component)
```jsx
<div className="flex flex-col items-center justify-center min-h-[500px] relative overflow-visible">
  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-2xl">
    Player {currentPlayer} of {totalPlayers}
  </div>
  
  {/* Press and hold circle - FIXED POSITIONED TO VIEWPORT CENTER */}
  <button className="fixed top-50vh left-50vw transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: circleSize, 
            height: circleSize,
            boxSizing: 'border-box',
            transform: 'translate(-50%, -50%) scale(0.95/1)'
          }}>
    HOLD
  </button>
  
  {/* Instructions */}
  <p className="absolute bottom-16">Pass to next</p>
</div>
```
- **Lives in**: Game page → Select component → PlayerWordReveal
- **Container**: Sets own `min-h-[500px]` with `overflow-visible`
- **Circle Button**: 
  - Fixed positioned at 75vh from top (moved down from 60vh)
  - Grows from 300px to 500px when held (reduced from 200-600px)
  - 0.5s delay before transition starts (increased from 0.25s)
  - 0.5s transition duration (reduced from 1.0s)
  - Always perfectly centered horizontally regardless of container offsets
  - Uses `box-sizing: border-box` to include border in size
  - Transform order: `translate(-50%, -50%)` first, then `scale()` for proper centering
  - Can overflow equally left and right
- **Layout**: Container uses flexbox, button is fixed to viewport
- **Overflow**: Container and all parent elements have `overflow-visible` to allow symmetric expansion

## PlayerWordReveal Circle Positioning: Complete Technical Analysis

### DOM Hierarchy & Positioning Chain

The circle's position is determined by this complete hierarchy:

```
<html>                                          // Viewport reference
  └─ <body>                                     // overflow-x: visible
      └─ Layout div (min-h-screen)              // overflow-visible
          └─ <main> (pt-16)                     // overflow-visible
              └─ max-w-lg container              // overflow-visible
                  └─ Game page <div>
                      └─ Select component
                          └─ PlayerWordReveal component
                              └─ Container <div>         // overflow-visible
                                  └─ Circle <button>     // position: fixed
```

### Detailed Positioning Sequence

#### 1. Circle Button Base Position
```css
button {
  position: fixed;      /* Positioned relative to viewport, not parent */
  top: 75vh;           /* 75% of viewport height (moved down from 60%) */
  left: 50vw;          /* 50% of viewport width */
}
```
This places the button's TOP-LEFT corner at the viewport center.

#### 2. Transform Adjustments
```css
transform: translate(-50%, -50%) scale(0.95);  /* When not holding */
transform: translate(-50%, -50%) scale(1);     /* When holding */
```

**Critical transform order:**
1. `translate(-50%, -50%)` - Shifts button left and up by 50% of its own dimensions
2. `scale()` - Applied AFTER translate to maintain center point

**Why order matters:** If scale came first, the translate would use the scaled dimensions, causing misalignment.

#### 3. Size Calculations
```javascript
const circleSize = 300 + (holdProgress * 2);  // 300px → 500px
```
- Base size: 300px × 300px
- Maximum size: 500px × 500px (when holdProgress = 100)
- Border: 2px solid (included in size via `box-sizing: border-box`)

### Factors That Do NOT Affect Circle Position

Despite the complex DOM hierarchy, these do NOT affect the circle's position because of `position: fixed`:

1. **Parent container constraints:**
   - `max-w-lg` (512px) from MainContent
   - `min-h-[500px]` from PlayerWordReveal container
   - Any padding/margin on parent elements

2. **Sibling elements (all use `absolute` positioning):**
   - Player counter at top
   - Word/Role display (conditional)
   - Instructions at bottom (conditional)

3. **Header offset:**
   - The 64px (`pt-16`) padding from fixed header doesn't affect fixed positioned elements

### Conditional Elements Analysis

#### Player Counter (Always Visible)
```jsx
<div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-2xl z-10">
```
- Position: `absolute top-8` (32px from container top)
- **Impact on circle:** NONE (different positioning context)

#### Word/Role Display (showContent === true)
```jsx
{showContent && (
  <div className="absolute" style={{ 
    top: '25%', 
    left: '50%', 
    transform: 'translateX(-50%)',
    zIndex: 100,
    pointerEvents: 'none',
    minWidth: '300px'
  }}>
```
- Position: `absolute` at 25% from container top
- **Impact on circle:** NONE (different positioning context)
- `pointerEvents: 'none'` ensures no interaction interference

#### Button Text (showContent === false)
```jsx
{!showContent && (
  <span className="text-xl z-10 pointer-events-none">
    {t("game.select.pressAndHold")}
  </span>
)}
```
- Position: Inside button (affects button content layout)
- **Impact on circle position:** NONE (only affects internal content)
- **Impact on interaction:** NONE (`pointer-events-none`)

#### Instructions Text (Complex Conditional)
```jsx
{!showContent && !isHolding && hasRevealed && (
  <p className="absolute bottom-16 text-sm">
    {t("game.select.passToNext")}
  </p>
)}
```
- Position: `absolute bottom-16` (64px from container bottom)
- **Impact on circle:** NONE (different positioning context)

### Z-Index Layering

```
z-index: 100  - Word/Role display (highest)
z-index: 20   - Circle button
z-index: 10   - Player counter
(no z-index)  - Container and instructions
```

### Overflow Behavior Chain

For the circle to expand symmetrically beyond viewport:

```css
html, body        { overflow-x: visible; }  /* globals.css */
Layout div        { overflow-visible }      /* app/layout.js */
MainContent main  { overflow-visible }      /* MainContent.js */
max-w-lg div      { overflow-visible }      /* MainContent.js */
Container div     { overflow-visible }      /* PlayerWordReveal.js */
```

### Visual Positioning Diagram

```
Viewport (e.g., 894×744px)
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│    ┌────┼────┐                          │
│    │    │    │                          │ ← Circle at 300px
│    │    ●    │                          │ ← transform origin
│    │         │                          │
│    └─────────┘                          │
│                                         │
│                                         │
│         ◎ (50vw, 75vh)                 │ ← Circle center point (moved down further)
│         │                               │
│  When expanded to 500px:                │
│┌─────────┼─────────┐                    │ ← Overflows viewport
││         │         │                    │   equally left/right
││         ●         │                    │ ← Still centered horizontally
││         │         │                    │
│└─────────┼─────────┘                    │
└─────────────────────────────────────────┘
```

### Key Insights

1. **Fixed positioning bypasses all parent constraints** - The circle ignores max-w-lg, padding, margins
2. **Transform order is critical** - translate MUST come before scale
3. **Conditional elements don't affect position** - All use absolute positioning in different contexts
4. **box-sizing: border-box** - Ensures border is included in size calculations
5. **overflow-visible chain** - Required on ALL parents for symmetric overflow

### Common Misconceptions

❌ **Parent container width affects circle position** - No, fixed positioning uses viewport
❌ **Absolute positioned siblings push the circle** - No, they're in different stacking contexts  
❌ **The 64px header padding affects the circle** - No, fixed positioning ignores this
✅ **Only viewport dimensions and transform affect final position**

### Stage 2: Play Component (components/functional/game/Play.js)

#### Visual Sketch
```
┌──────────────────────────────────────────────────────-───────┐
│                        Play Stage                            │
│                                                              │
│                                                              │
│                     GAME START!                              │
│                                                              │
│            Discuss and find the liar!                        │
│                                                              │
│                                                              │
│                                                              │
│              ┌─────┐         ┌─────┐                         │
│              │ [←] │         │ [↻] │                         │
│              └─────┘         └─────┘                         │
│               Home          Redo Reveal                      │
│                                                              │
│                                                              │
└────────────────────────────────────────────────────────-─────┘
```

#### Play Component
```jsx
<div className="">                          // No specific constraints
  <h1>{displayStatus}</h1>                  // "GAME START!"
  <p className="mt-2">{displayStatus02}</p>  // "Discuss and find the liar!"
  
  <div className="flex justify-center gap-4 mt-12">
    <IconButton                              // Home button
      href="/"
      icon={<ArrowLeft size={24} />}
      size="lg"                              // p-4 padding
    />
    <IconButton                              // Replay button
      onClick={handleReplay}
      icon={<RotateCcw size={24} />}
      size="lg"                              // p-4 padding
    />
  </div>
</div>
```
- **Lives in**: Game page (replaces Select component in stage 2)
- **Width**: Inherits parent's constraints (max-w-lg from Game page)
- **Height**: Auto (no min-height set)
- **Layout**: Simple block layout, buttons centered with flexbox
- **Button spacing**: `gap-4` (16px) between buttons, `mt-12` (48px) from text



## Common Layout Patterns

### Card Container
```
<div class="rounded-lg shadow" style="backgroundColor: var(--color-cardBg)">
  <div class="p-6">
    {content}
  </div>
</div>
```

### Centered Content
```
<div class="flex items-center justify-center min-h-[400px]">
  {content}
</div>
```

### Form Layout
```
<form>
  <div class="flex justify-center mb-4">     // Input container
    <div class="w-full max-w-md">
      <label>{label}</label>
      <input />
    </div>
  </div>
  <div class="flex justify-end gap-2">       // Button container
    <button>Primary</button>
    <button>Secondary</button>
  </div>
</form>
```

### Grid Layout
```
<div class="grid grid-cols-3 gap-4">         // 3-column responsive grid
  {items}
</div>
```

## Layout Inheritance Rules

### Width Rules
1. **Default flow**: Full width → constrained by parent's max-width
2. **MainContent default**: `max-w-lg` (512px) - applies to most pages
3. **Page overrides**: Settings pages bypass MainContent, set own max-width
4. **Form inputs**: Often use `w-full` with `max-w-md` constraint

### Height Rules
1. **Minimum height**: `min-h-screen` ensures full viewport coverage
2. **Header offset**: `pt-16` on main content matches the 64px header height exactly
3. **Content sections**: Use `min-h-[400px]` or `min-h-[500px]` for consistent spacing
4. **Flexbox centering**: `flex items-center justify-center` for vertical centering

### Responsive Breakpoints
- **Mobile-first**: Base styles apply to all screens
- **Container queries**: `mx-auto` centers content at all sizes
- **Max-width constraints**:
  - `max-w-lg`: 512px (default for most content)
  - `max-w-2xl`: 672px (theme settings)
  - `max-w-4xl`: 896px (settings list)
  - `max-w-6xl`: 1152px (header only)

## Common Patterns

### Centered Card Layout
```jsx
<div className="min-h-screen p-6">              // Full height page
  <div className="max-w-{size} mx-auto">        // Width constraint
    <div className="rounded-lg shadow p-6">     // Card styling
      {content}
    </div>
  </div>
</div>
```

### Full-Height Centered Content
```jsx
<section className="min-h-[400px] flex flex-col items-center justify-center">
  {content}
</section>
```

### Flexible Form Layout
```jsx
<form className="flex gap-3">                   // Horizontal layout
  <input className="flex-1" />                  // Stretches to fill
  <button>Submit</button>                       // Auto-sized
</form>
```

## File Structure Reference

```
frontend/
├── app/
│   ├── layout.js                    // Root layout (uses Layout component)
│   ├── page.js                      // Home (inherits max-w-lg)
│   ├── game/
│   │   └── page.js                  // Game (inherits max-w-lg)
│   └── settings/
│       ├── page.js                  // Settings list (overrides to max-w-4xl)
│       └── [theme]/
│           └── page.js              // Theme settings (overrides to max-w-2xl)
│
├── components/
│   ├── layout/
│   │   ├── Layout.js                // Main layout wrapper
│   │   ├── Header.js                // Fixed header (h-16)
│   │   └── MainContent.js           // Content wrapper (max-w-lg default)
│   │
│   ├── ui/
│   │   ├── ThemeBox.js              // Fixed height (h-16)
│   │   ├── WordBox.js               // Flexible width (flex-1)
│   │   └── IconButton.js            // Padding-based sizing
│   │
│   └── functional/
│       ├── ThemeGrid.js             // 3-column grid layout
│       ├── ThemeForm.js             // max-w-md form constraint
│       ├── WordsTable.js            // Full width of parent
│       ├── PlayerSelector.js        // min-w-[60px] for number
│       ├── LoadingState.js          // min-h-[400px] container
│       └── PlayerWordReveal.js      // min-h-[500px] container
```

## Summary

The Liar Game layout system uses a hierarchical approach with two patterns:

### 1. Inheritance Pattern (Default)
- Pages render INSIDE MainContent's `max-w-lg` container
- Used by: Home page, Game page
- Benefits: Consistent narrow reading width, automatic centering

### 2. Override Pattern 
- Pages create their own full-height wrapper, bypassing MainContent constraints
- Used by: Settings pages (both list and individual theme)
- Benefits: Custom width control, different padding schemes

### Key Architecture Points:
1. **Global minimum height** (`min-h-screen`) ensures full viewport coverage
2. **Default width constraint** (`max-w-lg` = 512px) provides optimal reading width
3. **Page-specific overrides** allow wider layouts for grids (settings) or narrower for focused views (theme settings)
4. **Component-level sizing** handles specific UI requirements (fixed headers, flexible forms)
5. **Flexbox centering** ensures proper content alignment at all viewport sizes
6. **Fixed header** with `pt-16` body padding (64px) matches header height exactly

### Width Hierarchy:
- Narrowest: `max-w-lg` (512px) - Home, Game
- Medium: `max-w-2xl` (672px) - Theme Settings 
- Widest: `max-w-4xl` (896px) - Settings List
- Header only: `max-w-6xl` (1152px) - Never seen by page content

### Component Placement & Sizing Reference

| Component            | Where It Lives        | Width Behavior                        | Height Behavior      | Special Notes                          |
|----------------------|-----------------------|---------------------------------------|----------------------|----------------------------------------|
| **PlayerSelector**   | Home page only        | Auto width, `min-w-[60px]` for number | Auto height          | Self-centers with flexbox              |
| **ThemeGrid**        | Home & Settings pages | Desktop: max-w-2xl (672px)            | Auto height          | ALWAYS 3 columns, responsive width     |
| **PlayerWordReveal** | Game page (stage 1)   | Inherits `max-w-lg` (512px)           | Sets `min-h-[500px]` | Circle grows 200→600px, abs positioned |
| **Play**             | Game page (stage 2)   | Inherits `max-w-lg` (512px)           | Auto height          | Discussion phase with nav buttons      |

This system provides consistency while allowing flexibility for different page needs.
