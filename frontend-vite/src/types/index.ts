// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Theme Types
export interface Theme {
  id: number;
  type: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Word Types
export interface Word {
  id: number;
  word: string;
  themeId: number;
  theme?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Game Types
export interface GameState {
  stage: 'intro' | 'select' | 'play';
  playerNum: number;
  currentPlayer: number;
  theme: string | null;
  word: string | null;
  liarPosition: number;
  revealedPlayers: number[];
  isReplay: boolean;
}

// UI Types
export type SkinType = 'dark' | 'light' | 'midnight' | 'ocean' | 'pink' | 'og';

export interface UIState {
  skin: SkinType;
  isLoading: boolean;
  error: string | null;
}

// Player Types
export interface Player {
  index: number;
  isLiar: boolean;
  hasRevealed: boolean;
}
