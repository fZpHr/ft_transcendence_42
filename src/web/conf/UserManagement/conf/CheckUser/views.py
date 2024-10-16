from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
import requests
import logging
from Register42.models import User
from django.db import connection

logger = logging.getLogger('print')

def check_user(request):
    if request.user.is_authenticated:
        response = JsonResponse({'status': 'success'})
        response.set_cookie("user42", request.user.get_username())
        logger.info(request.user.get_username())
        response.set_cookie("connected", "true")
        return response
    else:
        return JsonResponse({'status': 'error'})

def get_user_game(user_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT game_uuid, "isFinished", player1_id, player2_id, winner_id
            FROM public."MatchMakingHandler_game"
            WHERE player1_id = %s OR player2_id = %s
            ORDER BY created_at DESC
            LIMIT 10
        """, [user_id, user_id])
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        return result

def better_data_game(games, user_id):
    better_games = []
    for game in games:
        player1 = User.objects.get(id=game['player1_id'])
        player2 = User.objects.get(id=game['player2_id'])

        if game['player1_id'] == user_id:
            me = player1.username
            opp = player2.username
        else:
            me = player2.username
            opp = player1.username

        winner = player1.username if game['winner_id'] == player1.id else player2.username if game['winner_id'] == player2.id else None

        better_games.append({
            'game_uuid': game['game_uuid'],
            'isFinished': game['isFinished'],
            'me': me,
            'opp': opp,
            'winner': winner
        })

    return better_games

@csrf_exempt
@require_GET
def get_user(request):
    try:
        user = User.objects.get(username=request.COOKIES.get("user42"))
        user_id = user.id
        games = get_user_game(user_id)
        games = better_data_game(games, user_id)
        return JsonResponse({'user_id': user_id, 'games': games})
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
    except Exception as e:
        logger.error(f"Error retrieving user games: {e}")
        return JsonResponse({'status': 'error', 'message': 'An error occurred'}, status=500)

    