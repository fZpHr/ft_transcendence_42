import { autretruc } from "@components/autretruc";
import { truc } from "@components/truc";

window.customElements.define('truc-component', truc);
window.customElements.define('autretruc-component', autretruc);

export default {
    truc,
    autretruc
};