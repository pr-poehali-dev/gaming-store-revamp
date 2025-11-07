import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { useApp } from '@/contexts/AppContext';

export const NotificationsPopover = ({ count }: { count: number }) => {
  const { notifications, markNotificationRead, theme } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertCircle';
      default: return 'Info';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Icon name="Bell" size={20} />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#F97316] border-0">
              {count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`w-80 p-0 ${
          theme === 'dark' ? 'bg-[#1A1F2C] border-white/10' : 'bg-white'
        }`}
        align="end"
      >
        <div className="p-4 border-b">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Уведомления
          </h3>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {notifications.map((notif) => (
              <button
                key={notif.id}
                className={`w-full text-left p-3 rounded-xl mb-2 transition-all hover:scale-[1.02] ${
                  notif.read 
                    ? theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                    : theme === 'dark' ? 'bg-[#9b87f5]/10' : 'bg-purple-50'
                }`}
                onClick={() => markNotificationRead(notif.id)}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'success' ? 'bg-green-500/10 text-green-500' :
                    notif.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    <Icon name={getIcon(notif.type) as any} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-[#9b87f5] flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className={`text-sm mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
