import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';

export const CartSheet = ({ count }: { count: number }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, theme } = useApp();
  const [open, setOpen] = useState(false);
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Icon name="ShoppingCart" size={20} />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#F97316] border-0">
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent 
        className={`w-full sm:max-w-lg ${
          theme === 'dark' ? 'bg-[#1A1F2C] border-white/10' : 'bg-white'
        }`}
      >
        <SheetHeader>
          <SheetTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Корзина ({count})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className={`w-24 h-24 rounded-full ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
              } flex items-center justify-center mb-4`}>
                <Icon 
                  name="ShoppingCart" 
                  size={40} 
                  className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}
                />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Корзина пуста
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Добавьте игры из каталога
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4 pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                    } animate-fade-in`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#9b87f5]">
                          {item.price * item.quantity} ₽
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Icon name="Minus" size={14} />
                          </Button>
                          <span className={`w-8 text-center font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Итого:
                  </span>
                  <span className="text-2xl font-bold text-[#9b87f5]">
                    {total} ₽
                  </span>
                </div>
                <Button 
                  className="w-full rounded-xl bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9] hover:opacity-90 h-12"
                  onClick={() => setOpen(false)}
                >
                  Оформить заказ
                </Button>
                <Button
                  variant="ghost"
                  className="w-full rounded-xl"
                  onClick={clearCart}
                >
                  Очистить корзину
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
