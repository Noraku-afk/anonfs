from django.urls import path
from .views import (
    FileUploadView, 
    FileListView, 
    SharedFileListView, 
    FileShareView, 
    FileDownloadView
)

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('my-files/', FileListView.as_view(), name='my-files'),
    path('shared-files/', SharedFileListView.as_view(), name='shared-files'),
    path('share-file/', FileShareView.as_view(), name='share-file'),
    path('download/<int:file_id>/', FileDownloadView.as_view(), name='file-download'),
]
