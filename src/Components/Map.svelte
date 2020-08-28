<script>
  export let page;
  export let lang;
  import { adrs, link, locator } from "../Scripts/stores.js";
  import { getCookie } from "../Scripts/parse.js";

  const word = {
    ru: {
      deliver: "Адресс доставки",
      placehold: "Введите адрес",
      wait: "Определяем адрес..."
    },
    kz: {
      deliver: "Жеткізу мекен-жайы",
      placehold: "Мекенжайды енгізіңіз",
      wait: "Мекен-жай анықталуда..."
    },
    en: {
      deliver: "Delivery address",
      placehold: "Enter address",
      wait: "Detecting the address..."
    }
  };

  let myMap;
  function init() {
    ymaps.ready(function() {
      let coords = getCookie("coords");
      if (coords == "") {
        yandexCenter();
      } else {
        let coor = coords.split(",");

        makeMap(coor);
        getAdr();
      }
    });
  }

  function yandexCenter() {
    ymaps.geolocation
      .get({
        provider: "yandex",
        mapStateAutoApply: true
      })
      .then(function(res) {
        makeMap(res.geoObjects.position);
        getAdr();
      });
  }

  function makeMap(coords) {
    myMap = new ymaps.Map(
      "map",
      {
        center: coords,
        zoom: 17,
        controls: []
      },
      {
        suppressMapOpenBlock: true
      }
    );
  }

  let adr = "";
  let fly = "";
  function getAdr() {
    let coords = myMap.getCenter();
    link.set(
      "https://yandex.kz/maps/?ll=" + coords[1] + "%2C" + coords[0] + "&z=17"
    );
    ymaps.geocode(coords).then(function(res) {
      adr = res.geoObjects.get(0).properties.get("name");
      adrs.set(adr);
    });
    fly = "down";
    locator.set(coords);
  }

  $: search = "";

  function getCoords() {
    if (search != "") {
      ymaps.geocode(search).then(function(res) {
        adr = res.geoObjects.get(0).properties.get("name");
        let center = res.geoObjects.get(0).geometry._coordinates;
        myMap.setCenter(center);
        adrs.set(adr);
      });
    }
  }

  let inp = "";
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(v => {
        myMap.setCenter([v.coords.latitude, v.coords.longitude]);
        getAdr();
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
</script>

<style>
  #map {
    height: calc(var(--fullH) - 48px);
  }

  .address {
    z-index: 2;
    position: absolute;
    width: calc(100% - 36px);
    height: 60px;
    box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.52);
    border-radius: 10px;
    display: flex;
    align-items: center;
    top: 60px;
    right: 18px;
  }

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    .address {
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
    }
  }

  h4 {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
  }
  p {
    font-size: 11px;
    line-height: 19px;
    color: #9b9aa8;
  }
  .address > img {
    margin: 0 16px;
  }

  .pin {
    z-index: 9;
    height: 4px;
    width: 8px;
    border-radius: 50%;
    display: inline-block;
    background: gray;
    top: 50%;
    left: 50%;
    position: absolute;
  }

  .stay {
    margin-left: -21px;
    margin-top: -50px;
    padding-bottom: 10px;
  }

  .up {
    padding-bottom: 50px;
  }

  .down {
    padding-bottom: 10px;
  }

  .round {
    border-radius: 20px;
    background: white;
    z-index: 2;
    position: absolute;
    bottom: 34px;
    cursor: pointer;
    box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.3);
  }
  .round > img {
    padding: 8px;
    display: block;
  }
  .right {
    right: 18px;
  }

  .left {
    left: 18px;
  }

  .left > input {
    position: absolute;
    top: 0;
    height: 40px;
    background: none;
    border: none;
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
  }

  .show {
    width: calc(100% - 36px);
    animation: open 0.3s;
  }

  @keyframes open {
    from {
      width: 40px;
    }
    to {
      width: calc(100% - 36px);
    }
  }

  .hide {
    width: 40px;
    animation: close 0.3s;
  }

  @keyframes close {
    from {
      width: calc(100% - 36px);
    }
    to {
      width: 40px;
    }
  }

  .show > input {
    cursor: text;
  }

  .enter {
    position: absolute;
    top: 0;
    padding: 8px;
    right: 0;
    display: none;
  }

  .show > .enter {
    display: inline;
  }
</style>

<div class="content {page == 1}">

  <div class="address">
    <img src="/icons/pin.svg" alt="pin" />
    <div>
      <h4>{word[lang].deliver}:</h4>
      <p>{adr}</p>
    </div>
  </div>

  <div class="pin">
    <img src="/icons/place.svg" alt="place" class="stay {fly}" />
  </div>

  <span class="round right" on:click={getLocation}>
    <img src="/icons/locate.svg" alt="locate" />
  </span>

  <span class="round left {inp}" on:click={() => (inp = 'show')}>
    <img src="/icons/search.svg" alt="locate" />
    <input type="text" placeholder={word[lang].placehold} bind:value={search} />
    <span class="enter" on:click={getCoords}>
      <img src="/icons/enter.svg" alt="enter" />
    </span>
  </span>

  <div
    id="map"
    on:touchend={getAdr}
    on:touchstart={() => {
      fly = 'up';
      adr = word[lang].wait;
      inp = '';
    }}
    on:mousedown={() => {
      fly = 'up';
      adr = word[lang].wait;
      inp = '';
    }}
    on:mouseup={getAdr} />

</div>

<svelte:head>
  <script
    src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=cf1b8beb-bb0c-4563-9d28-c603002dd2ad"
    type="text/javascript"
    on:load={init}>

  </script>
</svelte:head>
