from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse, reverse_lazy
from .models import LittleDude, CreateLittleDudeForm, User
from google import genai
from google.genai import types
from dotenv import load_dotenv
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import os
from datetime import datetime
from django.views import generic
import serial
import time

load_dotenv()

#landing page
def index(request):
    user = request.user
    if user.is_authenticated:
        return HttpResponseRedirect(reverse("home"))
    else:
        return render(request, "index.html")

def main_page(request):
    user = request.user

    if user.is_authenticated:
        littleDude = LittleDude.objects.filter(user_id=user.id).first()
        timeDifference = 0
        if not littleDude == None:
            lastVisit = littleDude.lastVisit
            lastVisit = lastVisit.replace(tzinfo=None)
            curTime = datetime.now()
            timeDifference = curTime - lastVisit
            timeDifference = timeDifference.days
        #need to update hunger here ################
        return render(request, "home.html", {"user": user, "littleDude": littleDude, "timeDifference": timeDifference})
    else:
         return HttpResponseRedirect(
                reverse("index"))

def habitat(request):
    user = request.user

    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))

    littleDude = LittleDude.objects.filter(user_id=user.id).first()

    if not littleDude:
        return HttpResponseRedirect(reverse("creation"))

    if littleDude.onWalk == True:
        return HttpResponseRedirect(reverse("on-walk"))
    currentTime = datetime.now()
    lastFeeding = littleDude.lastFeeding
    lastFeeding = lastFeeding.replace(tzinfo=None)
    timeDifference = currentTime - lastFeeding
    timeDifference = timeDifference.total_seconds()
    if timeDifference >= 86400 and timeDifference < 259200:
        littleDude.hunger = "Peckish"
        littleDude.save()
    elif timeDifference > 259200 and timeDifference < 604800:
        littleDude.hunger = "Starving"
        littleDude.save()
    elif timeDifference > 604800:
        littleDude.hunger = "Dead"
        littleDude.save()
    littleDude.lastVisit = currentTime
    littleDude.save()
    #add death functionality
    if littleDude.hunger == "Dead":
        return HttpResponseRedirect(reverse("death"))

    return render(request, "habitat.html", {"littleDude": littleDude,})

def is_biped(user):
    print("help")
    return LittleDude.objects.filter(user_id=user.id).first().type == "Biped"

def is_quadraped(user):
    return LittleDude.objects.filter(user_id=user.id).first().type == "Quadraped"

def is_ooze(user):
    return LittleDude.objects.filter(user_id=user.id).first().type == "Ooze"


def death(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    littleDude = LittleDude.objects.filter(user_id=user.id).first()
    if not littleDude.hunger == "Dead":
        return HttpResponseRedirect(reverse("index"))
    deadName = littleDude.name
    littleDude.delete()
    return render(request, "death.html", {"deadName": deadName})

def creation(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))

    if request.method == "POST":
        form = CreateLittleDudeForm(request.POST)
        if form.is_valid():
            littleDude = form.save(commit=False)
            littleDude.user = user
            littleDude.save()
            return HttpResponseRedirect(reverse("habitat"))
        else: return HttpResponseRedirect(reverse("index"))

    else:
        form = CreateLittleDudeForm()
        return render(request, "creation.html", {"form": form,})

