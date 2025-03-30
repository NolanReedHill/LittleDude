from django.urls import path

from . import views

app_name = 'Dude'
urlpatterns = [
    path('', views.DrawingView.as_view(), name='drawing'),
    path('habitat', views.HabitatView.as_view(), name='habitat'),
]