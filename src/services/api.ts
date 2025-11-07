const API_BASE_URL = 'https://functions.poehali.dev/99950dab-59a8-407c-bb7b-daa00dfb001e';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  old_price: number | null;
  image_url: string;
  badge: string | null;
  rating: number;
  in_stock: boolean;
}

export interface User {
  id: number;
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  balance: number;
  referral_code: string;
  referred_by_id: number | null;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
  items_count: number;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const api = {
  async getProducts(category?: string): Promise<Product[]> {
    const url = category 
      ? `${API_BASE_URL}?action=products&category=${category}`
      : `${API_BASE_URL}?action=products`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.products;
  },

  async authenticateUser(telegramData: {
    telegram_id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    photo_url?: string;
    referral_code?: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}?action=auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramData),
    });
    const data = await response.json();
    return data.user;
  },

  async getUserData(userId: number): Promise<{
    user: User;
    referrals_count: number;
    orders: Order[];
    notifications: Notification[];
  }> {
    const response = await fetch(`${API_BASE_URL}?action=user`, {
      headers: {
        'X-User-Id': userId.toString(),
      },
    });
    return await response.json();
  },

  async createOrder(userId: number, items: Array<{ product_id: number; quantity: number; price: number }>): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}?action=order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId.toString(),
      },
      body: JSON.stringify({ items }),
    });
    const data = await response.json();
    if (response.status !== 201) {
      throw new Error(data.error || 'Failed to create order');
    }
    return data.order;
  },

  async markNotificationRead(notificationId: number): Promise<void> {
    await fetch(`${API_BASE_URL}?action=notification`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notification_id: notificationId }),
    });
  },
};
