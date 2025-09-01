# Multi-Language Implementation Guide & Progress Tracker

## Overview
This document tracks the implementation of multi-language support for the Liar Game application. The approach uses React Context with a custom hook for a lightweight, maintainable solution.

## Architecture Decision
**Chosen Approach:** React Context + Custom Hook  
**Translation Structure:** Component-based with language as sub-key

```javascript
{
  "section.key": {
    "ko": "한국어 텍스트",
    "en": "English text"
  }
}
```

## Implementation Checklist

### Phase 1: Core Infrastructure ✅
- [x] Create `translations/` folder structure
- [x] Create translation JSON files
- [x] Create `LanguageContext.js` 
- [x] Create `useTranslation` custom hook
- [x] Add language switcher component
- [x] Update `GameContextWrapper` to include language provider

### Phase 2: Translation Files ✅
- [x] Create `translations/common.json` (shared UI elements)
- [x] Create `translations/intro.json` (intro page)
- [x] Create `translations/settings.json` (settings page)
- [x] Create `translations/game.json` (game play)
- [x] Create `translations/themes.json` (theme names)
- [x] Create `translations/timer.json` (timer related)

### Phase 3: Component Updates ✅
- [x] Update `Intro.js`
- [x] Update `Settings.js` (`app/settings/page.js`)
- [x] Update `Select.js`
- [x] Update `Play.js`
- [x] Update `Finish.js`
- [x] Update `Timer.js`
- [x] Update `app/game/page.js`

### Phase 4: Testing & Polish ✅
- [x] Test language switching functionality
- [x] Verify all text is translated
- [x] Add language persistence (localStorage)
- [x] Add language detection (browser default)
- [ ] Test with different screen sizes
- [ ] Add missing translations

## File Structure
```
/translations/
  ├── index.js          # Main translation aggregator
  ├── common.json       # Common UI elements
  ├── intro.json        # Intro page translations
  ├── settings.json     # Settings page translations
  ├── game.json         # Game play translations
  ├── themes.json       # Theme names translations
  └── timer.json        # Timer related translations

/components/
  ├── LanguageContext.js    # Language context provider
  ├── LanguageSwitcher.js   # Language selector component
  └── [existing components]

/hooks/
  └── useTranslation.js      # Custom translation hook
```

## Translation Keys Reference

### Common UI Elements (`common.json`)
```javascript
{
  "buttons.newGame": { "ko": "새 게임하기", "en": "New Game" },
  "buttons.confirm": { "ko": "확인했습니다!", "en": "Confirmed!" },
  "buttons.select": { "ko": "선택하세요", "en": "Select" },
  "buttons.startGame": { "ko": "게임 시작!", "en": "Start Game!" },
  "version": { "ko": "버전", "en": "version" }
}
```

### Intro Page (`intro.json`)
```javascript
{
  "title.liar": { "ko": "Liar", "en": "Liar" },
  "title.game": { "ko": "Game", "en": "Game" },
  "subtitle": { "ko": "누가 거짓말을 하고 있을까요?", "en": "Who is lying?" },
  "playButton": { "ko": "게임하기", "en": "Play Game" },
  "easterEgg.placeholder": { "ko": "코드를 입력하세요", "en": "Enter code" },
  "easterEgg.onnuriMode": { "ko": "온누리 모드 Activated", "en": "Onnuri Mode Activated" }
}
```

### Settings Page (`settings.json`)
```javascript
{
  "title": { "ko": "설정 창", "en": "Settings" },
  "playerCount": { "ko": "참여인원:", "en": "Number of Players:" },
  "timeLimit": { "ko": "제한시간:", "en": "Time Limit:" },
  "spyMode": { "ko": "스파이 모드", "en": "Spy Mode" },
  "spyModeNote": { "ko": "**스파이 모드는 5명 이상일 경우 가능합니다!**", "en": "**Spy mode requires 5 or more players!**" },
  "theme": { "ko": "주제:", "en": "Theme:" },
  "time.seconds": { "ko": "초", "en": "seconds" },
  "time.minutes": { "ko": "분", "en": "min" },
  "time.unlimited": { "ko": "무제한", "en": "Unlimited" }
}
```

