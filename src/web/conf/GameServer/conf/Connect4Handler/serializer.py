from rest_framework import serializers
from .models import UserProxy

class UserProxySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProxy
        fields = ['id', 'username', 'elo']