@csrf_exempt
def submitQuery(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    littleDude = LittleDude.objects.filter(user_id=user.id).first()
    if not littleDude:
        return HttpResponseRedirect(reverse("home"))
    if request.method == "POST":
        data = json.loads(request.body)
        prompt = data.get("prompt", "")
        systemInstruction = generateQueryParameters(request)
        #getting chat history
        chatHistory = littleDude.chatHistory
        chatHistory+= "\n"+user.username+" said: "+prompt
        #creating chat client
        client = genai.Client(api_key=os.environ.get("GENAI_SECRET"))
        chat = client.chats.create( model="gemini-2.0-flash", config=types.GenerateContentConfig(
        system_instruction=systemInstruction),)
        response = chat.send_message(chatHistory)
        chatHistory+= "\n"+"You said: "+response.text
        littleDude.chatHistory = chatHistory
        littleDude.save()
        return JsonResponse(response.text, safe=False)

def generateQueryParameters(request):
    requestUser = request.user
    user = User.objects.filter(id=requestUser.id).first()
    littleDude = LittleDude.objects.filter(user_id=user.id).first()

    parameters = "You are a Little Dude. Little Dudes are small creatures that are kept as pets by humans."
    parameters += " Your name is "+littleDude.name+". Your owner's name is "+user.username+". You are currently speaking to your owner. Your creature type is "+littleDude.type+"."
    if littleDude.personality == "Hater":
        parameters += "Your personality type is hater. You are a generally negative little dude who just loves to bring others down."+"You find joy in making snarky remarks and little barbs."
    elif littleDude.personality == "Shy":
        parameters+= "Your personality type is shy. You are a bashful little dude who is uncomfortable with too much attention. It's hard "+" for you to come out of your shell and open up."
    elif littleDude.personality == "Bubbly":
        parameters+= "Your personality type is bubbly. You are a very cheerful little dude that is always trying to make others smile and laugh."+" You always see the bright side and love talking to others."
    elif littleDude.personality == "Stoic":
        parameters+= "Your personality type is stoic. You are quiet, but assertive. You always have a pragmatic outlook on life. You enjoy"+" peace and quiet but aren't afraid to speak your mind."
    elif littleDude.personality == "Wise":
        parameters+= "Your personality type is wise. You think of yourself as very smart, and are sometimes full of yourself. "+"Despite your large ego, you really are intelligent and add a lot to the conversation."
    elif littleDude.personality == "Barbarian":
        parameters+= "Your personality type is barbarian. You are an agent of chaos that is completely unpredicatble. You are competitive"+" and bold, and maybe a little dim-witted. You never back down from a fight."

    if littleDude.hunger == "Peckish":
        parameters+= "You are a little hungry. You might mention it."
    elif littleDude.hunger == "Starving":
        parameters+= "You are very hungry. Make sure to mention it."
    else:
        parameters+= "You are not hungry. You were fed recently."
    
    lastVisit = littleDude.lastVisit
    lastVisit = lastVisit.replace(tzinfo=None)
    curTime = datetime.now()
    timeDifference = curTime - lastVisit
    timeDifference = timeDifference.days
    if timeDifference > 0:
        parameters+= "It's been "+timeDifference+" days since "+user.username+" last visited."
    return parameters

def retire(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))

    littleDude = LittleDude.objects.filter(user_id=user.id)
    littleDude.delete()
    return HttpResponseRedirect(reverse("habitat"))

def walk(request):
    user = request.user

    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    littleDude = LittleDude.objects.filter(user_id=user.id).first()
    return render(request, "walk.html", {"littleDude": littleDude})

def sendData(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    try:
        ser = serial.Serial('COM3', 9600, timeout=1)
    except serial.SerialException:
        # send some kind of error message
        return HttpResponseRedirect(reverse("habitat"))
    time.sleep(2)
    littleDude = LittleDude.objects.filter(user_id=user.id).first()
    data = {"name": littleDude.name}

    json_string = json.dumps(data)
    ser.write(((json_string + "\n").encode()))
    
    littleDude.onWalk = True
    littleDude.save()
    return HttpResponseRedirect(reverse("habitat"))

def onWalk(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    littleDude = LittleDude.objects.filter(user_id=user.id).first()
    return render(request, "onWalk.html", {"littleDude": littleDude})

def callBack(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    
    try:
        ser = serial.Serial('COM3', 9600, timeout=1)
    except serial.SerialException:
        # send some kind of error message
        return HttpResponseRedirect(reverse("habitat"))
    time.sleep(5)
    line = ser.readline().decode('utf-8').strip()

    if not line:
        print("failed")
        return HttpResponseRedirect(reverse("habitat"))

    data = json.loads(line)
    steps = data
    littleDude = LittleDude.objects.filter(user_id=user.id).first()
    littleDude.onWalk = False
    littleDude.save()
    return levelUp(request, steps)

def levelUp(request, steps):
    user = request.user
    littleDude = LittleDude.objects.filter(user_id=user.id).first()
    newXp = steps * 2
    curXp = littleDude.xp
    curXp+= newXp
    nextLevel = littleDude.xpToNextLevel
    numLevelUps = 0
    while curXp >= nextLevel:
        curXp -= nextLevel
        numLevelUps+=1
        nextLevel*= 2
    littleDude.xp = curXp
    littleDude.level += numLevelUps
    littleDude.xpToNextLevel = nextLevel
    littleDude.save()
    return HttpResponseRedirect(reverse("habitat"))

# Create your views here.
def draw(request):
    # redirect to habitat
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    return render(request, "drawing.html")


def physics(request):
    return render(request, "physics.html")

def feed(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    
    littleDude = LittleDude.objects.filter(user_id=user.id).first()
    if not littleDude.hunger == "Dead":
        littleDude.hunger = "None"
        littleDude.lastFeeding = datetime.now()
        littleDude.save()
    return HttpResponse(200)

