from django.db import models
import uuid
from Connect4Handler.models import UserProxy

# Create your models here.
class Game(models.Model):
    game_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player1 = models.ForeignKey(UserProxy, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(UserProxy, on_delete=models.CASCADE, related_name='player2')
    winner = models.ForeignKey(UserProxy, on_delete=models.CASCADE, null=True)
    isFinished = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
