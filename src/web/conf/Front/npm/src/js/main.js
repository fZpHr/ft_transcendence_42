import { Router } from "@js/router";
import { Route } from "@js/routes";

//Sert a appele export_components.js
import "@components/export_components";

const target = document.getElementById('main-content')
const router = new Router(target, {
  '/': new Route('/', 'index-component'),
  '/truc/': new Route('/truc/', 'truc-component'),
  '/autretruc/': new Route('/autretruc/', 'autretruc-component'),
  '/pong/': new Route('/pong/', 'pong-main-component'),
  '/pong/local': new Route('/pong/local', 'pong-local-component'),
  // '/pong/ai': new Route('/pong/ai', 'pong-ai-component'),
  '/pong/remote': new Route('/pong/remote', 'pong-remote-component', "^id=[A-Z0-9]{7}$"),
  '/404/': new Route('/404/', 'not-found'),
});

router.init();
window.router = router;
