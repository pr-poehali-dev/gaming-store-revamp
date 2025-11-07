import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, User, Order, Notification, Product } from '@/types';
import { api } from '@/services/api';
import type { Product as ApiProduct, User as ApiUser, Order as ApiOrder, Notification as ApiNotification } from '@/services/api';

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product | ApiProduct) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  authenticateUser: (telegramId: number) => Promise<void>;
  orders: Order[];
  notifications: Notification[];
  markNotificationRead: (id: string | number) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  placeOrder: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    try {
      const data = await api.getUserData(Number(user.id));
      
      const mappedOrders: Order[] = data.orders.map((o: ApiOrder) => ({
        id: String(o.id),
        date: new Date(o.created_at).toISOString().split('T')[0],
        items: [],
        total: Number(o.total),
        status: o.status as 'completed' | 'pending' | 'cancelled'
      }));
      
      const mappedNotifications: Notification[] = data.notifications.map((n: ApiNotification) => ({
        id: String(n.id),
        title: n.title,
        message: n.message,
        time: new Date(n.created_at).toLocaleString('ru-RU'),
        read: n.is_read,
        type: n.type as 'success' | 'info' | 'warning'
      }));
      
      setOrders(mappedOrders);
      setNotifications(mappedNotifications);
      
      setUser(prev => prev ? { ...prev, balance: Number(data.user.balance), referrals: data.referrals_count } : null);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const addToCart = (product: Product | ApiProduct) => {
    setCart(prev => {
      const productId = String(product.id);
      const existing = prev.find(item => String(item.id) === productId);
      if (existing) {
        return prev.map(item =>
          String(item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      const cartItem: CartItem = 'image_url' in product ? {
        id: String(product.id),
        title: product.title,
        category: product.category,
        price: Number(product.price),
        oldPrice: product.old_price ? Number(product.old_price) : undefined,
        image: product.image_url,
        badge: product.badge || undefined,
        rating: Number(product.rating),
        inStock: product.in_stock,
        quantity: 1
      } : { ...product, quantity: 1 };
      
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart(prev => prev.filter(item => String(item.id) !== String(productId)));
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        String(item.id) === String(productId) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const authenticateUser = async (telegramId: number) => {
    setLoading(true);
    try {
      const userData = await api.authenticateUser({
        telegram_id: telegramId,
        username: `user_${telegramId}`,
        first_name: 'Игрок',
      });
      
      const mappedUser: User = {
        id: String(userData.id),
        name: userData.first_name || 'Игрок',
        username: userData.username || `@user_${telegramId}`,
        avatar: userData.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${telegramId}`,
        balance: Number(userData.balance),
        referralCode: userData.referral_code,
        referrals: 0
      };
      
      setUser(mappedUser);
    } catch (error) {
      console.error('Auth failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (id: string | number) => {
    setNotifications(prev =>
      prev.map(notif =>
        String(notif.id) === String(id) ? { ...notif, read: true } : notif
      )
    );
    
    try {
      await api.markNotificationRead(Number(id));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const placeOrder = async () => {
    if (!user || cart.length === 0) return;
    
    setLoading(true);
    try {
      const items = cart.map(item => ({
        product_id: Number(item.id),
        quantity: item.quantity,
        price: item.price
      }));
      
      await api.createOrder(Number(user.id), items);
      clearCart();
      await loadUserData();
    } catch (error: any) {
      console.error('Order failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        user,
        setUser,
        authenticateUser,
        orders,
        notifications,
        markNotificationRead,
        theme,
        toggleTheme,
        placeOrder,
        loading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};