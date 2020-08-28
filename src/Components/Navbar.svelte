<script>
  export let hideBack = false;
  export let lang;
  const word = {
    ru: {
      Link1: "Получить ссылку своего магазина",
      Link2: "О проекте",
      Link3: "Russian title 3"
    },
    kz: {
      Link1: "Дүкеніңіздің сілтемесін алу",
      Link2: "Проект туралы",
      Link3: "Kazakh title 3"
    },
    en: {
      Link1: "Get link for your store",
      Link2: "About project",
      Link3: "English title 3"
    }
  };
  let turn = "";
  function turnMenu() {
    turn = turn != "on" ? "on" : "off";
  }

  let greet = encodeURI("Здравствуйте! Хочу ссылку на свой инстаграм-магазин!");
</script>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }

  .nav {
    background: white;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.3);
    position: relative;
    height: 40px;
    z-index: 3;
  }

  .nav > * {
    padding: 8px 18px;
    min-width: 24px;
    cursor: pointer;
  }

  .links {
    z-index: 2;
    margin-top: -163px;
  }

  .links > a {
    display: block;
    text-align: center;
    padding: 12px;
    background: white;
    border-bottom: 1px solid rgb(226, 226, 226);
  }

  .overlay {
    position: absolute;
    height: var(--fullH);
    width: 100%;
    background: rgba(0, 0, 0, 0);
    z-index: 1;
    display: none;
  }

  .on {
    margin-top: 0px;
    animation: fromtop 0.5s;
  }

  @keyframes fromtop {
    from {
      margin-top: -163px;
    }
    to {
      margin-top: 0px;
    }
  }

  .on > .overlay {
    display: inline;
    animation: appear 0.5s;
    background: rgba(0, 0, 0, 0.5);
  }

  @keyframes appear {
    from {
      background: rgba(0, 0, 0, 0);
    }
    to {
      background: rgba(0, 0, 0, 0.5);
    }
  }

  .off {
    margin-top: -163px;
    animation: totop 0.3s;
  }

  @keyframes totop {
    from {
      margin-top: 0px;
    }
    to {
      margin-top: -163px;
    }
  }
</style>

<nav class="width-620">
  <div class="flex-row-sb nav">
    <div>
      <img src="icons/back.svg" alt="back" on:click hidden={hideBack} />
    </div>
    <img src="icons/logo.svg" alt="logo" />
    <img src="icons/menu.svg" alt="menu" on:click={turnMenu} />
  </div>
  <div class="links {turn}">
    <a href="https://wa.me/77776420344?text={greet}">{word[lang].Link1}</a>
    <a href="https://www.instagram.com/qwix.app">{word[lang].Link2}</a>
    <div class="overlay" on:click={turnMenu} />
  </div>
</nav>
