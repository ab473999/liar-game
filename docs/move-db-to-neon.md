# Database Migration: Firebase to Neon PostgreSQL

## Overview
This document tracks the migration from Firebase Firestore to Neon PostgreSQL for the Liar Game application.

## Why Migrate?
- **Better control** over data structure and queries
- **Cost predictability** with Neon's pricing model
- **SQL flexibility** for complex queries
- **Local development** easier with PostgreSQL
- **Data ownership** and portability

## Architecture Changes

### Current (Firebase)
```
Client → Firebase SDK → Firestore
```

### New (PostgreSQL)
```
Client → Next.js API Routes → PostgreSQL (Neon)
```

## Implementation Checklist

### Phase 1: Database Setup ✅
- [x] Create Neon PostgreSQL database
- [x] Add `POSTGRES_URL` to `.env`
- [x] Install required dependencies (Prisma)
- [x] Create database connection utility
- [x] Test database connection

### Phase 2: Schema Design ✅
- [x] Design database schema
- [x] Create migration files
- [x] Run initial migrations
- [x] Seed initial data

### Phase 3: API Development ✅
- [x] Create API route for fetching themes
- [x] Create API route for fetching words
- [x] Add error handling
- [ ] Add caching strategy (optional)

### Phase 4: Frontend Updates ✅
- [x] Update `GameContextWrapper` to use API
- [ ] Remove Firebase dependencies (pending)
- [x] Update components to handle new data structure
- [x] Add loading states
- [x] Add error handling

### Phase 5: Data Migration ✅
- [x] Export data from Firebase (used local JSON files)
- [x] Transform data to new schema
- [x] Import data to PostgreSQL
- [x] Verify data integrity

### Phase 6: Testing & Cleanup 🟡
- [x] Test all game features
- [ ] Remove Firebase configuration
- [x] Update environment variables
- [x] Update documentation
- [ ] Deploy and test in production

## Database Schema

### Tables

#### `themes`
```sql
CREATE TABLE themes (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) UNIQUE NOT NULL,
  name_ko VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_it VARCHAR(100) NOT NULL,
  easter_egg BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `words`
```sql
CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  theme_id INTEGER REFERENCES themes(id) ON DELETE CASCADE,
  word_ko VARCHAR(100) NOT NULL,
  word_en VARCHAR(100),
  word_it VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_words_theme_id ON words(theme_id);
```

#### `game_sessions` (optional for analytics)
```sql
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  theme_id INTEGER REFERENCES themes(id),
  player_count INTEGER NOT NULL,
  spy_mode BOOLEAN DEFAULT FALSE,
  spy_count INTEGER DEFAULT 0,
  time_limit INTEGER,
  selected_word_id INTEGER REFERENCES words(id),
  language VARCHAR(5) DEFAULT 'ko',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Dependencies to Install

```json
{
  "dependencies": {
    "@vercel/postgres": "^0.5.1",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "@types/pg": "^8.10.9"
  }
}
```

Or using Prisma ORM (recommended):
```json
{
  "dependencies": {
    "@prisma/client": "^5.7.1"
  },
  "devDependencies": {
    "prisma": "^5.7.1"
  }
}
```

## Implementation Code Examples

### 1. Database Connection (lib/db.js)
```javascript
import { Pool } from 'pg';

let pool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export default pool;
```

### 2. API Route - Get Themes (app/api/themes/route.js)
```javascript
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeEasterEgg = searchParams.get('easterEgg') === 'true';
    
    let query = `
      SELECT 
        id,
        type,
        name_ko,
        name_en,
        name_it,
        easter_egg
      FROM themes
    `;
    
    if (!includeEasterEgg) {
      query += ' WHERE easter_egg = false';
    }
    
    query += ' ORDER BY id';
    
    const result = await pool.query(query);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}
```

### 3. API Route - Get Words by Theme (app/api/words/route.js)
```javascript
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeType = searchParams.get('theme');
    const language = searchParams.get('lang') || 'ko';
    
    if (!themeType) {
      return NextResponse.json(
        { success: false, error: 'Theme parameter is required' },
        { status: 400 }
      );
    }
    
    const query = `
      SELECT 
        w.id,
        w.word_ko,
        w.word_en,
        w.word_it,
        t.type as theme_type
      FROM words w
      JOIN themes t ON w.theme_id = t.id
      WHERE t.type = $1
      ORDER BY RANDOM()
    `;
    
    const result = await pool.query(query, [themeType]);
    
    // Format words based on language
    const words = result.rows.map(row => ({
      id: row.id,
      word: row[`word_${language}`] || row.word_ko,
      theme: row.theme_type
    }));
    
    return NextResponse.json({
      success: true,
      data: words
    });
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch words' },
      { status: 500 }
    );
  }
}
```

