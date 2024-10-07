from django.db import models

class UserProxy(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150)
    elo = models.IntegerField(default=1000)

    class Meta:
        managed = False  # No migrations will be created for this model
        db_table = 'Register42_user'  # The table name of the User model in the UserManagement project