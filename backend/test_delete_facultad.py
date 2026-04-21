from django.test import TestCase, Client
from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel
from django.contrib.auth import get_user_model

class FacultadDeleteTest(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username='test_admin', password='123')
        self.facultad = FacultadModel.objects.create(id=99, nombre="Test Facultad", activa=True)
        self.client = Client()
        self.client.force_login(self.user)

    def test_delete_facultad(self):
        response = self.client.delete(f'/api/facultades/{self.facultad.id}/')
        with open('out_test_del.txt', 'w') as f:
            f.write(str(response.status_code) + "\n")
            f.write(str(response.content.decode('utf-8')) + "\n")
