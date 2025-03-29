from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse, reverse_lazy
from .models import LittleDude, CreateLittleDudeForm

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
    
    littleDude = LittleDude.objects.filter(user_id=user.id)
    if not littleDude:
        return HttpResponseRedirect(reverse("creation"))
    return render(request, "habitat.html", {"littleDude": littleDude.first()})

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
    

    
    
