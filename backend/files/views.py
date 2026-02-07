import os
import uuid
from django.conf import settings
from django.db import models
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, FileResponse
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import File, FilePermission
from .serializers import FileSerializer, ShareFileSerializer
from .utils.encryption import encrypt_data, decrypt_data
from django.contrib.auth.models import User

# Ensure media directory exists
ENCRYPTED_FILES_DIR = os.path.join(settings.MEDIA_ROOT, 'encrypted_files')
os.makedirs(ENCRYPTED_FILES_DIR, exist_ok=True)

class FileUploadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Read and Encrypt
        try:
            file_data = file_obj.read()
            encrypted_data = encrypt_data(file_data)
        except Exception as e:
            return Response({"error": f"Encryption failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save to disk
        ext = os.path.splitext(file_obj.name)[1]
        encrypted_name = f"{uuid.uuid4()}{ext}.enc"
        file_path = os.path.join(ENCRYPTED_FILES_DIR, encrypted_name)

        with open(file_path, 'wb') as f:
            f.write(encrypted_data)

        # Save to DB
        new_file = File.objects.create(
            original_name=file_obj.name,
            encrypted_name=encrypted_name,
            uploaded_by=request.user,
            file_size=file_obj.size
        )

        serializer = FileSerializer(new_file)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FileListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FileSerializer

    def get_queryset(self):
        return File.objects.filter(uploaded_by=self.request.user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        # Filter out files that don't exist on disk
        valid_files = [
            f for f in queryset 
            if os.path.exists(os.path.join(ENCRYPTED_FILES_DIR, f.encrypted_name))
        ]
        serializer = self.get_serializer(valid_files, many=True)
        return Response(serializer.data)

class SharedFileListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FileSerializer

    def get_queryset(self):
        # Return files where permission exists for this user
        return File.objects.filter(permissions__user=self.request.user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        # Filter out files that don't exist on disk
        valid_files = [
            f for f in queryset 
            if os.path.exists(os.path.join(ENCRYPTED_FILES_DIR, f.encrypted_name))
        ]
        serializer = self.get_serializer(valid_files, many=True)
        return Response(serializer.data)

class FileShareView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ShareFileSerializer(data=request.data)
        if serializer.is_valid():
            file_id = serializer.validated_data['file_id']
            email = serializer.validated_data['email']

            file_obj = get_object_or_404(File, id=file_id, uploaded_by=request.user)
            try:
                user_to_share = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

            if user_to_share == request.user:
                 return Response({"error": "Cannot share with yourself"}, status=status.HTTP_400_BAD_REQUEST)

            # Create permission if not exists
            FilePermission.objects.get_or_create(file=file_obj, user=user_to_share)
            
            return Response({"message": f"File shared with {email}"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileDownloadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, file_id):
        file_obj = get_object_or_404(File, id=file_id)

        # Check permission: Owner or Shared
        has_access = (file_obj.uploaded_by == request.user) or \
                     (FilePermission.objects.filter(file=file_obj, user=request.user).exists())
        
        if not has_access:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        # Decrypt
        file_path = os.path.join(ENCRYPTED_FILES_DIR, file_obj.encrypted_name)
        if not os.path.exists(file_path):
            return Response({"error": "File not found on server"}, status=status.HTTP_404_NOT_FOUND)

        try:
            with open(file_path, 'rb') as f:
                encrypted_data = f.read()
            
            decrypted_data = decrypt_data(encrypted_data)
        except Exception as e:
            return Response({"error": "Decryption failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Serve file
        response = HttpResponse(decrypted_data, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_obj.original_name}"'
        return response
