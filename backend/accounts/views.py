from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema
from .serializers import (
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    UserDetailSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'data': UserDetailSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: UserDetailSerializer})
    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response({
            'success': True,
            'message': 'Current user profile fetched successfully',
            'data': serializer.data
        })

    @extend_schema(request=UserDetailSerializer, responses={200: UserDetailSerializer})
    def patch(self, request):
        serializer = UserDetailSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'data': serializer.data
        })
