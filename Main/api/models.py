from django.db import models

class Paciente(models.Model):
    Ndehistoriaclinica = models.CharField(max_length=50)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    genero = models.CharField(max_length=10)
    Fechadenacimiento = models.DateField()
    Enfermedad = models.CharField(max_length=100)
    otrasenfermedades = models.TextField()
    tratamiento = models.CharField(max_length=100)
    genotipos = models.CharField(max_length=100)
    alelo1 = models.CharField(max_length=10)
    alelo2 = models.CharField(max_length=10)

    def __str__(self):
        return self.nombre
