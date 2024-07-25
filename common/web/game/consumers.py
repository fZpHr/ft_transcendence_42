from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
import random

room_counts = {}

class Connect4GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract room name from the URL route in your routing.py
        self.room_name = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = 'connect4_%s' % self.room_name

        if room_counts.get(self.room_group_name, 0) >= 2:
            return
        # # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        print("CONNECT called" + self.room_group_name)

        # Increment room count
        room_counts[self.room_group_name] = room_counts.get(self.room_group_name, 0) + 1

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        room_counts[self.room_group_name] = room_counts.get(self.room_group_name, 0) - 1


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print("RECEIVE called")
        print(text_data_json)
        print(self.room_group_name)
        print(self.room_name)
        if room_counts.get(self.room_group_name, 0) != 2:
            print("Error: You are alone!")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'error_message': "You are alone!"
            }))
            return
        if text_data_json['type'] == "join":
            print("JOIN called")
            roles = ['yellow', 'red']
            role = random.choice(roles)
            playerTurn = random.choice(roles)
            print("Role: ", role)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'role.giver',
                    'role': role,
                    'playerTurn': playerTurn,
                    'sender': self.channel_name
                }
            )
            return
        if text_data_json['type'] == "reset":
            print("RESET called")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'reset'
                }
            )
            return
        columnSelected = text_data_json['col']
        rowSelected = text_data_json['row']
        currentPlayer = text_data_json['player']
        nextPlayer = 'yellow' if currentPlayer == 'red' else 'red'

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game.move',
                'column': columnSelected,
                'row': rowSelected,
                'player': text_data_json['player'],
                'nextTurn': nextPlayer
            }
        )

    async def game_move(self, event):
    # Handle the game move event
        print("GAME MOVE called")
        column = event['column']
        row = event['row']
        
        # Process the game move here (e.g., update game state, check for win condition)

        # Then, send the updated game state or move confirmation back to the client
        await self.send(text_data=json.dumps({
            'type': 'game_update',  # Indicate the type of message being sent back
            'column': column,
            'row': row,
            'player': event['player'],
            'next_player': event['nextTurn']
            # Include any other relevant information (e.g., current player, game status)
        }))

    async def role_giver(self, event):
        print("Role giver called")
        if self.channel_name != event['sender']:
            await self.send(text_data=json.dumps({
                'type': "roleGiving",
                'role': event['role'],
                'playerTurn': event['playerTurn']
            }))
        else:
            opposite_role = 'red' if event['role'] == 'yellow' else 'yellow'
            await self.send(text_data=json.dumps({
                'type': "roleGiving",
                'role': opposite_role,
                'playerTurn': event['playerTurn']
            }))

    async def reset(self, event):
        print("RESET called")
        await self.send(text_data=json.dumps({
            'type': 'reset'
        }))