### Game Play (`game.json`)
```javascript
{
  "select.choosePlayer": { "ko": "플레이어를 선택해주세요", "en": "Please select a player" },
  "select.selectedWord": { "ko": "이번에 선택된 단어는:", "en": "The selected word is:" },
  "select.youAre": { "ko": "당신은", "en": "You are" },
  "select.spy": { "ko": "스파이", "en": "a Spy" },
  "select.spyWord": { "ko": "입니다. 이번에 선택된 단어는:", "en": ". The selected word is:" },
  "select.liar": { "ko": "라이어 입니다.", "en": "the Liar." },
  "select.allSelected": { "ko": "모든 플레이어가 선택 되었습니다", "en": "All players have been selected" },
  "select.gameStarted": { "ko": "게임이 시작되었습니다!", "en": "Game has started!" },
  "select.onePlayerLeft": { "ko": "One player left", "en": "One player left" },
  
  "play.gameStart": { "ko": "게임 시작!", "en": "Game Start!" },
  "play.gameStarted": { "ko": "게임이 시작되었습니다! 라이어를 찾아주세요!", "en": "Game has started! Find the liar!" },
  "play.timeUnlimited": { "ko": "시간은 무제한입니다.", "en": "Time is unlimited." },
  "play.whenReady": { "ko": "준비가 되면 아래의 버튼을 선택하여 진행해주세요.", "en": "When ready, select the button below to proceed." },
  "play.timeUp": { "ko": "시간이 다 되었습니다! 라이어를 지목해주세요!", "en": "Time's up! Point out the liar!" },
  "play.foundLiar": { "ko": "라이어를 찾았습니다!", "en": "Found the liar!" },
  "play.notFoundLiar": { "ko": "라이어를 찾지 못했습니다!", "en": "Couldn't find the liar!" },
  
  "finish.selectWord": { "ko": "라이어는 단어를 선택해주세요:", "en": "Liar, please select the word:" },
  "finish.liarWins": { "ko": "라이어가 승리하였습니다!", "en": "The liar wins!" },
  "finish.liarLoses": { "ko": "라이어가 패하였습니다!", "en": "The liar loses!" },
  "finish.correctGuess": { "ko": "라이어가 선택한 단어가 맞습니다!", "en": "The liar guessed correctly!" },
  "finish.notFound": { "ko": "라이어를 찾지 못하였습니다!", "en": "Couldn't find the liar!" },
  "finish.selectedWord": { "ko": "선택된 단어는:", "en": "The selected word was:" }
}
```

### Theme Names (`themes.json`)
```javascript
{
  "food": { "ko": "음식", "en": "Food" },
  "place": { "ko": "장소", "en": "Places" },
  "occupation": { "ko": "직업", "en": "Occupations" },
  "biblecharacter": { "ko": "성경인물", "en": "Bible Characters" },
  "onnurichanyangteammember": { "ko": "온누리 찬양팀", "en": "Onnuri Worship Team" }
}
```

### Timer (`timer.json`)
```javascript
{
  "seconds": { "ko": "초", "en": "seconds" }
}
```

## Implementation Code Examples

### 1. LanguageContext.js
```javascript
"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import translations from '@/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ko');

  useEffect(() => {
    // Load saved language or detect browser language
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.substring(0, 2);
      setLanguage(browserLang === 'ko' ? 'ko' : 'en');
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value?.[language] || value?.['ko'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
```

### 2. useTranslation Hook
```javascript
import { useLanguage } from '@/components/LanguageContext';

export const useTranslation = () => {
  const { t, language, changeLanguage } = useLanguage();
  return { t, language, changeLanguage };
};
```

### 3. LanguageSwitcher Component
```javascript
"use client";
import { useTranslation } from '@/hooks/useTranslation';

export const LanguageSwitcher = () => {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="fixed top-4 right-4 z-50">
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
      >
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};
```

### 4. Component Update Example (Intro.js)
```javascript
import { useTranslation } from '@/hooks/useTranslation';

const Intro = () => {
  const { t } = useTranslation();
  
  return (
    <section>
      <h1>{t('intro.title.liar')} {t('intro.title.game')}</h1>
      <p>{t('intro.subtitle')}</p>
      <Link href="/settings">{t('intro.playButton')}</Link>
    </section>
  );
};
```

## Testing Checklist
- [ ] Language switches correctly on all pages
- [ ] Translations persist after page refresh
- [ ] No untranslated text visible
- [ ] Special characters display correctly (Korean)
- [ ] Long translations don't break layout
- [ ] Language switcher is accessible on all pages

## Future Enhancements
1. Add more languages (Japanese, Chinese, Spanish)
2. Add RTL language support (Arabic, Hebrew)
3. Add translation management tool integration
4. Add pluralization support
5. Add date/time formatting per locale
6. Add number formatting per locale

## Notes
- Keep translation keys semantic and hierarchical
- Always provide fallback to Korean if translation missing
- Test with longest possible translations to ensure UI doesn't break
- Consider text expansion (English is often 30% longer than Korean)

## Resources
- [React Context API Docs](https://react.dev/reference/react/createContext)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [i18n Best Practices](https://www.w3.org/International/questions/qa-i18n)

## Known Issues Fixed
- Fixed corrupted `postcss.config.js` file that was causing "ReferenceError: t is not defined"

## Updates
- **December 2024**: Added Italian language support ("Italiano")
  - Updated all translation files with Italian translations
  - Added Italian option to language switcher
  - Note: "Liar Game" title remains in English across all languages as requested

---
*Last Updated: December 2024*  
*Status: ✅ Complete (Multi-language support: Korean, English, Italian)*

Legend:
- ✅ Complete
- 🟡 In Progress
- ⏳ Not Started
- ❌ Blocked
