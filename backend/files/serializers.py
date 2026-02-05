from rest_framework import serializers
from .models import File, FilePermission
from django.contrib.auth.models import User

class FileSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField()
    
    class Meta:
        model = File
        fields = ('id', 'original_name', 'uploaded_by', 'created_at', 'file_size')

class FilePermissionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = FilePermission
        fields = ('id', 'file', 'user', 'user_email', 'granted_at')

class ShareFileSerializer(serializers.Serializer):
    file_id = serializers.IntegerField()
    email = serializers.EmailField()
