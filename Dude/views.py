from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from django.utils import timezone


# Create your views here.
class DrawingView(generic.TemplateView):
    template_name = 'Dude/drawing.html'


class HabitatView(generic.TemplateView):
    template_name = 'Dude/habitat.html'