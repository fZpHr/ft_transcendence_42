from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from .models import UserProxy 
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs
import asyncio

logger = logging.getLogger('print')
class Connect4Game:
    def __init__(self, game_id):
        self.game_id = game_id
        self.board = [[0 for _ in range(7)] for _ in range(6)]
        self.turn = 1
        self.winner = None
        self.moves = 0
        self.players = []
        self.timer_started = False
        self.timer = 30
        self.gameFinished = False

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
            self.room_group_name,
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
            if self.room_name not in Connect4GameConsumer.games:
                Connect4GameConsumer.games[self.room_name] = Connect4Game(message['room'])
            if Connect4GameConsumer.games[self.room_name].gameFinished:
                player1_username_win = Connect4GameConsumer.games[self.room_name].players[Connect4GameConsumer.games[self.room_name].winner - 1]
                player1_winner = await sync_to_async(UserProxy.objects.get)(username=player1_username_win)
                await self.send(text_data=json.dumps({
                    'type': 'game_over',
                    'message': 'Game finished',
                    'winner': player1_winner.username
                }))
                return
            if self.player_id in Connect4GameConsumer.games[self.room_name].players:
                return
            if len(Connect4GameConsumer.games[self.room_name].players) == 2:
                await self.send(text_data=json.dumps({
                    'type': 'game_full',
                    'message': 'Game is full'
                }))
                self.disconnect()
                return
            Connect4GameConsumer.games[self.room_name].players.append(self.player_id)
            logger.info(f"Player {self.player_id} joined room {self.room_name}")
            logger.info(f"Players: {Connect4GameConsumer.games[self.room_name].players}")
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
            if not Connect4GameConsumer.games[self.room_name].timer_started:
                Connect4GameConsumer.games[self.room_name].timer_started = True
                asyncio.create_task(self.start_timer()) # Start timer for the game
            return
        if message['type'] == 'move':
            Connect4GameConsumer.games[self.room_name].timer = 30
            if self.player_id != Connect4GameConsumer.games[self.room_name].players[Connect4GameConsumer.games[self.room_name].get_turn() - 1]:
                return
            column = message['column']
            if Connect4GameConsumer.games[self.room_name].make_move(column):
                if Connect4GameConsumer.games[self.room_name].get_winner():
                    Connect4GameConsumer.games[self.room_name].gameFinished = True
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'game_finished',
                            'message': 'Game finished',
                            'winner': Connect4GameConsumer.games[self.room_name].get_winner()
                        }
                    )
                else:
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'move',
                            'message': 'Move made',
                            'board': Connect4GameConsumer.games[self.room_name].get_board(),
                            'player_turn': Connect4GameConsumer.games[self.room_name].get_turn(),
                            'winner': Connect4GameConsumer.games[self.room_name].get_winner(),
                            'moves': Connect4GameConsumer.games[self.room_name].get_moves()
                        }
                    )
        
    async def game_start(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_start',
            'message': event['message'],
            'player1': event['player1'],
            'player2': event['player2'],
            'player_turn': event['player_turn']
        }))
    
    async def move(self, event):
        await self.send(text_data=json.dumps({
            'type': 'move',
            'message': event['message'],
            'board': event['board'],
            'player_turn': event['player_turn'],
            'winner': event['winner'],
            'moves': event['moves']
        }))

    async def game_full(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_full',
            'message': event['message']
        }))

    async def start_timer(self):
        while Connect4GameConsumer.games[self.room_name].gameFinished == False:
            await asyncio.sleep(1)
            if Connect4GameConsumer.games[self.room_name].timer == 0:
                Connect4GameConsumer.games[self.room_name].gameFinished = True
                Connect4GameConsumer.games[self.room_name].winner = 1 if Connect4GameConsumer.games[self.room_name].get_turn() == 2 else 2
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_finished',
                        'message': 'Game finished',
                        'winner': Connect4GameConsumer.games[self.room_name].get_winner()
                    }
                )
                return
            else:   
                Connect4GameConsumer.games[self.room_name].timer -= 1
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'timer',
                        'timer': Connect4GameConsumer.games[self.room_name].timer
                    }
                )

    async def timer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'update',
            'timer': event['timer'],
            'board' : Connect4GameConsumer.games[self.room_name].get_board(),
            'player_turn': Connect4GameConsumer.games[self.room_name].get_turn(),
            'player1': Connect4GameConsumer.games[self.room_name].players[0],
            'player2': Connect4GameConsumer.games[self.room_name].players[1],
        }))

    async def game_finished(self, event):
        player1_username = Connect4GameConsumer.games[self.room_name].players[0]
        player2_username = Connect4GameConsumer.games[self.room_name].players[1]
        logger.info(f"Player 1: {player1_username}, Player 2: {player2_username}")
        player1 = await sync_to_async(UserProxy.objects.get)(username=player1_username)
        player2 = await sync_to_async(UserProxy.objects.get)(username=player2_username)
        winner = None
        if event['winner'] == 1:
            winner = player1.username
            player1.elo += 10
            player2.elo -= 10
        else:
            winner = player2.username
            player1.elo -= 10
            player2.elo += 10
        await sync_to_async(player1.save)()
        await sync_to_async(player2.save)()
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'message': event['message'],
            'winner': winner
        }))