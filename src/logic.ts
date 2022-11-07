import { RANKS, RANK_MAP, SUIT_MAP } from './constant';
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
    return `${ranks.length}_straight`;
  }

  if (isStraightPairs(ranks)) {
    return `${ranks.length / 2}_straight_pairs`;
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

interface CurrentCard {
  card: Card;
  selected: boolean;
}

interface History {
  cards: Card[];
  owner: number;
  rotation: number;
  x: number;
  y: number;
}

export function isValidMove(
  history: History[],
  selectedCards: Card[],
  myId: number,
  players = 4
) {
  if (!selectedCards || selectedCards.length === 0) return false;
  const lastPlayer = history.at(-1).owner;
  const nextPlayer = (lastPlayer + 1) % players;
  if (nextPlayer !== myId) return false;

  const lastPlayedEntry = history
    .filter((entry) => entry.cards.length > 0)
    .at(-1);
  console.log(lastPlayedEntry);
  const myCombination = getCombinationType(selectedCards);
  console.log(myCombination);
  if (!lastPlayedEntry || lastPlayedEntry.owner === myId) {
    console.log('free');
    return myCombination !== 'none';
  }
  const lastOpponentCombination = getCombinationType(lastPlayedEntry.cards);
  console.log(selectedCards, lastPlayedEntry.cards);
  const hasBiggerCard =
    compareCard(selectedCards.at(-1), lastPlayedEntry.cards.at(-1)) > 0;
  return lastOpponentCombination === myCombination && hasBiggerCard;
}

function isMyTurn(lastPlayer: number, id: number, players: number) {
  return (lastPlayer + 1) % players === id;
}

export function compareCard(card1: Card, card2: Card) {
  const [number1, type1] = getCardRankAndSuit(card1);
  const [number2, type2] = getCardRankAndSuit(card2);
  return (
    RANK_MAP[number1] - RANK_MAP[number2] || SUIT_MAP[type1] - SUIT_MAP[type2]
  );
}
