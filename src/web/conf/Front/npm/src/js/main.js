import { Router } from "@js/router";
import { Route } from "@js/routes";

//Sert a appele export_components.js
import "@components/export_components";

const target = document.getElementById('main-content')
const router = new Router(target, {
  '/': new Route('/', 'auth42-component'),
  '/truc/': new Route('/truc/', 'truc-component'),
  '/autretruc/': new Route('/autretruc/', 'autretruc-component'),
  '/pong/': new Route('/pong/', 'pong-component'),
  '/404/': new Route('/404/', 'not-found'),
});

router.init();
window.router = router;
