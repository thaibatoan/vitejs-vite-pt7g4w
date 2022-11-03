<script>
export let number = 0;
</script>

<div class="wrapper">
  {#if number == 0}<img src="back.svg" alt="back" />{/if}
  <div class="indicator" style="translate: -{number* 1.2}px -5px">{number}</div>
  {#each new Array(number) as card, i (i)}
    <img src="back.svg" alt="back" style="translate: {-i}px 0; rotate: {number/2 - i}deg;" />
  {/each}
</div>

<style>
  .wrapper {
      position: relative;
      padding-inline: 2em;
  }
  .wrapper img{
    height: auto;
    width: 4em;
    transform-origin: 50% 100%;
  }
  .wrapper img + img{
    margin-left: -4em;
  }
  .indicator {
    position: absolute;
    font-size: 2em;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    font-family: 'Sofia';
  }
</style>