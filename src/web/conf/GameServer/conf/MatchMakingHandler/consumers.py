import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging
from .models import Game
from Connect4Handler.models import UserProxy
from asgiref.sync import sync_to_async

logger = logging.getLogger('print')

class MatchMakingHandler(AsyncWebsocketConsumer):
    waiting_list = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None
        self.player_id = None

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        if self in MatchMakingHandler.waiting_list:
            MatchMakingHandler.waiting_list.remove(self)
        return

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        logger.info(f"Received message: {text_data_json}")
        player_id = text_data_json['player_id']
        self.player_id = player_id
        if self in MatchMakingHandler.waiting_list:
            return
        MatchMakingHandler.waiting_list.append(self)
        if len(MatchMakingHandler.waiting_list) >= 2:
            opponent1 = MatchMakingHandler.waiting_list.pop()
            opponent2 = MatchMakingHandler.waiting_list.pop()
            player1 = await sync_to_async(UserProxy.objects.get)(username=opponent1.player_id)
            player2 = await sync_to_async(UserProxy.objects.get)(username=opponent2.player_id)
            if player1.username == player2.username:
                MatchMakingHandler.waiting_list.append(opponent2)
                await opponent1.send(text_data=json.dumps({
                    'type': 'match_failed',
                    'message': 'You are already in the queue'
                }))
                return
            game = await sync_to_async(Game.objects.create)(
                player1=opponent1.player_id,
                player2=opponent2.player_id
            )
            logger.info(f"Match found between {opponent1.player_id} and {opponent2.player_id}")
            room_name = str(game.game_uuid)
            await opponent1.send(text_data=json.dumps({
                'type': 'match_found',
                'game_id': room_name,
                'player': 'player2'
            }))
            await opponent2.send(text_data=json.dumps({
                'type': 'match_found',
                'game_id': room_name,
                'player': 'player1'
            }))