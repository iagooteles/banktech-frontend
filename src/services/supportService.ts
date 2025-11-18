import type { SupportTicket, SupportMessage, FAQItem } from '@/types/extended';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const supportService = {
  // Tickets
  async getTickets(): Promise<SupportTicket[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/support/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  },

  async getTicketById(ticketId: string): Promise<SupportTicket> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/support/tickets/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    return response.json();
  },

  async createTicket(data: {
    subject: string;
    category: string;
    message: string;
    priority?: string;
  }): Promise<SupportTicket> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/support/tickets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }

    return response.json();
  },

  async addMessage(ticketId: string, message: string): Promise<SupportMessage> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to add message');
    }

    return response.json();
  },

  async closeTicket(ticketId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/support/tickets/${ticketId}/close`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to close ticket');
    }
  },

  // FAQ
  async getFAQs(category?: string): Promise<FAQItem[]> {
    const token = localStorage.getItem('token');
    const params = category ? `?category=${category}` : '';
    
    const response = await fetch(`${API_URL}/support/faq${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch FAQs');
    }

    return response.json();
  },

  async markFAQHelpful(faqId: string, helpful: boolean): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/support/faq/${faqId}/feedback`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ helpful }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }
  },

  // Chat
  async sendChatMessage(message: string): Promise<{ response: string }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/support/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send chat message');
    }

    return response.json();
  },
};
