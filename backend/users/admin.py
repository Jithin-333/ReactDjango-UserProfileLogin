from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'created_at')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'created_at')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('profile_image', 'phone_number', 'address')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'profile_image', 'phone_number', 'address'),
        }),
    )

admin.site.register(User, CustomUserAdmin)
