from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('profile/', views.get_user_profile, name='user-profile'),
    path('profile/update/', views.update_user_profile, name='update-profile'),
    path('profile/upload-image/', views.upload_profile_image, name='upload-profile-image'),

    #admin urls
    path('admin_user/', views.get_all_users, name = 'all-users'),
    path('admin_user/<int:pk>/update/', views.update_user, name='update-user'),
    path('admin_user/<int:pk>/delete/', views.delete_user, name='delete-user'),
   
]
