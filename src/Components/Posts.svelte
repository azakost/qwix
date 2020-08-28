<script>
  export let page;
  export let igid;
  export let lang;
  import { getPosts } from "../Scripts/parse.js";
  import Is from "./InfiniteScroll.svelte";
  import { items } from "../Scripts/stores.js";

  const word = {
    ru: {
      subtext: "Выберите одну или несколько позиций"
    },
    kz: { subtext: "Бір немесе бірнеше позиция таңдаңыз" },
    en: { subtext: "Select one or more positions" }
  };

  import Loader from "./Loader.svelte";
  let newBatch = [];
  let nextUrl = "";
  let data = [];
  let more = true;
  let name = "";
  async function fetchData() {
    if (more) {
      const r = await getPosts(nextUrl, igid);
      name = r.user;
      nextUrl = r.next;
      more = r.more;
      newBatch = r.posts;
      data = [...data, ...newBatch];
    }
  }

  function increment(p) {
    p.quant++;
  }

  function decrement(p) {
    p.quant--;
  }
</script>

<style>
  .grid {
    display: flex;
    flex-wrap: wrap;
    height: calc(100% - 56px);
    overflow-x: hidden;
  }

  .grid::-webkit-scrollbar {
    display: none;
  }

  .grid > div {
    width: calc((100% / 3) - (4px / 3));
    margin: 0 2px 2px 0;
    position: relative;
    cursor: pointer;
  }

  .grid > div:nth-child(3n) {
    margin-right: 0;
  }

  .grid > div > img {
    width: 100%;
    height: auto;
    vertical-align: bottom;
    z-index: 0;
  }

  .top-60 {
    padding-top: 60px;
  }

  h3 {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  p {
    margin-bottom: 16px;
    font-size: 12px;
    color: #9b9aa8;
  }

  .pick {
    position: absolute;
    background: rgb(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .qwant {
    display: flex;
    align-content: center;
    color: white;
  }

  .qwant > span {
    line-height: 26px;
    font-size: 14px;
    font-weight: 500;
  }
  .qwant > i {
    padding: 0 10px;
  }

  .show {
    display: none;
  }
</style>

<div class="content top-60 {page == 0}">
  {#await fetchData()}
    <Loader />
  {:then d}
    <h3>@{name}</h3>
    <p>{word[lang].subtext}:</p>
    <div class="grid">
      {#each data as p}
        <div>
          <div class="pick {p.quant == 0 ? 'show' : ''}">
            <div class="qwant">
              <i
                on:click={() => {
                  p.quant--;
                  items.set(data);
                }}>
                <img src="/icons/minus.svg" alt="" />
              </i>
              <span>{p.quant}</span>

              <i
                on:click={() => {
                  p.quant++;
                  items.set(data);
                }}>
                <img src="/icons/plus.svg" alt="" />
              </i>
            </div>
          </div>
          <img
            src={p.image}
            alt=""
            on:click={() => {
              p.quant++;
              items.set(data);
            }} />
        </div>
      {/each}
      <Is on:loadMore={fetchData} elementScroll={null} />
    </div>
  {/await}
</div>
