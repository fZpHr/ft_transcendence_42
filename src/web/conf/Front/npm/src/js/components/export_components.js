import { autretruc } from "@components/autretruc";
import { truc } from "@components/truc";
import { NavBar } from "@components/navbar";

window.customElements.define('truc-component', truc);
window.customElements.define('autretruc-component', autretruc);
window.customElements.define('navbar-component', NavBar);

export default {
    truc,
    autretruc,
    NavBar
};