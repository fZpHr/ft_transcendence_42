from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs

logger = logging.getLogger('print')
class Connect4GameConsumer(AsyncWebsocketConsumer):
    games = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None

    async def connect(self):
        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            'connect4',
            self.channel_name
        )

    async def receive(self, text_data):
        message = json.loads(text_data)
        logger.info(f"Message: {message}")
        # if message['type'] == 'create':
        # logger.info(f"Player: {Player}")
        # logger.info(f"RECEIVE called for room {self.room_name}")
        # Player = await sync_to_async(get_user_model)()