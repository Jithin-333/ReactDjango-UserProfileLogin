from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserUpdateSerializer
from django.shortcuts import get_object_or_404

# Create your views here.

User = get_user_model()

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user, context = {'request': request})
    data = serializer.data
    data['is_superuser'] = request.user.is_superuser
    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    if 'profile_image' not in request.FILES:
        return Response(
            {'error': 'No image provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = request.user
    
    # Delete existing image if it exists
    if user.profile_image:
        # Get the file path
        old_image_path = user.profile_image.path
        try:
            # Check if file exists before trying to delete
            import os
            if os.path.isfile(old_image_path):
                os.remove(old_image_path)
        except Exception as e:
            # Log the error but don't stop the upload process
            print(f"Error deleting old profile image: {str(e)}")
    
    # Save new image
    user.profile_image = request.FILES['profile_image']
    user.save()
    
    serializer = UserSerializer(user, context={'request': request})
    return Response(serializer.data)




# Admin functionality like edit used  delete user etc,, are below 
# ***************************************************************

#Get user using admin
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many = True, context = {'request' : request})
    return Response(serializer.data)

#pdate user using admin
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user(request, pk):
    try:
        user = User.objects.get(pk = pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserUpdateSerializer(user, data = request.data, partial = True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#delete user using admin
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk = pk)
    except User.DoesNotExist:
        return Response(status= status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response(status = status.HTTP_204_NO_CONTENT)
