from django.db import models
from django.contrib.auth.models import User

class File(models.Model):
    original_name = models.CharField(max_length=255)
    encrypted_name = models.CharField(max_length=255) # Name of file on disk
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    created_at = models.DateTimeField(auto_now_add=True)
    file_size = models.BigIntegerField(default=0)

    def __str__(self):
        return f"{self.original_name} (by {self.uploaded_by.username})"

class FilePermission(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='permissions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_files')
    granted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('file', 'user')

    def __str__(self):
        return f"{self.file.original_name} -> {self.user.username}"
