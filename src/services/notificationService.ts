import type { Notification, NotificationPreferences } from '@/types/extended';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const notificationService = {
  async getNotifications(limit: number = 20, unreadOnly: boolean = false): Promise<Notification[]> {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(unreadOnly && { unreadOnly: 'true' }),
    });

    const response = await fetch(`${API_URL}/notifications?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  async markAsRead(notificationId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  },

  async markAllAsRead(): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },

  async getPreferences(): Promise<NotificationPreferences> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/preferences`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch preferences');
    }

    return response.json();
  },

  async updatePreferences(preferences: NotificationPreferences): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/preferences`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }
  },

  async getUnreadCount(): Promise<number> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    const data = await response.json();
    return data.count;
  },
};
