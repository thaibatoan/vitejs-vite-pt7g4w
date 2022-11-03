<script lang="ts">
  import type { CardRank, CardSuit } from '../constant';

  export let rank: CardRank;
  export let suit: CardSuit;
</script>

<svg
  viewBox="0 0 140 190"
  style:color={suit === '♠️' || suit === '♣️' ? '#0c0c0c' : 'red'}
  vector-effect="non-scaling-stroke"
>
  <g>
    <g>
      <path
        d="m21 5h103c8.86 0 16 7.136 16 16v153c0 8.86-7.14 16-16 16h-103c-8.864 0-16-7.14-16-16v-153c0-8.864 7.136-16 16-16z"
        fill-opacity=".49804"
      />
      <path
        d="m17 1h103c8.86 0 16 7.136 16 16v153c0 8.86-7.14 16-16 16h-103c-8.864 0-16-7.14-16-16v-153c0-8.864 7.136-16 16-16z"
        fill="#e7e7e7"
      />
      <path
        d="m19 3h103c8.86 0 16 7.136 16 16v153c0 8.86-7.14 16-16 16h-103c-8.864 0-16-7.14-16-16v-153c0-8.864 7.136-16 16-16z"
        fill="#c7891f"
      />
      <path
        d="m18 2h103c8.86 0 16 7.136 16 16v153c0 8.86-7.14 16-16 16h-103c-8.864 0-16-7.14-16-16v-153c0-8.864 7.136-16 16-16z"
        fill="#fff"
      />
    </g>
  </g>
  <g class="path-wrapper" stroke="currentColor" stroke-width="2px" vector-effect="non-scaling-stroke">
    {#await import(`../assets/${rank}${suit}.svg?raw`) then { default: svg }}
      {@html svg}
    {/await}
  </g>
</svg>
