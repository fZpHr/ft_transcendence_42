from django.db import models
import uuid

# Create your models here.
class Game(models.Model):
    game_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player1 = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)