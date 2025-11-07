import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, theme } = useApp();

  return (
    <div className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
      theme === 'dark' 
        ? 'bg-white/5 hover:bg-white/10' 
        : 'bg-white hover:shadow-xl'
    } border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-[#F97316] border-0">
            {product.badge}
          </Badge>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/90 backdrop-blur hover:bg-white h-10 w-10"
          >
            <Icon name="Heart" size={18} className="text-gray-900" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-bold text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {product.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Icon name="Star" size={16} className="fill-yellow-500 text-yellow-500" />
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {product.rating}
            </span>
          </div>
        </div>

        <Badge variant="outline" className={`mb-3 ${
          theme === 'dark' ? 'border-white/20 text-gray-300' : 'border-gray-300'
        }`}>
          {product.category}
        </Badge>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#9b87f5]">
                {product.price} ₽
              </span>
              {product.oldPrice && (
                <span className={`text-sm line-through ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {product.oldPrice} ₽
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={() => addToCart(product)}
            className="rounded-xl bg-gradient-to-r from-[#9b87f5] to-[#0EA5E9] hover:opacity-90"
          >
            <Icon name="ShoppingCart" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
