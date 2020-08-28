<script>
  import Navbar from "./Components/Navbar.svelte";
  import Controls from "./Components/Controls.svelte";
  import Posts from "./Components/Posts.svelte";
  import Map from "./Components/Map.svelte";
  import { items, link, adrs, locator } from "./Scripts/stores.js";
  import { setCookie } from "./Scripts/parse.js";
  export let igid;
  export let phone;
  export let lang;

  const word = {
    ru: {
      order: "Заказ",
      address: "Адрес"
    },
    kz: {
      order: "Тапсырыс",
      address: "Мекен-жай"
    },
    en: {
      order: "Order",
      address: "Address"
    }
  };

  $: page = 0;

  function next() {
    page > 0 ? sendMsg() : page++;
  }

  let picked = 0;
  let pick = [];
  items.subscribe(v => {
    pick = v.filter(k => k.quant > 0);
    picked = pick.length;
  });

  let adr;
  adrs.subscribe(v => {
    adr = v;
  });

  let lk;
  link.subscribe(v => {
    lk = v;
  });

  let coords;
  locator.subscribe(v => {
    coords = v;
  });

  function sendMsg() {
    setCookie("coords", coords, 365);
    let list = "⚡ " + word[lang].order + ":\n";
    for (let p of pick) {
      let cap = p.caption;

      if (cap.substring(0, 11) !== "https://www.") {
        cap = cap
          .substring(0, 23)
          .split("\n")[0]
          .replace("#", "");
      }
      console.log(cap);
      list += p.quant + " - " + cap + "\n";
    }

    let address = "\n🚚 " + word[lang].address + ":\n" + adr + "\n";
    let lnk = "\n🔗 " + lk + "\n---";
    let msg = encodeURI(list + address + lnk);
    window.location = "https://wa.me/" + phone + "?text=" + msg;
  }
</script>

<style>
  main {
    position: relative;
    height: var(--fullH);
    background: linear-gradient(90deg, #655dfe 0%, #8580ff 100%);
  }

  .container {
    background: white;
    box-shadow: 0px 2px 15px 1px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    position: relative;
  }

  .up {
    height: calc(var(--fullH) - 48px);
    animation: frombottom 0.4s;
  }

  @keyframes frombottom {
    from {
      height: var(--fullH);
    }
    to {
      height: calc(var(--fullH) - 48px);
    }
  }

  .down {
    height: var(--fullH);
    animation: tobottom 0.4s;
  }

  @keyframes tobottom {
    from {
      height: calc(var(--fullH) - 48px);
    }
    to {
      height: var(--fullH);
    }
  }
</style>

<main class="width-620">
  <Navbar on:click={() => page--} hideBack={page == 0} {lang} />
  <div class="container {picked > 0 ? 'up' : 'down'}">
    <Posts {page} {igid} {lang} />
    <Map {page} {lang} />
  </div>
  <Controls num={picked} on:click={next} {page} {lang} />
</main>
