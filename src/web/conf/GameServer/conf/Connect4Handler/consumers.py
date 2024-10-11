from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import json
from .models import UserProxy 
from .serializer import UserProxySerializer
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs
from MatchMakingHandler.models import Game
import asyncio
from channels.layers import get_channel_layer

logger = logging.getLogger('print')
class Connect4Game:
    def __init__(self, game_id):
        self.game_id = game_id
        self.board = [[0 for _ in range(7)] for _ in range(6)]
        self.turn = 1
        self.winner = None
        self.moves = 0
        self.players = {
            1: None,
            2: None
        }
        self.timer_started = False
        self.timer = 30
        self.gameFinished = False
        self.lastMove = None
        self.isStarted = False

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
                self.lastMove = (i, column)
                return True
        return False

    def check_full(self):
        return self.moves == 42
    
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


class Connect4GameConsumer(AsyncWebsocketConsumer):
    games = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None

    async def connect(self):
        await self.accept()


    async def disconnect(self, close_code):
        logger.info(f"Disconnecting {close_code}")
        if close_code == 3845:
            return
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if self.room_name in Connect4GameConsumer.games:
            if self.player == Connect4GameConsumer.games[self.room_name].players[1]:
                Connect4GameConsumer.games[self.room_name].players[1] = None
            elif self.player == Connect4GameConsumer.games[self.room_name].players[2]:
                Connect4GameConsumer.games[self.room_name].players[2] = None
        if Connect4GameConsumer.games[self.room_name] and Connect4GameConsumer.games[self.room_name].players[1] == None and Connect4GameConsumer.games[self.room_name].players[2] == None:  
            Connect4GameConsumer.games.pop(self.room_name)

    async def receive(self, text_data):
        message = json.loads(text_data)
        logger.info(f"Message: {message}")
        if message['type'] == 'join':
            try:
                self.game = await (sync_to_async(Game.objects.get))(game_uuid=message['room'])
            except Game.DoesNotExist:
                await self.send(text_data=json.dumps({
                    'type': 'game_full',
                    'message': 'Game not found'
                }))
                return
            self.player = await sync_to_async(UserProxy.objects.get)(username=message['player_id'])
            player1 = await sync_to_async(UserProxy.objects.get)(id=self.game.player1_id)
            player2 = await sync_to_async(UserProxy.objects.get)(id=self.game.player2_id)
            player1Serializer = UserProxySerializer(player1).data
            player2Serializer = UserProxySerializer(player2).data
            self.room_name = message['room']
            self.room_group_name = 'connect4' + self.room_name
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            if self.game.isFinished:
                winner = await sync_to_async(UserProxy.objects.get)(id=self.game.winner_id)
                winnerSerializer = UserProxySerializer(winner).data

                await self.send(text_data=json.dumps({
                    'type': 'game_full',
                    'message': 'Game finished',
                    'winner': winnerSerializer['username'],
                    'player1': player1Serializer['username'],
                    'player2': player2Serializer['username'],
                }))
                return
            if self.room_name not in Connect4GameConsumer.games:
                Connect4GameConsumer.games[self.room_name] = Connect4Game(message['room'])
            if self.player.username != player1.username and self.player.username != player2.username:
                await self.send(text_data=json.dumps({
                    'type': 'game_full',
                    'message': 'You are not allowed'
                }))
                self.disconnect(1)
                return
            if Connect4GameConsumer.games[self.room_name].players[1] != None and \
                Connect4GameConsumer.games[self.room_name].players[2] != None:
                await self.send(text_data=json.dumps({
                    'type': 'game_full',
                    'message': 'Game is full'
                }))
                self.disconnect(1)
                return
            if Connect4GameConsumer.games[self.room_name].players[1] == None and self.player == player1:
                Connect4GameConsumer.games[self.room_name].players[1] = self.player
            elif Connect4GameConsumer.games[self.room_name].players[2] == None and self.player == player2:
                Connect4GameConsumer.games[self.room_name].players[2] = self.player
            if Connect4GameConsumer.games[self.room_name].players[1] != None and \
                Connect4GameConsumer.games[self.room_name].players[2] != None and \
                    not Connect4GameConsumer.games[self.room_name].isStarted:
                Connect4GameConsumer.games[self.room_name].isStarted = True
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_start',
                        'message': 'Game started',
                        'player1': Connect4GameConsumer.games[self.room_name].players[1],
                        'player2': Connect4GameConsumer.games[self.room_name].players[2],
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
            if self.player != Connect4GameConsumer.games[self.room_name].players[Connect4GameConsumer.games[self.room_name].get_turn()]:
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
                elif Connect4GameConsumer.games[self.room_name].check_full():
                    Connect4GameConsumer.games[self.room_name].gameFinished = True
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'game_finished',
                            'message': 'Game finished',
                            'winner': None
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
                            'moves': Connect4GameConsumer.games[self.room_name].get_moves(),
                            'lastMove': Connect4GameConsumer.games[self.room_name].lastMove
                        }
                    )

        
    async def game_start(self, event):
        player1Serializer = UserProxySerializer(event['player1']).data
        player2Serializer = UserProxySerializer(event['player2']).data
        await self.send(text_data=json.dumps({
            'type': 'game_start',
            'message': event['message'],
            'player1': player1Serializer,
            'player2': player2Serializer,
            'player_turn': event['player_turn']
        }))
    
    async def move(self, event):
        await self.send(text_data=json.dumps({
            'type': 'move',
            'message': event['message'],
            'board': event['board'],
            'player_turn': event['player_turn'],
            'winner': event['winner'],
            'moves': event['moves'],
            'lastMove': event['lastMove']
        }))

    async def game_full(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_full',
            'message': event['message']
        }))

    async def start_timer(self):
        while Connect4GameConsumer.games[self.room_name].gameFinished == False:
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
            await asyncio.sleep(1)

    async def timer(self, event):
        player1 = await sync_to_async(UserProxy.objects.get)(id=self.game.player1_id)
        player2 = await sync_to_async(UserProxy.objects.get)(id=self.game.player2_id)
        player1Serializer = UserProxySerializer(player1).data
        player2Serializer = UserProxySerializer(player2).data
        await self.send(text_data=json.dumps({
            'type': 'update',
            'timer': event['timer'],
            'board' : Connect4GameConsumer.games[self.room_name].get_board(),
            'lastMove': Connect4GameConsumer.games[self.room_name].lastMove,
            'player_turn': Connect4GameConsumer.games[self.room_name].get_turn(),
            'player1': player1Serializer,
            'player2': player2Serializer,
        }))

    async def game_finished(self, event):
        self.game.isFinished = True
        winner = None
        player1 = await sync_to_async(UserProxy.objects.get)(id=self.game.player1_id)
        player2 = await sync_to_async(UserProxy.objects.get)(id=self.game.player2_id)
        if event['winner'] == 1:
            self.game.winner_id = player1.id
            player1.elo += 10
            player2.elo -= 10
            winner = UserProxySerializer(player1).data
        elif event['winner'] == 2:
            self.game.winner_id = player2.id
            player1.elo -= 10
            player2.elo += 10
            winner = UserProxySerializer(player2).data
        await sync_to_async(self.game.save)()
        await sync_to_async(player1.save)()
        await sync_to_async(player2.save)()
        player1Serializer = UserProxySerializer(player1).data
        player2Serializer = UserProxySerializer(player2).data
        logger.info(f"winner {winner}")
        if winner == None:
            await self.send(text_data=json.dumps({
                'type': 'game_over',
                'option': 'draw',
                'winner': 'Draw',
                'board': Connect4GameConsumer.games[self.room_name].get_board(),
                'player1': player1Serializer,
                'player2': player2Serializer,
            }))
        else:
            await self.send(text_data=json.dumps({
                'type': 'game_over',
                'winner': winner['username'],
                'board': Connect4GameConsumer.games[self.room_name].get_board(),
                'player1': player1Serializer,
                'player2': player2Serializer,
            }))
        self.disconnect(0)