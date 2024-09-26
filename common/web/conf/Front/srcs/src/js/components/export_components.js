import { autretruc } from "@components/autretruc";
import { truc } from "@components/truc";

customElements.define('truc-component', truc);
customElements.define('autretruc-component', autretruc);

export default {
    truc,
    autretruc
};