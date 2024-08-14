from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
    path('join-game/', views.joinGame),
    path('ranked/', views.ranked),
    path('connect4/', views.connect4),
    path('pong3D/', views.pong3D),
    path('game/', views.gameHome),
	
    # view valide
    path('pong/local/', views.pongLocal),
    path('pong/custom/', views.pongCustom),
	path('pong/privGame/', views.pongPrivGame),
    path('pong/tournament/', views.pongTournament),
    path('pong/tournament/lobby/', views.pongTournamentLobby),
    path('pong/tournament/game/', views.pongTournamentGame),
]