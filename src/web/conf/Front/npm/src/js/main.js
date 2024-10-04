import { Router } from "@js/router";
import { Route } from "@js/routes";

//Sert a appele export_components.js
import "@components/export_components";

const target = document.getElementById('main-content')
const router = new Router(target, {
  '/': new Route('/', 'index-component'),
  '/pong/': new Route('/pong/', 'pong-main-component'),
  '/pong/local': new Route('/pong/local', 'pong-local-component'),
  '/connect4/': new Route('/connect4/', 'connect4-component'),
  '/matchmaking/': new Route('/matchmaking/', 'matchmaking-component'),
  '/404/': new Route('/404/', 'not-found'),
});

router.init();
window.router = router;
