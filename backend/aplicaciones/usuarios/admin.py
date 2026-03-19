# aplicaciones/usuarios/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .modelos import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display  = ['email', 'first_name', 'last_name', 'rol', 'is_active']
    list_filter   = ['rol', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    ordering      = ['email']

    fieldsets = UserAdmin.fieldsets + (
        ('OTIUM', {'fields': ('rol',)}),
    )
