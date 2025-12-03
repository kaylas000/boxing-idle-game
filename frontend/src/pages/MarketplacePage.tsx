import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Filter, TrendingUp, Coins } from 'lucide-react';
import { marketplaceAPI } from '@/lib/api';

const rarityColors: Record<string, string> = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-yellow-600',
  mythic: 'from-red-500 to-pink-600',
};

export default function MarketplacePage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    type: '',
    rarity: '',
    minPrice: '',
    maxPrice: '',
    currency: 'BOX',
  });
  const [selectedListing, setSelectedListing] = useState<any>(null);

  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketplace-listings', filters],
    queryFn: () => marketplaceAPI.getListings(filters).then(res => res.data),
  });

  const buyMutation = useMutation({
    mutationFn: (listingId: string) => marketplaceAPI.buyListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-nfts'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setSelectedListing(null);
    },
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">🛒 NFT Маркетплейс</h1>
        <p className="text-gray-400">Покупайте и продавайте уникальные NFT за BOX токены</p>
      </motion.div>

      {/* Фильтры */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="font-bold">Фильтры</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="form-control"
          >
            <option value="">Все типы</option>
            <option value="boxer">Боксёры</option>
            <option value="equipment">Экипировка</option>
            <option value="gym">Залы</option>
            <option value="trainer">Тренеры</option>
            <option value="title_belt">Пояса</option>
          </select>

          <select
            value={filters.rarity}
            onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
            className="form-control"
          >
            <option value="">Все редкости</option>
            <option value="common">Обычные</option>
            <option value="rare">Редкие</option>
            <option value="epic">Эпические</option>
            <option value="legendary">Легендарные</option>
            <option value="mythic">Мифические</option>
          </select>

          <input
            type="number"
            placeholder="Мин. цена"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="form-control"
          />

          <input
            type="number"
            placeholder="Макс. цена"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="form-control"
          />

          <select
            value={filters.currency}
            onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
            className="form-control"
          >
            <option value="BOX">BOX Tokens</option>
            <option value="TON">TON</option>
          </select>
        </div>
      </div>

      {/* Листинги */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings?.listings?.map((listing: any, index: number) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`card border-2 ${rarityBorders[listing.nft.rarity]} cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => setSelectedListing(listing)}
          >
            {/* NFT Image */}
            <div className={`relative aspect-square bg-gradient-to-br ${rarityColors[listing.nft.rarity]} overflow-hidden`}>
              <img
                src={listing.nft.metadata.image}
                alt={listing.nft.metadata.name}
                className="w-full h-full object-cover"
              />
              
              <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColors[listing.nft.rarity]} text-white`}>
                {listing.nft.rarity.toUpperCase()}
              </div>
            </div>

            {/* Listing Info */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{listing.nft.metadata.name}</h3>
              
              {/* Seller */}
              <div className="text-sm text-gray-400 mb-3">
                Продавец: {listing.seller.username}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{listing.price}</span>
                  <span className="text-sm text-gray-400">{listing.currency}</span>
                </div>
                
                <button className="btn btn-primary btn-sm">
                  Купить
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Диалог покупки */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedListing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* NFT Preview */}
                <div>
                  <div className={`aspect-square bg-gradient-to-br ${rarityColors[selectedListing.nft.rarity]} rounded-xl overflow-hidden mb-4`}>
                    <img
                      src={selectedListing.nft.metadata.image}
                      alt={selectedListing.nft.metadata.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {selectedListing.nft.onChain && (
                    <a
                      href={`https://tonscan.org/nft/${selectedListing.nft.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Посмотреть в TON Explorer
                    </a>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">{selectedListing.nft.metadata.name}</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Продавец:</span>
                      <span className="font-bold">{selectedListing.seller.username}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Тип:</span>
                      <span className="font-bold">{selectedListing.nft.type}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Редкость:</span>
                      <span className={`font-bold bg-gradient-to-r ${rarityColors[selectedListing.nft.rarity]} bg-clip-text text-transparent`}>
                        {selectedListing.nft.rarity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-dark-700 p-4 rounded-lg mb-6">
                    <div className="text-sm text-gray-400 mb-1">Цена:</div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-8 h-8 text-yellow-500" />
                      <span className="text-3xl font-bold">{selectedListing.price}</span>
                      <span className="text-gray-400">{selectedListing.currency}</span>
                    </div>
                  </div>

                  {/* Buy button */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="btn btn-secondary"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => buyMutation.mutate(selectedListing.id)}
                      disabled={buyMutation.isPending}
                      className="btn btn-primary"
                    >
                      {buyMutation.isPending ? 'Покупка...' : 'Купить'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
