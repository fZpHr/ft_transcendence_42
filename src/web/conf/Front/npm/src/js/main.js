import { Router } from "@js/router";
import { Route } from "@js/routes";

//Sert a appele export_components.js
import "@components/export_components";

const target = document.getElementById('main-content')
const router = new Router(target, {
  '/truc/': new Route('/truc/', 'truc-component'),
  '/autretruc/': new Route('/autretruc/', 'autretruc-component')
});

router.init();
window.router = router;
