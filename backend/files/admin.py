from django.contrib import admin
from .models import File, FilePermission

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('original_name', 'uploaded_by', 'created_at', 'file_size', 'encrypted_name')
    search_fields = ('original_name', 'uploaded_by__username')
    readonly_fields = ('encrypted_name', 'created_at')

@admin.register(FilePermission)
class FilePermissionAdmin(admin.ModelAdmin):
    list_display = ('file', 'user', 'granted_at')
    search_fields = ('file__original_name', 'user__username')
