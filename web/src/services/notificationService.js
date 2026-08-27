import api from './api';

export const notificationService = {
  /**
   * Fetch current user's notifications.
   * @param {Object} params - e.g. { unread_only: true, page: 1 }
   */
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications/', { params });
    return response.data;
  },

  /**
   * Get count of unread notifications for current user.
   */
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread_count/');
    return response.data;
  },

  /**
   * Mark a single notification as read by ID.
   * @param {number|string} id
   */
  markAsRead: async (id) => {
    const response = await api.post(`/notifications/${id}/mark_read/`);
    return response.data;
  },

  /**
   * Mark all notifications of current user as read.
   */
  markAllAsRead: async () => {
    const response = await api.post('/notifications/mark_all_read/');
    return response.data;
  },

  /**
   * Delete a notification by ID.
   * @param {number|string} id
   */
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}/delete/`);
    return response.data;
  },
};
