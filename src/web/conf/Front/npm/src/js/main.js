import { Router } from "@js/router";
import { Route } from "@js/routes";

//Sert a appele export_components.js
import "@components/export_components";

const target = document.getElementById('main-content')
const router = new Router(target, {
  '/': new Route('/', 'index-component', null, false),
  '/404': new Route('/404', 'not-found', null, false),
  '/pong': new Route('/pong', 'pong-main-component'),
  '/pong/local': new Route('/pong/local', 'pong-local-component'),
  '/matchmaking': new Route('/matchmaking', 'matchmaking-component'),
  '/pong/ai': new Route('/pong/ai', 'pong-ai-component'),
  '/connect4': new Route('/connect4', 'connect4-component', "^id=[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"),
  '/tournament': new Route(`/tournament`, 'tournament-component'),
  '/credits': new Route(`/credits`, 'credits-component'),
  '/pong/multiplayer': new Route('/pong/multiplayer', 'multiplayer-pong-component'),
  '/pong/3d': new Route('/pong/3d', 'p3d-pong-component'),
});

window.router = router;
router.init();
