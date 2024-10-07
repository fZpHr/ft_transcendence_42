import { NavBar } from "@components/navbar/navbar";
import { NotFound } from "@components/404";
import { Auth42 } from "@components/login/auth42";
import { PongMain } from "@components/pong/pongMain";
import { PongLocal } from "@components/pong/pongLocal";
import { Index } from "@components/index/index";
import { IndexConnected } from "@components/index/index_connected";
import { Tournament } from "@components/tournament/tournament";
import { MatchMaking } from "@components/connect4/matchMaking";
import { Connect4 } from "@components/connect4/connect4";

window.customElements.define('tournament-component', Tournament);
window.customElements.define('index-connected-component', IndexConnected);
window.customElements.define('navbar-component', NavBar);
window.customElements.define('not-found', NotFound);
window.customElements.define('auth42-component', Auth42);
window.customElements.define('pong-main-component', PongMain);
window.customElements.define('pong-local-component', PongLocal);
window.customElements.define('index-component', Index);
window.customElements.define('matchmaking-component', MatchMaking);
window.customElements.define('connect4-component', Connect4);


export default {
    NavBar,
    NotFound,
    Auth42,
    PongMain,
    PongLocal,
    Index,
    MatchMaking,
    Connect4,
    IndexConnected,
    Tournament
};