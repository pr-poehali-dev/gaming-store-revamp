import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useApp } from '@/contexts/AppContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CartSheet } from './CartSheet';
import { NotificationsPopover } from './NotificationsPopover';

export const Header = () => {
  const { cart, theme, toggleTheme, user, setUser } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = 2;

  const handleTelegramAuth = () => {
    setUser({
      id: '1',
      name: 'Игорь Петров',
      username: '@igorpetrov',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Igor',
      balance: 5420,
      referralCode: 'IGOR2024',
      referrals: 12
    });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl ${
      theme === 'dark' 
        ? 'bg-[#1A1F2C]/80 border-white/10' 
        : 'bg-white/80 border-gray-200'
    } border-b transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9b87f5] to-[#0EA5E9] flex items-center justify-center">
                <Icon name="Gamepad2" className="text-white" size={24} />
              </div>
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                GameStore
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Icon 
                name="Search" 
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                size={20}
              />
              <Input
                placeholder="Поиск игр..."
                className={`pl-10 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-400' 
                    : 'bg-gray-50 border-gray-200'
                } rounded-xl`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Icon name="Search" size={20} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl"
            >
              <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
            </Button>

            <NotificationsPopover count={unreadNotifications} />

            <CartSheet count={cartItemsCount} />

            {user ? (
              <Button variant="ghost" size="icon" className="rounded-xl">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-lg"
                />
              </Button>
            ) : (
              <Button
                onClick={handleTelegramAuth}
                className="gap-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
              >
                <Icon name="Send" size={18} />
                <span className="hidden md:inline">Войти</span>
              </Button>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 md:hidden animate-fade-in">
            <div className="relative">
              <Icon 
                name="Search" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Поиск игр..."
                className={`pl-10 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-gray-50 border-gray-200'
                } rounded-xl`}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
