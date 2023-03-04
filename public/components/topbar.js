class Header extends HTMLElement {
  constructor() {
    super();
    this.challanges = 0;
    this.games = 0;
  }

  static get observedAttributes() {
    return ['challanges', 'games'];
  }
  attributeChangedCallback(property, oldValue, newValue) {

    if (oldValue === newValue) return;
    this[ property ] = newValue;
    
  }

  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <style>
          i, button, .find {
            color: white;
          }
          .notifications {
            height: 15px;
            width: 15px;
            background-color: red;
            border-radius: 50%;
            display: inline-block;
          }
          nav {
            display: flex;
            justify-content: space-between;
            max-width: 100vw;
            height: 10vh;
            /* background-color: #2F2F2F; */
            background-color: #4267B2;
            box-shadow: 0px 8px 24px -4px rgba(66, 103, 178, 1);          
          }
          .topbar-right {
            width: 76vw;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .topbar-left {
            width: 24vw;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .fa-sign-out {
            font-size: 30px;
            transition: 0.6s;
          }
          .fa-sign-out:hover {
            color: red;
          }
          #firstName {
            background: none;
          }
          .top-button {
            background: none;
            border: none;
            padding: 30px;
            height: 10vh;
            margin: 5px;
            border-left: 2px solid white;
          }
          #firstName {
            outline: none;
            border: 1px solid black;
            border-radius: 5px;
            margin: 10px;
            padding: 10px;
            width: 12vw;
            transition: 0.5s;
          }

          #firstName:focus {
            border: 1px solid white;
            /* background-color: #393939; */
            background-color: #5a78b5;
            padding: 12px;
            width: 15vw;
          }
          nav img {
            width: 3em;
            height: 3em;
            border-radius: 100%;
          }
        </style>
        <header>
          <nav>
            <div class="topbar-left">
              <img src="/images/profile1.jpeg" />
              <a href="/account"><button class="top-button">Strona Główna</button></a>
              <a href="/instalation"><button class="top-button">Instalacja Pythona</button></a>
            </div>
            <div class="topbar-right">
                <form action="/api/search" method="POST">
                <i class="fa fa-search"></i><input class="find" type="text" placeholder="Znajdź swoich znajomych :)" name="firstName" id="firstName">
                </form>
                <a href="/games"><button class="top-button">Aktywne gry <b class="notifications">${this.games}</b></button></a>
                <a href="/challanges"><button class="top-button">Wyzwania <b class="notifications">${this.challanges}</b></button></a>
                <a href="/course"><button class="top-button">Rozdziały</button></a>
                <a href="/leaderboard"><button class="top-button">Tablica wyników</button></a>
                <form action="/api/logout?_method=DELETE" method="POST">
                    <button title="Logout" type="submit" class="fa fa-sign-out top-button"></button>
                </form>
            </div>
          </nav>
        </header>
      `;
  }
}

customElements.define("topbar-component", Header);
