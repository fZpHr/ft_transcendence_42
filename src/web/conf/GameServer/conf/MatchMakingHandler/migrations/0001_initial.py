# Generated by Django 5.1.2 on 2024-10-14 18:48

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Connect4Handler', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('game_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('isFinished', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player1', to='Connect4Handler.userproxy')),
                ('player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player2', to='Connect4Handler.userproxy')),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Connect4Handler.userproxy')),
            ],
        ),
    ]
