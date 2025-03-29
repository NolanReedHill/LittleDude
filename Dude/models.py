from django.db import models
from django.contrib.auth.models import User
from django import forms

# Create your models here.
class LittleDude(models.Model):

    TYPES=(
        ("Biped", "Biped"),
        ("Quadraped", "Quadraped"),
        ("Ooze", "Ooze"),
    )

    PERSONALITIES=(
        ("Hater", "Hater"),
        ("Shy", "Shy"),
        ("Bubbly", "Bubbly"),
        ("Stoic", "Stoic"),
        ("Wise", "Wise"),
        ("Barbarian", "Barbarian"),
    )

    HUNGER=(
        ("None", "None"),
        ("Peckish", "Peckish"),
        ("Starving", "Starving")
    )

    name = models.CharField(max_length=30, default="")
    user = models.ForeignKey(User, default=1, on_delete=models.CASCADE)
    type = models.CharField(max_length=40, choices=TYPES, default="Biped")
    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    appearance = models.ImageField(default="")
    personality = models.CharField(max_length=40, choices=PERSONALITIES, default="Bubbly")
    hunger = models.CharField(max_length=40, choices=HUNGER, default="None")

class CreateLittleDudeForm(forms.ModelForm):

    class Meta:
        model = LittleDude
        fields = [
            "name",
            "type",
            "personality",
        ]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Name... (max 10 characters)",
                }
            ),
        }
        def __init__(self, *args, **kwargs):
            super(CreateLittleDudeForm, self).__init__(*args, **kwargs)
            self.fields["type"].strip = False
            self.fields["personality"].strip = False
            self.fields["hunger"].strip = False

        def save(self, commit=True):
            self.instance.status = "New"
            return super().save(commit)