from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from Connect4Handler.models import UserProxy 
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
            delta = text_data_json['paddle2Position'] - self.calculate_paddle_position(text_data_json)
            paddleSpeed = text_data_json['paddleSpeed']
            logger.info(f"bally: {self.calculate_paddle_position(text_data_json)}")
            logger.info(f"paddle2Position: {text_data_json['paddle2Position']}")
            logger.info(f"delta: {delta}")
            #paddle pos = centre du paddle
            #donc si le delta est entre 50 et -50 ne pas bouger
            if (delta < 50 and delta > -50):
                await self.send(text_data=json.dumps({
                    'type': "moveAi",
                    'keyPressed': 'none'
                }))
            if (delta > 0):
                await self.send(text_data=json.dumps({
                    'type': "moveAi",
                    'keyPressed': 'ArrowUp',
                    'duration': self.calculate_duration(delta, paddleSpeed),
                }))
            elif (delta < 0):
                await self.send(text_data=json.dumps({
                    'type': "moveAi",
                    'keyPressed': 'ArrowDown',
                    'duration': self.calculate_duration(delta, paddleSpeed),
                }))
    
    #Calcul la position ball_y final (un peu precis ca va)
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
            
            if ball_y <= 0:
                ball_speed_y = -ball_speed_y
                ball_y = 0
            if ball_y + ball_radius * 2 >= court_height:
                ball_speed_y = -ball_speed_y
                ball_y = court_height - ball_radius * 2

            if ball_x <= 0:
                ball_speed_x = -ball_speed_x
                ball_x = 0

            #Peut etre mettre court_width - 15 pour avoir la pos y de la balle au paddle
            if ball_x >= court_width:
                return ball_y
        return court_height / 2

    def calculate_duration(self, delta, paddleSpeed):
        #Des maths vraiment randoms
        duration = abs(delta) * (1000 / (60 * paddleSpeed))
        if (duration >= 1000):
            duration = 999
        return duration

