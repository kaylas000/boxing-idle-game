import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Image, Zap, ExternalLink, ShoppingBag, Lock } from 'lucide-react';
import { nftAPI } from '@/lib/api';
import { useState } from 'react';

const rarityColors: Record<string, string> = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-yellow-600',
  mythic: 'from-red-500 to-pink-600',
};

const rarityBorders: Record<string, string> = {
  common: 'border-gray-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
  mythic: 'border-red-500',
};

export default function NFTGalleryPage() {
  const queryClient = useQueryClient();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);

  const { data: nfts, isLoading } = useQuery({
    queryKey: ['my-nfts'],
    queryFn: () => nftAPI.getMyNFTs().then(res => res.data),
  });

  const { data: bonuses } = useQuery({
    queryKey: ['nft-bonuses'],
    queryFn: () => nftAPI.getBonuses().then(res => res.data),
  });

  const equipMutation = useMutation({
    mutationFn: (nftId: string) => nftAPI.toggleEquip(nftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-nfts'] });
      queryClient.invalidateQueries({ queryKey: ['nft-bonuses'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (nftId: string) => nftAPI.publishToBlockchain(nftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-nfts'] });
    },
  });

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
        <h1 className="text-3xl font-bold mb-2">🖼️ NFT Галерея</h1>
        <p className="text-gray-400">Коллекция уникальных NFT с бонусами к характеристикам</p>
      </motion.div>

      {/* Активные бонусы от экипированных NFT */}
      {bonuses && (
        <div className="card bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-blue-500">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Активные бонусы от NFT
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bonuses.power > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">+{bonuses.power}</div>
                <div className="text-sm text-gray-400">💪 Сила</div>
              </div>
            )}
            {bonuses.speed > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">+{bonuses.speed}</div>
                <div className="text-sm text-gray-400">⚡ Скорость</div>
              </div>
            )}
            {bonuses.stamina > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">+{bonuses.stamina}</div>
                <div className="text-sm text-gray-400">❤️ Выносливость</div>
              </div>
            )}
            {bonuses.defense > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">+{bonuses.defense}</div>
                <div className="text-sm text-gray-400">🛡️ Защита</div>
              </div>
            )}
            {bonuses.moneyMultiplier > 1 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">x{bonuses.moneyMultiplier.toFixed(2)}</div>
                <div className="text-sm text-gray-400">💰 Деньги</div>
              </div>
            )}
            {bonuses.expMultiplier > 1 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">x{bonuses.expMultiplier.toFixed(2)}</div>
                <div className="text-sm text-gray-400">⭐ Опыт</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NFT коллекция */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts?.map((nft: any, index: number) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`card border-2 ${rarityBorders[nft.rarity]} cursor-pointer overflow-hidden group`}
            onClick={() => setSelectedNFT(nft)}
          >
            {/* NFT Image */}
            <div className="relative aspect-square bg-gradient-to-br ${rarityColors[nft.rarity]} overflow-hidden">
              <img
                src={nft.metadata.image}
                alt={nft.metadata.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Rarity badge */}
              <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColors[nft.rarity]} text-white`}>
                {nft.rarity.toUpperCase()}
              </div>

              {/* Equipped badge */}
              {nft.equipped && (
                <div className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                  ✓ ЭКИПИРОВАН
                </div>
              )}

              {/* On-chain badge */}
              {nft.onChain && (
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-blue-500/90 text-white text-xs font-bold">
                  ⛓️ ON-CHAIN
                </div>
              )}
            </div>

            {/* NFT Info */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{nft.metadata.name}</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{nft.metadata.description}</p>

              {/* Attributes */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                {nft.metadata.attributes.powerBonus > 0 && (
                  <div className="bg-dark-700 px-2 py-1 rounded">💪 +{nft.metadata.attributes.powerBonus}</div>
                )}
                {nft.metadata.attributes.speedBonus > 0 && (
                  <div className="bg-dark-700 px-2 py-1 rounded">⚡ +{nft.metadata.attributes.speedBonus}</div>
                )}
                {nft.metadata.attributes.staminaBonus > 0 && (
                  <div className="bg-dark-700 px-2 py-1 rounded">❤️ +{nft.metadata.attributes.staminaBonus}</div>
                )}
                {nft.metadata.attributes.defenseBonus > 0 && (
                  <div className="bg-dark-700 px-2 py-1 rounded">🛡️ +{nft.metadata.attributes.defenseBonus}</div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    equipMutation.mutate(nft.id);
                  }}
                  className={`btn ${nft.equipped ? 'btn-secondary' : 'btn-primary'} btn-sm flex-1`}
                >
                  {nft.equipped ? 'Снять' : 'Экипировать'}
                </button>
                
                {!nft.onChain && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      publishMutation.mutate(nft.id);
                    }}
                    disabled={publishMutation.isPending}
                    className="btn btn-outline btn-sm"
                    title="Выпустить в TON blockchain"
                  >
                    ⛓️
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Пустая коллекция */}
      {nfts?.length === 0 && (
        <div className="card text-center py-12">
          <Image className="w-24 h-24 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-bold mb-2">У вас пока нет NFT</h3>
          <p className="text-gray-400 mb-6">Зарабатывайте NFT за достижения или покупайте на маркетплейсе</p>
          <button className="btn btn-primary">
            🛒 Перейти на маркетплейс
          </button>
        </div>
      )}
    </div>
  );
}
