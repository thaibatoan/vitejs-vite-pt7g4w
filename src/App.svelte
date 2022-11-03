<script lang="ts">
  import { flip } from 'svelte/animate';
  import { crossfade, fly } from 'svelte/transition';
  import type { Card } from './constant';
  import { RANKS, RANK_MAP, SUITS, SUIT_MAP } from './constant';
  import { getCombinationType } from './logic';
  import StackedCards from './lib/StackedCards.svelte';
  import { getCardRankAndSuit, randomInt } from './utils';

  const [send, receive] = crossfade({});

  interface CurrentCard {
    card: Card;
    selected: boolean;
  }

  let currentCards: CurrentCard[] = randomHand();

  let playedCards: { cards: Card[]; rotation: number; x: number; y: number }[] = [
    { cards: ['3♠️', '4♠️', '5♠️'], rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
    { cards: ['6♠️', '7♠️', '8♠️'], rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
    { cards: ['9♠️', '10♠️', 'J♠️'], rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
  ];

  function selectCard(card: Card) {
    const selectedCard = currentCards.find((c) => c.card === card);
    selectedCard.selected = !selectedCard.selected;
    currentCards = [...currentCards];
  }

  let number = 0;

  let showHand = false;

  function sendCards(): void {
    const selectedCards: Card[] = currentCards.filter(({ selected }) => selected).map(({ card }) => card);
    playedCards = [...playedCards, { cards: selectedCards, rotation: 0, x: 0, y: randomInt(-50, 50) }];
    currentCards = currentCards.filter(({ selected }) => !selected);
  }

  function dealCards(): void {
    if (showHand) {
      showHand = false;
      currentCards = randomHand();
      number = 0;
    } else {
      showHand = true;
      setTimeout(() => {
        currentCards = currentCards.sort(({ card: card1 }, { card: card2 }) => {
          const [number1, type1] = getCardRankAndSuit(card1);
          const [number2, type2] = getCardRankAndSuit(card2);
          return RANK_MAP[number1] - RANK_MAP[number2] || SUIT_MAP[type1] - SUIT_MAP[type2];
        });
      }, 1800);

      const timer = setInterval(() => {
        number++;
        if (number >= 13) {
          clearInterval(timer);
        }
      }, 100);
    }
  }

  function randomHand(): CurrentCard[] {
    const result = new Set<Card>();

    while (result.size < 13) {
      const rank = RANKS[randomInt(0, 12)];
      const suit = SUITS[randomInt(0, 3)];
      result.add(`${rank}${suit}`);
    }
    return [...result].map((card) => ({ card, selected: false }));
  }

  function isValid() {
    const selectedCards: Card[] = currentCards.filter(({ selected }) => selected).map(({ card }) => card);
    if (playedCards.length > 0) {
      const lastCards = playedCards.at(-1).cards;
    }
  }

  $: selectedCards = currentCards.filter(({ selected }) => selected).map(({ card }) => card);
  $: isValidMove = getCombinationType(selectedCards) !== 'none';
</script>

<main>
  <div style="display: flex; justify-content: space-between">
    <StackedCards {number} />
    <StackedCards {number} />
    <StackedCards {number} />
  </div>

  <div class="board" style="position: relative; height: 300px">
    {#each playedCards as { cards, rotation, x, y }}
      <div class="board-item" style="rotate: {rotation}deg; translate: {x}px {y}px; --items: {cards.length}" >
        {#each cards as card}
          <div class="image">
            <img in:receive={{ key: card }} src="{card}.svg" class="logo" alt={card}  />
          </div>
        {/each}
      </div>
    {/each}
  </div>

  {#if showHand}
    <div class="hand">
      {#each currentCards as { card, selected }, i (card)}
        <img
          in:fly={{ y: -50, duration: 500, delay: i * 100 }}
          out:send={{ key: card }}
          animate:flip={{ duration: 400 }}
          class:selected
          src="{card}.svg"
          class="logo"
          alt={card}
          on:click={() => selectCard(card)}
          on:keypress={() => {}}
        />
      {/each}
    </div>
  {/if}

  <div style="padding: 2em">
    <button on:click={sendCards} disabled={!isValidMove}>Send</button>
    <button on:click={dealCards}>Deal</button>
  </div>

  {#each SUITS as suit}
    <div>
      {#each RANKS as rank}
        <img src="{rank}{suit}.svg" class="logo" alt={rank} />
      {/each}
    </div>
  {/each}
</main>

<style>
  .logo {
    width: 5em;
    will-change: filter;
  }

  .board {
    display: grid;
    place-items: center;
    grid-template-columns: 1fr;
    overflow: hidden;
  }

  .board-item {
    grid-row-start: 1;
    grid-column-start: 1;
    width: 100%;
    justify-content: center;
  }

  .board-item .image {
    display: inline-block;
    position: relative;
  }

  .board-item .image {
    margin-left: calc(-5em + clamp(1.4em, calc(calc(100vw / var(--items) - 2.5em)), 5em));
  }

  .board-item:not(:last-child) .image::after {
    position: absolute;
    content: '';
    background-color: black;
    inset: 0;
    border-radius: 10px;
    opacity: 50%;
  }

  .hand img + img {
    margin-left: -3.6em;
  }
  .hand img.selected {
    translate: 0 -1.5em;
  }
  .hand img:hover {
    z-index: 99;
    position: relative;
    filter: drop-shadow(0 0 2em #646cffaa);
  }
</style>
