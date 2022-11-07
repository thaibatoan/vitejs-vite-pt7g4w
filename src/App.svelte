<script lang="ts">
  import { flip } from 'svelte/animate';
  import { crossfade, fly } from 'svelte/transition';
  import type { Card } from './constant';
  import { RANKS, RANK_MAP, SUITS, SUIT_MAP } from './constant';
  import { getCombinationType, isValidMove, compareCard } from './logic';
  import StackedCards from './lib/StackedCards.svelte';
  import { getCardRankAndSuit, randomInt } from './utils';
  import ArcanaCard from './lib/ArcanaCard.svelte';

  const [send, receive] = crossfade({});

  interface CurrentCard {
    card: Card;
    selected: boolean;
  }

  interface History { cards: Card[]; owner: number , rotation: number; x: number; y: number }

  let currentCards: CurrentCard[] = randomHand();
  let players = 4;
  let id = 0;

  let history: History[] = [
    { cards: ['3♠️', '4♠️', '5♠️'], owner: 0, rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
    { cards: [], owner: 1, rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
    { cards: ['6♠️', '7♠️', '8♠️'], owner: 2, rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
    { cards: ['9♠️', '10♠️', 'J♠️'], owner: 3, rotation: randomInt(-30, 30), x: randomInt(-50, 50), y: randomInt(-50, 50) },
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
    history = [...history, { cards: selectedCards, owner: 0, rotation: 0, x: 0, y: randomInt(-50, 50) }];
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
        currentCards = currentCards.sort(({ card: card1 }, { card: card2 }) => compareCard(card1, card2));
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

  $: selectedCards = currentCards.filter(({ selected }) => selected).map(({ card }) => card);
  $: isValid = isValidMove(history, selectedCards, id, players);
 </script>

<main>
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr">
    <StackedCards {number} />
    <StackedCards {number} />
    <StackedCards {number} />
  </div>

  <div class="board" style="position: relative; height: 300px">
    {#each history as { cards, rotation, x, y }}
      <div class="board-item" style="rotate: {rotation}deg; translate: {x}px {y}px; --items: {cards.length}">
        {#each cards as card}
          <div class="image">
            <img in:receive={{ key: card }} src="{card}.svg" class="logo" alt={card} />
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
    <button on:click={sendCards} disabled={!isValid}>Send</button>
    <button on:click={dealCards}>Deal</button>
  </div>
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
