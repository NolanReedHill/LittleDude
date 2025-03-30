from django.urls import path, include
from django.views.generic import TemplateView
from django.urls import path

from . import views
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static

app_name = 'Dude'
urlpatterns = [
    path("", views.index, name="index"),
    path("home", views.main_page, name="home"),
    path("habitat", views.habitat, name="habitat"),
    path("creation", views.creation, name="creation"),
    path("submit-query", views.submitQuery, name="submit-query"),
    path("retire", views.retire, name="retire"),
    path("walk", views.walk, name="walk"),
]