from channels.generic.websocket import AsyncWebsocketConsumer

class Connect4GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Called when the websocket is handshaking as part of the connection process
        # Accept the connection
        await self.accept()
        # Add the user to the group
        await self.channel_layer.group_add(
            'connect4',
            self.channel_name
        )

    async def disconnect(self, close_code):
        # Called when the websocket closes for any reason
        # Leave the group
        await self.channel_layer.group_discard(
            'connect4',
            self.channel_name
        )

    async def receive(self, text_data):
        # Called when a message is received from the websocket
        # Send the message to the group
        await self.channel_layer.group_send(
            'connect4',
            {
                'type': 'game_message',
                'message': text_data
            }
        )
