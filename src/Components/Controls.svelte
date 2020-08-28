<script>
  export let num = 1;
  export let page;
  export let lang;
  const word = {
    ru: {
      picked: "Выбрано",
      next: "ДАЛЕЕ",
      send: "ОТПРАВИТЬ"
    },
    kz: {
      picked: "Таңдалған",
      next: "ӘРІ ҚАРАЙ",
      send: "ЖІБЕРУ"
    },
    en: {
      picked: "Picked",
      next: "NEXT",
      send: "SEND"
    }
  };
</script>

<style>
  .controls {
    height: 48px;
    position: fixed;
    bottom: 0;
    padding: 0 30px;
  }
  .controls > * {
    color: white;
  }

  .button {
    display: flex;
    align-items: center;
    padding: 10px 0;
    cursor: pointer;
  }

  .button > img {
    margin: 0 0 1px 4px;
    cursor: pointer;
  }
</style>

<div class="flex-row-sb width-620 controls">
  <span>{word[lang].picked}: {num}</span>
  <span class="button" on:click>
    {#if page == 0}
      <span>{word[lang].next}</span>
      <img src="/icons/right.svg" height="12px" alt=">" />
    {:else}
      <span>{word[lang].send}</span>
      <img src="/icons/wa.svg" alt=">" />
    {/if}
  </span>
</div>
