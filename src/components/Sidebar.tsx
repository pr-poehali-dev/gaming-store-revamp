import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { useApp } from '@/contexts/AppContext';

const menuItems = [
  { icon: 'Home', label: 'Главная', id: 'home' },
  { icon: 'Grid', label: 'Каталог', id: 'catalog' },
  { icon: 'ShoppingCart', label: 'Корзина', id: 'cart' },
  { icon: 'User', label: 'Профиль', id: 'profile' },
  { icon: 'Wallet', label: 'Баланс', id: 'balance' },
  { icon: 'Users', label: 'Рефералы', id: 'referrals' },
  { icon: 'Package', label: 'Заказы', id: 'orders' },
  { icon: 'HeadphonesIcon', label: 'Поддержка', id: 'support' },
];

export const Sidebar = () => {
  const { theme } = useApp();
  const [activeItem, setActiveItem] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <nav className="space-y-2 p-4">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={activeItem === item.id ? 'default' : 'ghost'}
          className={`w-full justify-start gap-3 rounded-xl transition-all ${
            activeItem === item.id
              ? 'bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9] text-white'
              : theme === 'dark' 
                ? 'text-gray-300 hover:bg-white/5' 
                : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => {
            setActiveItem(item.id);
            setMobileOpen(false);
          }}
        >
          <Icon name={item.icon as any} size={20} />
          <span>{item.label}</span>
        </Button>
      ))}
    </nav>
  );

  return (
    <>
      <aside className={`hidden lg:block fixed left-0 top-16 bottom-0 w-64 ${
        theme === 'dark' 
          ? 'bg-[#1A1F2C]/80 border-white/10' 
          : 'bg-white/80 border-gray-200'
      } border-r backdrop-blur-xl z-40`}>
        <SidebarContent />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-4 left-4 lg:hidden z-50 rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9]"
          >
            <Icon name="Menu" className="text-white" size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className={theme === 'dark' ? 'bg-[#1A1F2C] border-white/10' : 'bg-white'}
        >
          <div className="mt-8">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
