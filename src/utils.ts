import type { Card, CardRank, CardSuit } from './constant';

export function randomInt(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

export function getCardRankAndSuit(card: Card): [CardRank, CardSuit] {
  return [card.slice(0, -2) as CardRank, card.slice(-2) as CardSuit];
}