### 4. Updated GameContextWrapper
```javascript
"use client";
import { createContext, useEffect, useState, useContext } from "react";

const GameContext = createContext();

export const GameContextWrapper = ({ children }) => {
  const [playerNum, setPlayerNum] = useState(3);
  const [timer, setTimer] = useState(60);
  const [spyMode, setSpyMode] = useState(false);
  const [spyNumber, setSpyNumber] = useState(0);
  const [theme, setTheme] = useState("");
  const [themeKr, setThemeKr] = useState("");
  const [easterEgg, setEasterEgg] = useState("false");
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const includeEasterEgg = easterEgg === "onnuri";
        const response = await fetch(`/api/themes?easterEgg=${includeEasterEgg}`);
        const data = await response.json();
        
        if (data.success) {
          setThemes(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error('Failed to fetch themes:', err);
        setError('Failed to load themes');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [easterEgg]);

  return (
    <GameContext.Provider
      value={{
        playerNum,
        setPlayerNum,
        timer,
        setTimer,
        spyMode,
        setSpyMode,
        spyNumber,
        setSpyNumber,
        theme,
        setTheme,
        themeKr,
        setThemeKr,
        easterEgg,
        setEasterEgg,
        themes,
        loading,
        error,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};
```

## Migration Scripts

### 1. Initial Schema Migration (migrations/001_initial_schema.sql)
```sql
-- Create themes table
CREATE TABLE IF NOT EXISTS themes (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) UNIQUE NOT NULL,
  name_ko VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_it VARCHAR(100) NOT NULL,
  easter_egg BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create words table
CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  theme_id INTEGER REFERENCES themes(id) ON DELETE CASCADE,
  word_ko VARCHAR(100) NOT NULL,
  word_en VARCHAR(100),
  word_it VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_words_theme_id ON words(theme_id);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_words_updated_at BEFORE UPDATE ON words
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Seed Data Script (migrations/002_seed_data.sql)
```sql
-- Insert themes
INSERT INTO themes (type, name_ko, name_en, name_it, easter_egg) VALUES
('food', '음식', 'Food', 'Cibo', false),
('place', '장소', 'Places', 'Luoghi', false),
('occupation', '직업', 'Occupations', 'Professioni', false),
('animal', '동물', 'Animals', 'Animali', false),
('activity', '활동', 'Activities', 'Attività', false),
('dailyObject', '일상용품', 'Daily Objects', 'Oggetti Quotidiani', false),
('biblecharacter', '성경인물', 'Bible Characters', 'Personaggi Biblici', false),
('onnurichanyangteammember', '온누리 찬양팀', 'Onnuri Worship Team', 'Team di Lode Onnuri', true);

-- Insert food words
INSERT INTO words (theme_id, word_ko, word_en, word_it)
SELECT 
  (SELECT id FROM themes WHERE type = 'food'),
  word_ko,
  NULL,
  NULL
FROM (VALUES
  ('짜장면'),
  ('피자'),
  ('삼계탕'),
  ('찜닭'),
  ('수제버거'),
  ('베이글'),
  ('고수'),
  ('스시'),
  ('버블티'),
  ('떡볶이'),
  ('볶음밥'),
  ('카레라이스'),
  ('우유'),
  ('치킨'),
  ('맥도날드'),
  ('타코'),
  ('케이크'),
  ('버팔로윙'),
  ('김치'),
  ('할라피뇨'),
  ('김밥'),
  ('순대국'),
  ('빙수'),
  ('아이스크림'),
  ('샌드위치')
) AS t(word_ko);

-- Add similar INSERT statements for other themes...
```

## Environment Variables

### .env.local
```env
# Database
POSTGRES_URL="your-neon-connection-string"

# Optional: Direct connection for migrations
POSTGRES_URL_NON_POOLING="your-neon-direct-connection-string"
```

## Testing Plan

1. **Unit Tests**
   - Database connection
   - API routes
   - Data transformation

2. **Integration Tests**
   - Theme fetching
   - Word selection
   - Game flow

3. **Performance Tests**
   - Database query performance
   - API response times
   - Concurrent connections

## Rollback Plan

If issues arise:
1. Keep Firebase config in a separate branch
2. Use feature flags to switch between databases
3. Maintain data export from Firebase as backup
4. Document all changes for easy reversal

## Resources

- [Neon Documentation](https://neon.tech/docs/introduction)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Notes

- Consider using Prisma ORM for better type safety and migrations
- Implement connection pooling for production
- Add rate limiting to API routes
- Consider caching frequently accessed data
- Monitor database performance and costs

---
*Last Updated: December 2024*  
*Status: 🟡 In Planning*

Legend:
- ✅ Complete
- 🟡 In Progress
- ⏳ Not Started
- ❌ Blocked
