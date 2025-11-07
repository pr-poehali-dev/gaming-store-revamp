import { useEffect, useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ProductCard } from '@/components/ProductCard';
import { ProfileSection } from '@/components/ProfileSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { api } from '@/services/api';
import type { Product as ApiProduct } from '@/services/api';
import { Toaster } from '@/components/ui/sonner';

const categories = [
  { id: 'all', label: 'Все игры', icon: 'Grid' },
  { id: 'rpg', label: 'RPG', icon: 'Swords' },
  { id: 'action', label: 'Экшен', icon: 'Zap' },
  { id: 'sport', label: 'Спорт', icon: 'Trophy' },
  { id: 'shooter', label: 'Шутеры', icon: 'Target' },
];

function AppContent() {
  const { theme } = useApp();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = theme === 'dark' 
      ? 'bg-[#0F1117] text-white' 
      : 'bg-gray-50 text-gray-900';
  }, [theme]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className="pt-16 lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12 animate-fade-in">
            <div className={`relative rounded-3xl overflow-hidden p-8 md:p-12 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-[#9b87f5]/20 to-[#0EA5E9]/20' 
                : 'bg-gradient-to-br from-purple-100 to-blue-100'
            } border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="relative z-10 max-w-2xl">
                <Badge className="mb-4 bg-[#F97316] border-0">
                  🔥 Новинка
                </Badge>
                <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Лучшие игры
                  <br />
                  по низким ценам
                </h1>
                <p className={`text-lg mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Скидки до 70% на хиты этого сезона
                </p>
                <Button 
                  size="lg" 
                  className="gap-2 rounded-xl bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9] hover:opacity-90 h-12 px-8"
                >
                  Смотреть каталог
                  <Icon name="ArrowRight" size={20} />
                </Button>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 bg-gradient-to-l from-[#9b87f5] to-transparent" />
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant="outline"
                  className={`gap-2 rounded-xl flex-shrink-0 ${
                    cat.id === 'all'
                      ? 'bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9] border-0 text-white'
                      : theme === 'dark'
                      ? 'border-white/10 hover:bg-white/5'
                      : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon name={cat.icon as any} size={18} />
                  {cat.label}
                </Button>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Популярные игры
              </h2>
              <Button variant="ghost" className="gap-2 rounded-xl">
                Все игры
                <Icon name="ArrowRight" size={18} />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Загрузка товаров...
                  </p>
                </div>
              ) : (
                products.slice(0, 12).map((product, index) => (
                  <div 
                    key={product.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-fade-in"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Профиль
            </h2>
            <ProfileSection />
          </section>
        </div>
      </main>

      <Toaster theme={theme} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;