"""
ASGI config for GameServer project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from Connect4Handler.routing import websocket_urlpatterns as Connect4Handler_websocket_urlpatterns
from MatchMakingHandler.routing import websocket_urlpatterns as MatchMakingHandler_websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameServer.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            Connect4Handler_websocket_urlpatterns + MatchMakingHandler_websocket_urlpatterns
        )
    ),
})