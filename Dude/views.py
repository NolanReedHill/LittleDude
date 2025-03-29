from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse, reverse_lazy
from .models import LittleDude

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
        return render(request, "home.html")
    else:
         return HttpResponseRedirect(
                reverse("index"))
    
def habitat(request):
    user = request.user

    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    
    little_dude = LittleDude.objects.filter(user_id=user.id)
    if not little_dude:
        return HttpResponseRedirect(reverse("creation"))
    
    return render(request, "habitat.html", {"little_dude": little_dude})

def creation(request):
    user = request.user

    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    
    return render(request, "creation.html")