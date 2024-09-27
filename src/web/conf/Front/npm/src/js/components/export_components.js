import { autretruc } from "@components/autretruc";
import { truc } from "@components/truc";
import { NavBar } from "@components/navbar";
import { NotFound } from "@components/404";

window.customElements.define('truc-component', truc);
window.customElements.define('autretruc-component', autretruc);
window.customElements.define('navbar-component', NavBar);
window.customElements.define('not-found', NotFound);

export default {
    truc,
    autretruc,
    NavBar,
    NotFound
};