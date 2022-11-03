import { RANKS, RANK_MAP } from './constant';
import type { Card, CardRank, CardSuit } from './constant';
import { getCardRankAndSuit } from './utils';

export function getCombinationType(cardStrings: Card[]) {
  if (!cardStrings) return 'none';
  if (cardStrings.length === 0) return 'none';
  if (cardStrings.length === 1) return 'single';

  const cards: [CardRank, CardSuit][] = cardStrings.map(getCardRankAndSuit);
  const [firstCardRank] = cards[0];
  const ranks = cards.map(([rank]) => rank);
  const allSameRank = ranks.every((rank) => rank === firstCardRank);

  if (allSameRank) {
    if (cards.length === 2) return 'pair';
    if (cards.length === 3) return 'triple';
    return 'quad';
  }

  if (cards.length < 3) return 'none';

  if (ranks.includes('2')) return 'none';

  if (isStraight(ranks)) {
    return 'straight';
  }

  if (isStraightPairs(ranks)) {
    if (cards.length === 6) return 'three_straight_pairs';
    if (cards.length >= 8) return 'four_or_more_straight_pairs';
  }
  return 'none';
}

function isStraight(ranks: CardRank[]) {
  const start = RANK_MAP[ranks[0]];
  const expectedStraight = RANKS.slice(start, start + ranks.length).join('');
  const evaluatingStaight = ranks.join('');
  return expectedStraight === evaluatingStaight;
}

function isStraightPairs(ranks: CardRank[]) {
  if (ranks.length % 2 !== 0) return false;
  const start = RANK_MAP[ranks[0]];
  const expectedStraight = RANKS.slice(start, start + ranks.length / 2)
    .map((x) => `${x}${x}`)
    .join('');

  const evaluatingStaight = ranks.join('');
  return expectedStraight === evaluatingStaight;
}

function autoWin(cardStrings: Card[]) {
  const cards: [CardRank, CardSuit][] = cardStrings.map(getCardRankAndSuit);
  const ranks = cards.map(([rank]) => rank);
  const rankString = ranks.join('');
  if (rankString === '345678910JQKA2') return true;
  if (hasSixPairs(ranks)) return true;
  if (rankString.includes('2222')) return true;
}

function hasSixPairs(ranks: CardRank[]) {
  let flag = false;
  for (let i = 0; i < ranks.length; ) {
    if (ranks[i] === ranks[i + 1]) {
      i += 2;
    } else {
      if (flag) return false;
      flag = true;
      i += 1;
    }
  }
  return true;
}
