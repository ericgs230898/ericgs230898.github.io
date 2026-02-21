export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export interface Card {
  id: string;
  word1: string;
  word2: string;
  difficulty: Difficulty;
  selectedWord?: string;
  isCorrect?: boolean;
  isCompleted?: boolean;
}

export interface GameRound {
  cards: Card[];
  timeLimit: number;
  timeRemaining: number;
  correctCards: number;
  failedCards: number;
  score: number;
}

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    color: '#4CAF50',
    label: 'Fácil',
    points: 1,
    icon: '⭐'
  },
  [Difficulty.MEDIUM]: {
    color: '#FFC107',
    label: 'Medio',
    points: 2,
    icon: '⭐⭐'
  },
  [Difficulty.HARD]: {
    color: '#F44336',
    label: 'Difícil',
    points: 3,
    icon: '⭐\n⭐⭐'
  },
  [Difficulty.EXPERT]: {
    color: '#9C27B0',
    label: 'Experto',
    points: 5,
    icon: '⭐⭐\n⭐⭐'
  }
};
