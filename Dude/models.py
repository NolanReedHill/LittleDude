from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class LittleDude(models.Model):

    TYPES=(
        ("Biped", "Biped"),
        ("Quadraped", "Quadraped"),
        ("Ooze", "Ooze"),
    )

    name = models.CharField(max_length=30, default="")
    user = models.ForeignKey(User, default=1, on_delete=models.CASCADE)
    type = models.CharField(max_length=40, choices=TYPES, default="Biped")
    level = models.IntegerField(default=1)
    appearance = models.ImageField()

