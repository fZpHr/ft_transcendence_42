import { autretruc } from "@components/test-components/autretruc";
import { truc } from "@components/test-components/truc";
import { NavBar } from "@components/navbar/navbar";
import { NotFound } from "@components/404";
import { Auth42 } from "@components/login/auth42";
import { PongMain } from "@components/pong/pongMain";
import { PongLocal } from "@components/pong/pongLocal";
// import { PongRemote } from "@components/pong/pongRemote";
// import { PongAI } from "@components/pong/pongAI";
import { Index } from "@components/index/index";
import { IndexConnected } from "@components/index/index_connected";
import { Tournament } from "@components/tournament/tournament";

window.customElements.define('tournament-component', Tournament);
window.customElements.define('index-connected-component', IndexConnected);
window.customElements.define('truc-component', truc);
window.customElements.define('autretruc-component', autretruc);
window.customElements.define('navbar-component', NavBar);
window.customElements.define('not-found', NotFound);
window.customElements.define('auth42-component', Auth42);
window.customElements.define('pong-main-component', PongMain);
window.customElements.define('pong-local-component', PongLocal);
// window.customElements.define('pong-ai-component', PongAI);
// window.customElements.define('pong-remote', PongRemote);
window.customElements.define('index-component', Index);


export default {
    truc,
    autretruc,
    NavBar,
    NotFound,
    Auth42,
    PongMain,
    PongLocal,
    // PongAI
    // PongRemote,
    Index,
    IndexConnected,
    Tournament
};