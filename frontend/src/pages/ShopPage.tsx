import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Zap, Crown, Package, CheckCircle } from 'lucide-react';
import { iapAPI } from '@/lib/api';

const productIcons: Record<string, any> = {
  starter_pack: Package,
  pro_pack: ShoppingCart,
  champion_pack: Crown,
  energy_refill: Zap,
  premium_month: Star,
};

const rarityColors: Record<string, string> = {
  common: 'border-gray-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
};

export default function ShopPage() {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: () => iapAPI.getProducts().then(res => res.data),
  });

  const purchaseMutation = useMutation({
    mutationFn: (productId: string) => iapAPI.createPayment(productId),
    onSuccess: (response) => {
      // В реальной версии здесь вызов Telegram Payment API
      // window.Telegram.WebApp.openInvoice(response.data.invoice);
      
      // Для демо сразу показываем успех
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setSelectedProduct(null);
        queryClient.invalidateQueries({ queryKey: ['player'] });
      }, 3000);
    },
  });

  const handlePurchase = (product: any) => {
    setSelectedProduct(product);
  };

  const confirmPurchase = () => {
    if (selectedProduct) {
      purchaseMutation.mutate(selectedProduct.id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">🛍️ Магазин</h1>
        <p className="text-gray-400">Улучшите свою игру с премиум пакетами!</p>
      </motion.div>

      {/* Успешная покупка */}
      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <div className="card text-center max-w-md">
              <CheckCircle className="w-24 h-24 mx-auto mb-4 text-green-500" />
              <h2 className="text-3xl font-bold mb-2 text-green-500">Успешно!</h2>
              <p className="text-gray-400">Ваша покупка обработана</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Диалог подтверждения */}
      <AnimatePresence>
        {selectedProduct && !purchaseSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">{selectedProduct.name}</h3>
              <p className="text-gray-400 mb-4">{selectedProduct.description}</p>
              
              <div className="bg-dark-700 p-4 rounded-lg mb-6">
                <div className="text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-3xl font-bold">{selectedProduct.price}</div>
                  <div className="text-sm text-gray-400">Telegram Stars</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmPurchase}
                  disabled={purchaseMutation.isPending}
                  className="btn btn-primary"
                >
                  {purchaseMutation.isPending ? 'Обработка...' : 'Купить'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Список товаров */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products?.map((product: any, index: number) => {
          const Icon = productIcons[product.id] || Package;
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card border-2 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
              onClick={() => handlePurchase(product)}
            >
              <div className="flex items-start gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                  <Icon className="w-12 h-12 text-blue-400" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                  
                  {/* Награды */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.rewards.money && (
                      <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-semibold">
                        💰 {product.rewards.money.toLocaleString()}
                      </div>
                    )}
                    {product.rewards.cards && (
                      <div className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm font-semibold">
                        🎴 {product.rewards.cards} карт
                      </div>
                    )}
                    {product.rewards.legendary && (
                      <div className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm font-semibold">
                        ⭐ {product.rewards.legendary} легенд.
                      </div>
                    )}
                    {product.rewards.energy && (
                      <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                        ⚡ {product.rewards.energy} энергии
                      </div>
                    )}
                    {product.rewards.premium && (
                      <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-semibold">
                        👑 {product.rewards.premium} дней
                      </div>
                    )}
                  </div>
                  
                  {/* Цена */}
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{product.price}</span>
                    <span className="text-sm text-gray-400">Stars</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Информация о Telegram Stars */}
      <div className="card bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-2 border-blue-500/50">
        <div className="flex items-start gap-4">
          <Star className="w-12 h-12 text-yellow-500" />
          <div>
            <h3 className="text-xl font-bold mb-2">Что такое Telegram Stars?</h3>
            <p className="text-gray-400 mb-3">
              Telegram Stars - это внутриигровая валюта Telegram, которую можно использовать 
              для покупок в Mini Apps. Звёзды можно купить напрямую в Telegram.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Безопасные платежи через Telegram
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Мгновенная доставка покупок
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Поддержка всех способов оплаты Telegram
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
