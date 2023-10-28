from django.urls import path
from . import views

urlpatterns = [
    # Otras rutas de tu aplicación
    path('api/pacientes/', views.guardar_paciente, name='guardar_paciente'),
]
