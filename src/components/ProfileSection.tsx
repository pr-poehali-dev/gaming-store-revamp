import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useApp } from '@/contexts/AppContext';

export const ProfileSection = () => {
  const { user, orders, theme } = useApp();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className={`w-24 h-24 rounded-full ${
          theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
        } flex items-center justify-center mb-4`}>
          <Icon name="User" size={40} className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Войдите в аккаунт
        </h3>
        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Для доступа к профилю и истории заказов
        </p>
        <Button className="gap-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
          <Icon name="Send" size={18} />
          Войти через Telegram
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className={`${
        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      } rounded-2xl overflow-hidden`}>
        <div className="h-24 bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9]" />
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-12 mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl border-4 border-[#1A1F2C] bg-[#1A1F2C]"
            />
            <div className="flex-1">
              <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </h2>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {user.username}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#9b87f5]/20 flex items-center justify-center">
                  <Icon name="Wallet" className="text-[#9b87f5]" size={20} />
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Баланс
                  </p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user.balance} ₽
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/20 flex items-center justify-center">
                  <Icon name="Users" className="text-[#0EA5E9]" size={20} />
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Рефералов
                  </p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user.referrals}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F97316]/20 flex items-center justify-center">
                  <Icon name="Package" className="text-[#F97316]" size={20} />
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Заказов
                  </p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {orders.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gradient-to-r from-[#9b87f5]/10 to-[#0EA5E9]/10' : 'bg-purple-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Реферальный код
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 rounded-lg"
              >
                <Icon name="Copy" size={16} />
                Копировать
              </Button>
            </div>
            <code className="text-lg font-mono font-bold text-[#9b87f5]">
              {user.referralCode}
            </code>
          </div>
        </CardContent>
      </Card>

      <Card className={`${
        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      } rounded-2xl`}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            История заказов
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
              } transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Заказ #{order.id}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <Badge className={
                  order.status === 'completed' 
                    ? 'bg-green-500/20 text-green-500 border-0'
                    : order.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-500 border-0'
                    : 'bg-red-500/20 text-red-500 border-0'
                }>
                  {order.status === 'completed' ? 'Выполнен' : 
                   order.status === 'pending' ? 'В обработке' : 'Отменён'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#9b87f5]">
                  {order.total} ₽
                </span>
                <Button variant="ghost" size="sm" className="gap-2 rounded-lg">
                  Подробнее
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
