from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from .models import UserProxy 
from .serializer import UserProxySerializer
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs
import asyncio

logger = logging.getLogger('print')

class PongAIConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None

    async def connect(self):
        await self.accept()
        # send message to the client
        await self.send(text_data=json.dumps({
            'ping': 'AI Connected'
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        logger.info(f"Received message: {text_data_json}")
        if text_data_json['type'] == 'pongInfos':
            logger.info(f"Paddle position as to be: {self.calculate_paddle_position(text_data_json)}")
    
    def calculate_paddle_position(self, ball_info):
        ball_pos = ball_info['ballPosition']
        ball_speed_x = ball_info['ballSpeedX']
        ball_speed_y = ball_info['ballSpeedY']
        paddle1_position = ball_info['paddle1Position']
        paddle2_position = ball_info['paddle2Position']
        base_size = ball_info['baseSize']

        court_height = base_size['height']
        court_width = base_size['width']

        ball_x = ball_pos['left']
        ball_y = ball_pos['top']
        ball_radius = ball_pos['width'] / 2

        while True:
            ball_x += ball_speed_x
            ball_y += ball_speed_y
            
            if ball_y <= 0 or ball_y + ball_radius * 2 >= court_height:
                ball_speed_y = -ball_speed_y
                ball_y = max(0, min(ball_y, court_height - ball_radius * 2))

            if ball_x <= paddle1_position + 15 and ball_x >= 0:
                return min(max(ball_y - ball_radius, 0), court_height - 15)

            if ball_x >= court_width - (paddle2_position + 15) and ball_x <= court_width:
                return min(max(ball_y - ball_radius, 0), court_height - 15)

            if ball_x < 0 or ball_x > court_width:
                break

        return paddle1_position 




