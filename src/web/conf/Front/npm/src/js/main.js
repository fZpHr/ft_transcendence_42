import { Router } from "@js/router";
import { Route } from "@js/routes";

//Sert a appele export_components.js
import component from '@components/export_components';

const target = document.getElementById('main-content')
const router = new Router(target, {
  '/truc': new Route('/truc', component.truc),
  '/autretruc': new Route('/autretruc', component.autretruc)
});

router.init();
window.router = router;
