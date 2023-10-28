from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Paciente

@csrf_exempt
def guardar_paciente(request):
    if request.method == 'POST':
        data = request.POST
        paciente = Paciente(
            Ndehistoriaclinica=data.get('Ndehistoriaclinica'),
            nombre=data.get('nombre'),
            apellido=data.get('apellido'),
            genero=data.get('genero'),
            Fechadenacimiento=data.get('Fechadenacimiento'),
            Enfermedad=data.get('Enfermedad'),
            otrasenfermedades=data.get('otrasenfermedades'),
            tratamiento=data.get('tratamiento'),
            genotipos=data.get('genotipos'),
            alelo1=data.get('alelo1'),
            alelo2=data.get('alelo2')
        )
        paciente.save()
        return JsonResponse({'message': 'Paciente guardado con éxito'})
    return JsonResponse({'message': 'Método no permitido'}, status=405)
