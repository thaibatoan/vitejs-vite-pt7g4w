export const RANKS = [
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
  '2',
] as const;
export const RANK_MAP = {
  '3': 0,
  '4': 1,
  '5': 2,
  '6': 3,
  '7': 4,
  '8': 5,
  '9': 6,
  '10': 7,
  J: 8,
  Q: 9,
  K: 10,
  A: 11,
  '2': 12,
} as const;

export const SUITS = ['♠️', '♣️', '♦️', '♥️'] as const;
export const SUIT_MAP = {
  '♠️': 0,
  '♣️': 1,
  '♦️': 2,
  '♥️': 3,
} as const;

export type CardRank = keyof typeof RANK_MAP;
export type CardSuit = keyof typeof SUIT_MAP;
export type Card = `${CardRank}${CardSuit}`;
