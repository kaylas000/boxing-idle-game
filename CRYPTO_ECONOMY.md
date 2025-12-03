# 🪙 Boxing Champion - NFT & Token Economy

> **Play-to-Earn экономика на TON Blockchain**

[![TON](https://img.shields.io/badge/Blockchain-TON-blue)](https://ton.org)
[![BOX Token](https://img.shields.io/badge/Token-BOX-yellow)]()
[![NFT](https://img.shields.io/badge/NFT-TEP--62-purple)]()

---

## 🎯 Обзор экономики

Boxing Champion - это **полноценная Play-to-Earn игра** с собственной токеновой экономикой и NFT экосистемой на TON blockchain.

### Ключевые компоненты:

1. **BOX Token** - утилитарный токен для всех транзакций
2. **Game NFTs** - уникальные активы с игровыми бонусами
3. **Marketplace** - P2P торговля NFT за токены
4. **Staking** - пассивный доход до 50% APY
5. **TON Integration** - вывод на реальный blockchain

---

## 🪙 BOX Token

### Технические характеристики

```yaml
Name: Boxing Champion Token
Symbol: BOX
Standard: TON Jetton (TEP-74)
Decimals: 9
Total Supply: 100,000,000 BOX
Blockchain: TON (The Open Network)
Contract: contracts/BOXToken.fc
```

### Распределение токенов

```
┌────────────────────────────────────────┐
│   Total Supply: 100,000,000 BOX      │
├────────────────────────────────────────┤
│ 40% (40M) - Play-to-Earn Rewards    │
│ 20% (20M) - Staking Rewards         │
│ 15% (15M) - Team & Development      │
│ 15% (15M) - Liquidity & Exchanges   │
│ 10% (10M) - Marketing & Partnerships│
└────────────────────────────────────────┘
```

### Emission Schedule

**Play-to-Earn Rewards (40M BOX):**
- Year 1: 15M BOX (40,000 BOX/day)
- Year 2: 12M BOX (32,000 BOX/day)
- Year 3: 8M BOX (22,000 BOX/day)
- Year 4: 5M BOX (13,700 BOX/day)

**Принцип:** Постепенное снижение эмиссии для поддержания ценности токена.

---

## 🎮 Как зарабатывать BOX токены

### 1. Победы в боях

```typescript
// Награды за победу
const rewards = {
  victory: 5-15 BOX,          // Базовая награда
  knockout: +5 BOX,           // Бонус за нокаут
  winStreak3: x1.5,           // Серия 3 побед
  winStreak5: x2.0,           // Серия 5 побед
  pvpWin: 20-50 BOX,          // PvP победа
  tournamentWin: 100-1000 BOX // Турнирный приз
};
```

**Пример расчёта:**
```
Базовая награда: 10 BOX
Нокаут: +5 BOX
Win Streak (x2): 30 BOX
NFT бонус (+50%): 45 BOX
──────────────────────────
Итого: 45 BOX за 1 бой
```

### 2. Ежедневные награды

```
Day 1:  10 BOX
Day 3:  30 BOX
Day 7:  100 BOX
Day 14: 250 BOX
Day 30: 500 BOX + Legendary NFT
```

### 3. Достижения

```typescript
const achievementRewards = {
  firstWin: 50 BOX,
  win100Fights: 500 BOX,
  win1000Fights: 5000 BOX,
  reachLevel50: 1000 BOX,
  knockout100: 2000 BOX,
  winTournament: 3000 BOX,
  collectAllNFTs: 10000 BOX
};
```

### 4. Staking

```yaml
30 Days Lock:
  APY: 15%
  Min: 100 BOX
  Rewards: Ежедневные

90 Days Lock:
  APY: 30%
  Min: 500 BOX
  Rewards: Ежедневные

180 Days Lock:
  APY: 50%
  Min: 1000 BOX
  Rewards: Ежедневные
```

**Пример:** Stake 1000 BOX на 180 дней
```
APY: 50%
Ежедневный доход: 1.37 BOX/день
Итого за 180 дней: 246 BOX
Финальный баланс: 1246 BOX (+24.6%)
```

### 5. Продажа NFT

- Продавайте NFT на маркетплейсе
- Комиссия: 5%
- Получайте BOX токены или TON

---

## 🇼️ Game NFTs

### Типы NFT

#### 1. **Boxer NFT** 🥊
Уникальные боксёры с уникальными характеристиками

```typescript
interface BoxerNFT {
  type: 'boxer';
  attributes: {
    powerBonus: 10-100;      // +Сила
    speedBonus: 10-100;      // +Скорость
    staminaBonus: 10-100;    // +Выносливость
    defenseBonus: 10-100;    // +Защита
    specialAbility: string;  // Уникальная способность
  };
}
```

**Примеры:**
- 👊 **Iron Mike** (Legendary) - +80 Power, +50 Speed
- ⚡ **Speed Demon** (Epic) - +30 Power, +90 Speed
- 🛡️ **The Tank** (Rare) - +60 Defense, +70 Stamina

#### 2. **Equipment NFT** 🥊
Экипировка: перчатки, шорты, обувь

```typescript
interface EquipmentNFT {
  type: 'equipment';
  slot: 'gloves' | 'shorts' | 'shoes';
  attributes: {
    powerBonus: 5-50;
    speedBonus: 5-50;
    specialEffect: string;
  };
}
```

**Примеры:**
- 🥊 **Golden Gloves** (Legendary) - +50 Power, Крит урон x2
- 👟 **Lightning Shoes** (Epic) - +40 Speed, Уворот +20%

#### 3. **Gym NFT** 🏋️
Залы для тренировок

```typescript
interface GymNFT {
  type: 'gym';
  attributes: {
    expMultiplier: 1.1-2.0;   // Множитель опыта
    trainingCostReduction: 0.1-0.5; // Скидка на тренировки
  };
}
```

**Примеры:**
- 🏋️ **Elite Training Center** (Legendary) - x2.0 EXP, -50% cost
- 🥋 **Street Gym** (Common) - x1.1 EXP

#### 4. **Trainer NFT** 🧑‍🏫
Тренеры с бонусами

```typescript
interface TrainerNFT {
  type: 'trainer';
  attributes: {
    moneyMultiplier: 1.1-2.0;  // Множитель денег
    specialBonus: string;      // Специальный бонус
  };
}
```

**Примеры:**
- 🧑‍🏫 **Master Trainer** (Legendary) - x2.0 Money, +Стамина после боя
- 🎯 **Coach Mike** (Rare) - x1.3 Money

#### 5. **Title Belt NFT** 🏆
Пояса чемпиона

```typescript
interface TitleBeltNFT {
  type: 'title_belt';
  attributes: {
    prestigeBonus: 100-1000;   // +Слава
    allStatsBonus: 20-100;     // +Ко всем статам
    specialAbility: string;
  };
}
```

**Примеры:**
- 🏆 **World Champion Belt** (Mythic) - +100 ко всем, +1000 славы
- 🥇 **Regional Belt** (Epic) - +50 ко всем

---

### Редкость NFT

```yaml
Common (50% дропа):
  Stats: +5-15
  Market Price: 50-200 BOX
  Цвет: Серый

Rare (30% дропа):
  Stats: +15-35
  Market Price: 200-1000 BOX
  Цвет: Синий

Epic (15% дропа):
  Stats: +35-60
  Market Price: 1000-5000 BOX
  Цвет: Фиолетовый

Legendary (4% дропа):
  Stats: +60-90
  Market Price: 5000-25000 BOX
  Цвет: Золотой

Mythic (1% дропа):
  Stats: +90-150
  Market Price: 25000-100000 BOX
  Цвет: Красный
```

---

## 🛒 NFT Marketplace

### Как работает

1. **Создание листинга:**
   ```typescript
   // Игрок выставляет NFT на продажу
   POST /api/marketplace/listings
   {
     nftId: "uuid",
     price: 1000,      // BOX токены
     currency: "BOX"   // или "TON"
   }
   ```

2. **Покупка:**
   ```typescript
   // Покупатель покупает NFT
   POST /api/marketplace/listings/:id/buy
   
   // Автоматически:
   // 1. Списание BOX с покупателя
   // 2. Перенос NFT новому владельцу
   // 3. Начисление BOX продавцу (минус 5% комиссии)
   ```

3. **Комиссии:**
   ```
   Продажная цена: 1000 BOX
   Комиссия (5%): 50 BOX
   Продавец получает: 950 BOX
   ```

### Фильтры и поиск

- По типу (boxer, equipment, gym...)
- По редкости (common, rare, epic...)
- По цене (min/max)
- По валюте (BOX / TON)
- По статам (+Power, +Speed...)

---

## ⛓️ TON Blockchain Интеграция

### Архитектура

```
┌───────────────────┐
│   Game Backend    │
│  (NestJS + PG)   │
└───────┬───────────┘
       │
       │ Off-chain → On-chain
       │
┌──────┴───────────┐
│  TON Blockchain   │
├──────────────────┤
│ BOXToken.fc      │ ← Jetton (TEP-74)
│ NFTCollection.fc │ ← NFT (TEP-62)
└──────────────────┘
```

### Hybrid подход (Off-chain + On-chain)

**Off-chain (в игре):**
- Быстрые тразакции
- Нет gas fees
- Мгновенные начисления
- Масштабируемость

**On-chain (по желанию):**
- Полное владение NFT
- Торговля на внешних DEX
- Проверяемость
- Невозможность отмены

### Выпуск NFT on-chain

```typescript
// 1. Игрок нажимает "Publish to Blockchain"
POST /api/nft/:id/publish

// 2. Backend вызывает TON smart contract
const tx = await nftContract.mint({
  owner: playerWallet,
  metadata: nft.metadata,
  tokenId: nft.tokenId
});

// 3. NFT теперь в TON blockchain!
// Можно продать на Getgems, Fragment и др.
```

### Вывод BOX токенов

```typescript
// Игрок выводит токены на внешний кошелёк
POST /api/wallet/withdraw
{
  toAddress: "EQD...",  // TON wallet
  amount: 1000,         // BOX tokens
}

// Условия:
// - Минимум: 100 BOX
// - Комиссия: 5%
// - Время обработки: 1-5 мин
```

---

## 🔒 Staking System

### Пулы стейкинга

#### Pool 1: Flexible (30 days)
```yaml
Lock Period: 30 days
APY: 15%
Min Stake: 100 BOX
Max Stake: Unlimited
Rewards: Daily
Early Unstake: -10% penalty
```

#### Pool 2: Standard (90 days)
```yaml
Lock Period: 90 days
APY: 30%
Min Stake: 500 BOX
Max Stake: Unlimited
Rewards: Daily
Early Unstake: -15% penalty
```

#### Pool 3: Premium (180 days)
```yaml
Lock Period: 180 days
APY: 50%
Min Stake: 1000 BOX
Max Stake: Unlimited
Rewards: Daily
Early Unstake: -20% penalty
```

### Расчёт наград

```javascript
// Формула APY
const dailyReward = (stakedAmount * APY) / 365;

// Пример: 1000 BOX на 180 дней с 50% APY
const stakedAmount = 1000;
const APY = 0.50;  // 50%
const days = 180;

const dailyReward = (1000 * 0.50) / 365 = 1.37 BOX/day
const totalReward = 1.37 * 180 = 246 BOX
const finalAmount = 1000 + 246 = 1246 BOX
```

### Преимущества staking

1. **Пассивный доход** - ежедневные начисления
2. **Дефляционный эффект** - блокировка токенов уменьшает supply
3. **Высокий APY** - до 50% годовых
4. **Гибкость** - разные пулы на выбор

---

## 📊 Экономические метрики

### Token Metrics

```yaml
Цена BOX:
  Launch: $0.01
  Target 3 months: $0.05
  Target 6 months: $0.10
  Target 1 year: $0.25

Market Cap:
  Launch: $1M
  Target 1 year: $25M

Circulating Supply:
  Month 1: 5M BOX (5%)
  Month 6: 20M BOX (20%)
  Year 1: 40M BOX (40%)
  Year 4: 100M BOX (100%)
```

### NFT Metrics

```yaml
Total NFTs Minted:
  Month 1: 10,000
  Month 6: 100,000
  Year 1: 500,000

Marketplace Volume:
  Monthly: 50,000-200,000 BOX
  
Средняя цена NFT:
  Common: 100 BOX ($5)
  Rare: 500 BOX ($25)
  Epic: 2,500 BOX ($125)
  Legendary: 15,000 BOX ($750)
  Mythic: 50,000 BOX ($2,500)
```

---

## 🔄 Экономические петли (Loops)

### Loop 1: Play-to-Earn Core

```
Игра в бои 
   ↓
Получение BOX токенов
   ↓
Покупка/Upgrade NFT
   ↓
Улучшение характеристик
   ↓
Больше побед в боях
   ↓
Больше BOX токенов
   ↓
(Цикл замкнулся)
```

### Loop 2: NFT Trading

```
Получение NFT (дроп)
   ↓
Продажа на Marketplace
   ↓
Получение BOX токенов
   ↓
Покупка более редких NFT
   ↓
Продажа по высокой цене
   ↓
(Цикл замкнулся)
```

### Loop 3: Staking

```
Nakопление BOX tokens
   ↓
Stake токены (50% APY)
   ↓
Пассивный доход
   ↓
Unstake с наградами
   ↓
Больше BOX для stake
   ↓
(Цикл замкнулся)
```

---

## 🛡️ Anti-Inflation Механизмы

### Token Burning

```yaml
Marketplace Fee (5%):
  50% сожжено 🔥
  50% в трежури

NFT Upgrade Cost:
  20% сожжено 🔥
  80% в трежури

Premium Features:
  100% сожжено 🔥
```

**Пример расчёта:**
```
Ежедневная эмиссия: 40,000 BOX
Ежедневное сожжение:
  - Marketplace: ~2,000 BOX
  - Upgrades: ~3,000 BOX
  - Premium: ~1,000 BOX
  Total: 6,000 BOX

Чистая эмиссия: 34,000 BOX/day
Инфляция: <5% (здоровая)
```

### Staking Lock-up

- 30-50% всех BOX токенов заблокировано в staking
- Уменьшает circulating supply
- Повышает ценность токена

---

## 🚀 Roadmap

### Phase 1: Launch (Q1 2025)
- ✅ Backend API (готово)
- ✅ Frontend (готово)
- ✅ NFT система (готово)
- ✅ Marketplace (готово)
- ✅ BOX Token contract (готово)
- 🔄 TON integration (в разработке)

### Phase 2: Growth (Q2 2025)
- 🔄 Staking pools
- 🔄 Daily rewards
- 🔄 Referral system
- 🔄 Tournaments expansion

### Phase 3: Expansion (Q3 2025)
- ⭕ DEX listing (DeDust, STON.fi)
- ⭕ CEX listing
- ⭕ Guilds/Clans
- ⭕ Seasonal events

### Phase 4: Ecosystem (Q4 2025)
- ⭕ NFT lending
- ⭕ DAO governance
- ⭕ Cross-game NFT utility
- ⭕ Mobile app

---

## 💻 Техническая реализация

### Smart Contracts

#### BOXToken.fc (FunC)
```func
;; Jetton Token (TEP-74)
;; Total Supply: 100M BOX
;; Decimals: 9

() mint_tokens(slice to_address, int amount, int query_id) impure {
  var (total_supply, owner, jetton_content, jetton_wallet_code) = load_data();
  total_supply += amount;
  save_data(total_supply, owner, jetton_content, jetton_wallet_code);
  
  ;; Send to jetton wallet...
}
```

#### NFTCollection.fc (FunC)
```func
;; NFT Collection (TEP-62)
;; Boxing Champion NFTs

() mint_nft(slice to_address, cell nft_content, int query_id) impure {
  var (next_item_index, collection_content, owner, nft_item_code) = load_data();
  
  ;; Deploy NFT item...
  next_item_index += 1;
  save_data(next_item_index, collection_content, owner, nft_item_code);
}
```

### Backend API

```typescript
// Blockchain Module
@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}

// NFT Module
@Module({
  imports: [TypeOrmModule.forFeature([NFT, NFTMetadata])],
  providers: [NftService],
})
export class NftModule {}

// Marketplace Module
@Module({
  imports: [TypeOrmModule.forFeature([Listing, Trade])],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
```

### Frontend Integration

```typescript
// TON Connect SDK
import { TonConnectUI } from '@tonconnect/ui-react';

const tonConnect = new TonConnectUI({
  manifestUrl: 'https://app.boxingchampion.io/tonconnect-manifest.json'
});

// Connect wallet
await tonConnect.connectWallet();

// Send BOX tokens
const tx = await tonConnect.sendTransaction({
  validUntil: Date.now() + 5 * 60 * 1000,
  messages: [
    {
      address: recipientAddress,
      amount: '1000000000', // 1 BOX (9 decimals)
    }
  ]
});
```

---

## 📊 Business Model

### Revenue Streams

```yaml
1. Marketplace Commission (5%):
   Monthly: $10,000-50,000
   
2. Premium Subscriptions:
   Price: $9.99/month
   Target: 5,000 users
   Monthly: $50,000
   
3. In-App Purchases (Telegram Stars):
   Monthly: $20,000-100,000
   
4. Tournament Entry Fees:
   Monthly: $5,000-20,000

5. NFT Minting Fees:
   Monthly: $10,000-30,000

Total Projected Revenue:
  Month 1: $20,000
  Month 6: $100,000
  Year 1: $250,000/month
```

### Token Utility

BOX токен используется для:
1. Покупки NFT
2. Улучшения характеристик
3. Вход в турниры
4. Staking (пассивный доход)
5. Governance (голосование в DAO)
6. Премиум функции

---

## ❓ FAQ

**Q: Как получить BOX токены?**
A: Играйте в бои, побеждайте в турнирах, выполняйте достижения, или продавайте NFT.

**Q: Можно ли продать BOX за реальные деньги?**
A: Да! Выведите BOX на TON blockchain и продайте на DEX (DeDust, STON.fi).

**Q: Как получить NFT?**
A: NFT дропаются за достижения, победы в турнирах, или можно купить на Marketplace.

**Q: Что такое staking?**
A: Заблокируйте BOX токены на 30-180 дней и получайте до 50% годовых.

**Q: Как вывести токены?**
A: Минимум 100 BOX, комиссия 5%, время обработки 1-5 минут.

**Q: Безопасно ли это?**
A: Да! TON blockchain - децентрализованный, а смарт-контракты проверены.

---

## 🔗 Полезные ссылки

- **TON Documentation**: https://ton.org/docs
- **TON Jetton Standard**: https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
- **TON NFT Standard**: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
- **TON Connect SDK**: https://github.com/ton-connect
- **DeDust DEX**: https://dedust.io
- **STON.fi DEX**: https://ston.fi
- **Getgems NFT Marketplace**: https://getgems.io

---

## 🛠️ Запуск проекта

### Установка

```bash
# Backend
cd backend
npm install

# Запустить PostgreSQL и Redis
docker-compose up -d postgres redis

# Миграции БД (включая NFT и blockchain таблицы)
npm run migration:run

# Запустить backend
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

### Настройка TON

```bash
# Установить TON SDK
npm install @ton/ton @ton/crypto ton-contract-executor

# Компиляция smart contracts
cd contracts
func -o BOXToken.fif BOXToken.fc
func -o NFTCollection.fif NFTCollection.fc

# Deploy на testnet
node scripts/deploy.js --testnet
```

---

**🚀 Boxing Champion - Первая полноценная P2E игра на TON!**
