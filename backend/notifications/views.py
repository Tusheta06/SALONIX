from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.GenericViewSet):
    """
    Notification endpoints — all scoped strictly to request.user.
    Users can never access another user's notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Always and only the current authenticated user's notifications
        return Notification.objects.filter(user=self.request.user)

    # GET /api/notifications/
    def list(self, request):
        qs = self.get_queryset()
        # Optional filter: ?unread_only=true
        if request.query_params.get('unread_only') == 'true':
            qs = qs.filter(is_read=False)
        # Paginate using the standard pagination from settings
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response({'success': True, 'data': serializer.data})

    # GET /api/notifications/unread_count/
    @action(detail=False, methods=['get'], url_path='unread_count')
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'success': True, 'count': count})

    # POST /api/notifications/{id}/mark_read/
    @action(detail=True, methods=['post'], url_path='mark_read')
    def mark_read(self, request, pk=None):
        notification = self.get_queryset().filter(pk=pk).first()
        if not notification:
            return Response(
                {'success': False, 'message': 'Notification not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        if not notification.is_read:
            notification.is_read = True
            notification.save(update_fields=['is_read', 'updated_at'])
        return Response({
            'success': True,
            'message': 'Notification marked as read.',
            'data': self.get_serializer(notification).data
        })

    # POST /api/notifications/mark_all_read/
    @action(detail=False, methods=['post'], url_path='mark_all_read')
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({
            'success': True,
            'message': f'{updated} notification(s) marked as read.',
            'count': updated
        })

    # DELETE /api/notifications/{id}/
    @action(detail=True, methods=['delete'], url_path='delete')
    def delete_notification(self, request, pk=None):
        notification = self.get_queryset().filter(pk=pk).first()
        if not notification:
            return Response(
                {'success': False, 'message': 'Notification not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        notification.delete()
        return Response({'success': True, 'message': 'Notification deleted.'})
