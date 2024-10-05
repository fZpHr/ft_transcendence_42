from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs

logger = logging.getLogger('print')
class Connect4Game:
    def __init__(self, game_id):
        self.game_id = game_id
        self.board = [[0 for _ in range(7)] for _ in range(6)]
        self.turn = 1
        self.winner = None
        self.moves = 0
        self.players = []

    def __str__(self):
        return f"Player 1: {self.player1}, Player 2: {self.player2}, Turn: {self.turn}, Winner: {self.winner}, Moves: {self.moves}"

    def make_move(self, column):
        if self.winner:
            return False
        if self.board[0][column] != 0:
            return False
        for i in range(5, -1, -1):
            if self.board[i][column] == 0:
                self.board[i][column] = self.turn
                self.moves += 1
                if self.check_winner(i, column):
                    self.winner = self.turn
                self.turn = 1 if self.turn == 2 else 2
                return True
        return False

    def check_winner(self, row, column):
        directions = [(0, 1), (1, 0), (1, 1), (1, -1)]
        for dr, dc in directions:
            count = 1
            for i in range(1, 4):
                r, c = row + dr * i, column + dc * i
                if 0 <= r < 6 and 0 <= c < 7 and self.board[r][c] == self.turn:
                    count += 1
                else:
                    break
            for i in range(1, 4):
                r, c = row - dr * i, column - dc * i
                if 0 <= r < 6 and 0 <= c < 7 and self.board[r][c] == self.turn:
                    count += 1
                else:
                    break
            if count >= 4:
                return True
        return False

    def get_board(self):
        return self.board

    def get_turn(self):
        return self.turn

    def get_winner(self):
        return self.winner

    def get_moves(self):
        return self.moves

    def get_player1(self):
        return self.player1

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
        if message['type'] == 'join':
            self.player_id = message['player_id']
            self.room_name = message['room']
            self.room_group_name = 'connect4' + self.room_name
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            Connect4GameConsumer.games[self.room_name] = Connect4Game(message['room'])
            Connect4GameConsumer.games[self.room_name].players.append(self.player_id)
            Connect4GameConsumer.games[self.room_name].players.append("random")
            if len(Connect4GameConsumer.games[self.room_name].players) == 2:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_start',
                        'message': 'Game started',
                        'player1': Connect4GameConsumer.games[self.room_name].players[0],
                        'player2': Connect4GameConsumer.games[self.room_name].players[1],
                        'player_turn': Connect4GameConsumer.games[self.room_name].get_turn(),
                    }
                )
            #start timer ?
            return
        
    async def game_start(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_start',
            'message': event['message'],
            'player1': event['player1'],
            'player2': event['player2'],
            'player_turn': event['player_turn']
        }))