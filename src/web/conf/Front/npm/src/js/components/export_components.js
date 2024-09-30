import { autretruc } from "@components/test-components/autretruc";
import { truc } from "@components/test-components/truc";
import { NavBar } from "@components/navbar/navbar";
import { NotFound } from "@components/404";
import { Auth42 } from "@components/login/auth42";
import { PongMain } from "@components/pong/pongMain";
import { PongLocal } from "@components/pong/pongLocal";
// import { PongRemote } from "@components/pong/pongRemote";
// import { PongAI } from "@components/pong/pongAI";

window.customElements.define('truc-component', truc);
window.customElements.define('autretruc-component', autretruc);
window.customElements.define('navbar-component', NavBar);
window.customElements.define('not-found', NotFound);
window.customElements.define('auth42-component', Auth42);
window.customElements.define('pong-main-component', PongMain);
window.customElements.define('pong-local-component', PongLocal);
// window.customElements.define('pong-remote', PongRemote);
// window.customElements.define('pong-ai', PongAI);

export default {
    truc,
    autretruc,
    NavBar,
    NotFound,
    Auth42,
    PongMain,
    PongLocal
    // PongRemote,
    // PongAI
};