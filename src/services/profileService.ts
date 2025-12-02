import type { UserProfile, DeviceSession, AuditLog, SecuritySettings, TransactionLimits } from '@/types/extended';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },

  async uploadAvatar(file: File): Promise<string> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_URL}/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    const data = await response.json();
    return data.avatarUrl;
  },

  async getSessions(): Promise<DeviceSession[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile/sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return response.json();
  },

  async revokeSession(sessionId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to revoke session');
    }
  },

  async getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile/audit-logs?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audit logs');
    }

    return response.json();
  },

  async getSecuritySettings(): Promise<SecuritySettings> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile/security-settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch security settings');
    }

    return response.json();
  },

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile/security-settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to update security settings');
    }
  },

  async getTransactionLimits(): Promise<TransactionLimits> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile/transaction-limits`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transaction limits');
    }

    return response.json();
  },

  async updateTransactionLimits(limits: Partial<TransactionLimits>): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile/transaction-limits`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(limits),
    });

    if (!response.ok) {
      throw new Error('Failed to update transaction limits');
    }
  },
};
