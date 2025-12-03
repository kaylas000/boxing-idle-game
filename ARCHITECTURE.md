# 🏗️ Boxing Champion - System Architecture

> **Полное описание архитектуры production-ready Web3 игры**

---

## 🎯 High-Level Architecture

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                  TELEGRAM MINI APP                          ┃
┃  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ┃
┃  ┃        React Frontend (TypeScript)          ┃  ┃
┃  ┃  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    ┃  ┃
┃  ┃  ┃  - Pages (13 routes)        ┃    ┃  ┃
┃  ┃  ┃  - Components (UI)          ┃    ┃  ┃
┃  ┃  ┃  - Phaser.js (Fight Scene)  ┃    ┃  ┃
┃  ┃  ┃  - Zustand (State)          ┃    ┃  ┃
┃  ┃  ┃  - TanStack Query (Data)    ┃    ┃  ┃
┃  ┃  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    ┃  ┃
┃  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                      │
                      │ HTTPS / WSS / TON Connect
                      │
      ┏━━━━━━━━━━━━━━━┴━━━━━━━━━━━━━━━┓
      ┃                                    ┃
      ┃      NestJS Backend API         ┃
      ┃                                    ┃
      ┃  ┏━━━━━━━━━━━━━━━━━━━━━━━━┓  ┃
      ┃  ┃  12 Modules:           ┃  ┃
      ┃  ┃  - Auth                ┃  ┃
      ┃  ┃  - Player              ┃  ┃
      ┃  ┃  - Training            ┃  ┃
      ┃  ┃  - Fight               ┃  ┃
      ┃  ┃  - PvP (WebSocket)     ┃  ┃
      ┃  ┃  - Tournament          ┃  ┃
      ┃  ┃  - Achievement         ┃  ┃
      ┃  ┃  - IAP                 ┃  ┃
      ┃  ┃  - TON Integration     ┃  ┃
      ┃  ┃  - NFT                 ┃  ┃
      ┃  ┃  - Token (Staking)     ┃  ┃
      ┃  ┃  - Marketplace         ┃  ┃
      ┃  ┗━━━━━━━━━━━━━━━━━━━━━━━━┛  ┃
      ┗━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━━━━┛
                   │
         ┏━━━━━━━━━┴━━━━━━━━━┓
         │                    │
  ┏━━━━━━▼━━━━━━┓      ┏━━━━━▼━━━━━┓
  ┃  PostgreSQL  ┃      ┃   Redis   ┃
  ┃  (TypeORM)   ┃      ┃  (Cache)  ┃
  ┗━━━━━━━━━━━━━┛      ┗━━━━━━━━━━━┛
         │
  ┏━━━━━━▼━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃     TON Blockchain SDK          ┃
  ┃  (@ton/ton + @ton/crypto)       ┃
  ┗━━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━━┛
                   │
         ┏━━━━━━━━━┴━━━━━━━━━┓
         │                    │
         │  TON Blockchain     │
         │                    │
  ┏━━━━━━▼━━━━━━┓      ┏━━━━━▼━━━━━━┓
  ┃  BOXToken.fc ┃      ┃ NFTColl.fc  ┃
  ┃  (Jetton)    ┃      ┃ (TEP-62)    ┃
  ┗━━━━━━━━━━━━━┛      ┗━━━━━━━━━━━━━┛
```

---

## 📦 Backend Modules

### 1. Auth Module

**Назначение:** Авторизация через Telegram WebApp

```typescript
// Структура
auth/
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts       # JWT валидация
│   └── telegram.strategy.ts  # Telegram WebApp валидация
├── guards/
│   └── jwt-auth.guard.ts
└── decorators/
    └── current-user.decorator.ts

// Flow
Telegram initData 
    → Validate signature 
    → Create/find player 
    → Generate JWT 
    → Return token
```

**Ключевые функции:**
- Telegram WebApp data validation
- JWT token generation & refresh
- Session management
- User creation on first login

---

### 2. Player Module

**Назначение:** Управление игроками и профилями

```typescript
// Entity Structure
Player {
  id: UUID
  telegramId: bigint (unique)
  username: string
  tonWalletAddress: string (unique)
  
  // Stats
  level: number
  experience: number
  power: number
  speed: number
  stamina: number
  defense: number
  
  // Resources
  money: number
  fame: number
  energy: number (max 100)
  rating: number (ELO)
  
  // Progress
  totalFights: number
  totalWins: number
  totalKnockouts: number
  winStreak: number
  highestRating: number
  
  // Timestamps
  lastEnergyRegen: Date
  lastLogin: Date
  createdAt: Date
}
```

**Ключевые функции:**
- Get/update player profile
- Level progression
- Energy regeneration (1/min)
- Offline earnings calculation
- Leaderboard ranking

---

### 3. Training Module

**Назначение:** Система тренировок и улучшений

```typescript
// Training Types
const TRAINING_TYPES = {
  STRENGTH: {
    cost: 100,
    duration: 5, // minutes
    rewards: { power: +2, exp: +10 }
  },
  SPEED: {
    cost: 150,
    duration: 5,
    rewards: { speed: +2, exp: +10 }
  },
  ENDURANCE: {
    cost: 200,
    duration: 5,
    rewards: { stamina: +2, exp: +10 }
  },
  TECHNIQUE: {
    cost: 250,
    duration: 10,
    rewards: { defense: +2, exp: +20 }
  }
};

// Upgrade System
const upgradeCost = (level) => {
  return baseCost * Math.pow(1.15, level);
};
```

**Ключевые функции:**
- Start/complete training
- Apply stat bonuses
- Track training history
- Calculate upgrade costs

---

### 4. Fight Module

**Назначение:** Боевая система vs AI

```typescript
// Fight Engine
class FightEngine {
  calculateDamage(attacker, defender) {
    const baseDamage = attacker.power;
    const critChance = attacker.speed / 200;
    const isCrit = Math.random() < critChance;
    
    let damage = baseDamage;
    if (isCrit) damage *= 2;
    
    // Защита уменьшает урон
    damage = damage * (100 / (100 + defender.defense));
    
    return { damage, isCrit };
  }
  
  simulateRound(player, opponent) {
    const playerDmg = this.calculateDamage(player, opponent);
    const opponentDmg = this.calculateDamage(opponent, player);
    
    // Обновить health
    player.health -= opponentDmg.damage;
    opponent.health -= playerDmg.damage;
    
    // Проверка нокаута
    if (player.health <= 0 || opponent.health <= 0) {
      return { knockout: true };
    }
    
    return { knockout: false };
  }
  
  runFight(player, opponent) {
    const maxRounds = 12;
    const rounds = [];
    
    for (let i = 1; i <= maxRounds; i++) {
      const round = this.simulateRound(player, opponent);
      rounds.push(round);
      
      if (round.knockout) break;
    }
    
    return {
      winner: player.health > opponent.health ? 'player' : 'opponent',
      rounds,
      totalRounds: rounds.length
    };
  }
}
```

**Ключевые функции:**
- Generate AI opponent (scaled to player level)
- Simulate fight (round-by-round)
- Calculate rewards (money, fame, BOX tokens)
- Track statistics
- Energy consumption

---

### 5. PvP Module (WebSocket)

**Назначение:** Real-time PvP matchmaking и бои

```typescript
// Gateway Structure
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'pvp'
})
class PvpGateway {
  private matchmakingQueue: Map<string, Player> = new Map();
  
  @SubscribeMessage('join-matchmaking')
  async handleJoinMatchmaking(client: Socket) {
    const player = await this.getPlayer(client);
    
    // Поиск подходящего противника (±200 рейтинга)
    const opponent = this.findOpponent(player);
    
    if (opponent) {
      // Match found!
      const match = await this.createMatch(player, opponent);
      
      client.emit('match-found', { opponent, match });
      opponent.socket.emit('match-found', { opponent: player, match });
    } else {
      // Добавить в очередь
      this.matchmakingQueue.set(player.id, player);
    }
  }
}
```

**Ключевые функции:**
- Real-time matchmaking (ELO-based)
- Match creation
- Live fight simulation
- Rating updates (+25/-20)
- Match history

---

### 6. Tournament Module

**Назначение:** Турнирная система

```typescript
// Tournament Entity
Tournament {
  id: UUID
  name: string
  format: '8-player' | '16-player'
  entryFee: number
  prizePool: number
  status: 'registration' | 'in_progress' | 'completed'
  startDate: Date
  endDate: Date
  
  participants: TournamentParticipant[]
  matches: TournamentMatch[]
}

// Prize Distribution
const prizes = {
  1st: prizePool * 0.50,
  2nd: prizePool * 0.25,
  3rd: prizePool * 0.125,
  4th: prizePool * 0.125
};
```

**Ключевые функции:**
- Create/manage tournaments
- Player registration
- Bracket generation (single elimination)
- Auto-match scheduling
- Prize distribution

---

### 7. Achievement Module

**Назначение:** Система достижений и наград

```typescript
// Achievement Categories
const ACHIEVEMENTS = {
  COMBAT: [
    { id: 'first_win', reward: 50 BOX },
    { id: 'win_100', reward: 500 BOX },
    { id: 'knockout_master', reward: 1000 BOX + Rare NFT },
  ],
  PROGRESSION: [
    { id: 'reach_level_10', reward: 200 BOX },
    { id: 'reach_level_50', reward: 2000 BOX + Epic NFT },
  ],
  COMPETITIVE: [
    { id: 'win_pvp_10', reward: 300 BOX },
    { id: 'win_tournament', reward: 5000 BOX + Legendary NFT },
  ],
  COLLECTION: [
    { id: 'collect_10_nfts', reward: 500 BOX },
    { id: 'collect_legendary', reward: 1000 BOX },
  ]
};

// Auto-check system
@Cron(CronExpression.EVERY_HOUR)
async checkAchievements() {
  const players = await this.getActivePlayers();
  
  for (const player of players) {
    await this.achievementService.checkAndUnlock(player.id);
  }
}
```

---

### 8. TON Module

**Назначение:** Полная интеграция с TON blockchain

```typescript
// Service Methods
class TonService {
  // Wallet
  async linkWallet(playerId, tonAddress)
  async getWalletInfo(tonAddress)
  
  // BOX Token Operations
  async mintBoxTokens(playerId, amount, reason)  // Game Master mint
  async getBoxTokenBalance(tonAddress)            // Read from blockchain
  async transferTokens(from, to, amount)          // P2P transfer
  
  // NFT Operations
  async mintNFT(playerId, metadata)               // Mint on-chain
  async getPlayerNFTs(tonAddress)                 // Read from blockchain
  async transferNFT(from, to, nftId)              // P2P transfer
  
  // Transaction Tracking
  async checkTransactionStatus(txHash)            // Poll blockchain
  async updatePendingTransactions()               // Cron job
}

// Transaction Flow
1. Create transaction in DB (status: 'pending')
2. Send to TON blockchain
3. Get txHash
4. Poll for confirmation (5-10 sec)
5. Update status to 'completed'
6. Notify player
```

**Ключевые функции:**
- TON wallet linking
- On-chain token operations
- Transaction monitoring
- Gas management
- Blockchain state sync

---

### 9. NFT Module

**Назначение:** Управление NFT активами

```typescript
// NFT Types
enum NFTType {
  BOXER = 'boxer',
  EQUIPMENT = 'equipment',
  GYM = 'gym',
  TRAINER = 'trainer',
  TITLE_BELT = 'title_belt'
}

// NFT Metadata
interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS or CDN URL
  attributes: {
    powerBonus?: number;
    speedBonus?: number;
    staminaBonus?: number;
    defenseBonus?: number;
    moneyMultiplier?: number;
    expMultiplier?: number;
    specialAbility?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

// Equip System
Player {
  equippedNFTs: {
    boxer: NFT | null,
    gloves: NFT | null,
    shorts: NFT | null,
    shoes: NFT | null,
    gym: NFT | null,
    trainer: NFT | null,
    belt: NFT | null
  }
}

// Bonus Calculation
const totalBonuses = equippedNFTs.reduce((acc, nft) => {
  acc.power += nft.attributes.powerBonus || 0;
  acc.speed += nft.attributes.speedBonus || 0;
  // ...
  return acc;
}, { power: 0, speed: 0, stamina: 0, defense: 0 });
```

**Ключевые функции:**
- Mint NFT on-chain
- Get player's NFT collection
- Equip/unequip NFT
- Calculate bonuses from equipped NFTs
- NFT transfer

---

### 10. Marketplace Module

**Назначение:** P2P торговля NFT

```typescript
// Listing Flow
1. Seller creates listing
   POST /marketplace/listings
   { nftId, price, currency: 'BOX' | 'TON' }
   
2. Listing appears on marketplace
   GET /marketplace/listings (with filters)
   
3. Buyer purchases NFT
   POST /marketplace/listings/:id/buy
   
4. Smart contract execution:
   - Transfer BOX tokens: buyer → seller (95%)
   - Marketplace fee: 5% (50% burn, 50% treasury)
   - Transfer NFT: seller → buyer
   
5. Trade recorded in history

// Fee Distribution
const totalPrice = 1000 BOX;
const fee = 50 BOX (5%);
const burned = 25 BOX (50% of fee) 🔥
const treasury = 25 BOX (50% of fee)
const sellerReceives = 950 BOX;
```

**Ключевые функции:**
- Create/cancel listings
- Search with filters
- Buy NFT (atomic transaction)
- Trade history
- Price analytics

---

### 11. Token Module (Staking)

**Назначение:** BOX Token staking для пассивного дохода

```typescript
// Staking Pools
const POOLS = [
  {
    name: 'Flexible',
    lockPeriod: 30 * 86400, // 30 days in seconds
    apy: 15,
    minStake: 100
  },
  {
    name: 'Standard',
    lockPeriod: 90 * 86400,
    apy: 30,
    minStake: 500
  },
  {
    name: 'Premium',
    lockPeriod: 180 * 86400,
    apy: 50,
    minStake: 1000
  }
];

// Reward Calculation
const calculateRewards = (stake: Stake) => {
  const now = Date.now();
  const durationDays = (now - stake.startDate) / 86400000;
  const rewards = stake.amount * (stake.pool.apy / 100 / 365) * durationDays;
  return Math.floor(rewards);
};

// Daily Distribution (Cron)
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async distributeStakingRewards() {
  const activeStakes = await this.stakeRepository.find({ status: 'active' });
  
  for (const stake of activeStakes) {
    const dailyReward = (stake.amount * stake.pool.apy / 100) / 365;
    await this.tonService.mintBoxTokens(stake.player.id, dailyReward, 'staking');
  }
}
```

**Ключевые функции:**
- Stake tokens (lock in smart contract)
- Calculate rewards (compound interest)
- Unstake with rewards
- Early unstake penalty
- Pool management

---

### 12. IAP Module

**Назначение:** In-App Purchases через Telegram Stars

```typescript
// Products
const PRODUCTS = [
  {
    id: 'starter_pack',
    price: 50, // Telegram Stars
    rewards: { money: 10000, cards: 5 }
  },
  {
    id: 'energy_refill',
    price: 10,
    rewards: { energy: 100 }
  },
  {
    id: 'premium_month',
    price: 300,
    rewards: { premium: 30 * 86400 }
  }
];

// Payment Flow
1. Player initiates purchase
2. Telegram shows payment dialog
3. Player confirms with Telegram Stars
4. Telegram sends webhook to backend
5. Backend validates signature
6. Backend grants rewards
7. Player receives items
```

---

## 📡 Data Flow

### Победа в бою (Play-to-Earn)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  1. Player wins fight (Frontend)          ┃
┗━━━━━━━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━━━━━━━━┛
                   │ POST /fight/complete
                   ↓
┏━━━━━━━━━━━━━━━━━━┴━━━━━━━━━━━━━━━━━━━━━━━┓
┃  2. Backend validates result               ┃
┃     - Check energy (-1)                    ┃
┃     - Verify fight outcome                 ┃
┃     - Calculate rewards                    ┃
┗━━━━━━━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━━━━━━━━┛
                   │
                   ↓
┏━━━━━━━━━━━━━━━━━━┴━━━━━━━━━━━━━━━━━━━━━━━┓
┃  3. Update in-game currency (PostgreSQL)   ┃
┃     player.money += 350                    ┃
┃     player.fame += 20                      ┃
┃     player.experience += 100               ┃
┗━━━━━━━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━━━━━━━━┛
                   │
                   ↓ Call TON Service
┏━━━━━━━━━━━━━━━━━━┴━━━━━━━━━━━━━━━━━━━━━━━┓
┃  4. Mint BOX tokens on-chain               ┃
┃     - Create mint message                  ┃
┃     - Sign with Game Master wallet         ┃
┃     - Send to TON blockchain               ┃
┃     - Get txHash                           ┃
┗━━━━━━━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━━━━━━━━┛
                   │ 5-10 seconds
                   ↓
┏━━━━━━━━━━━━━━━━━━┴━━━━━━━━━━━━━━━━━━━━━━━┓
┃  5. Transaction confirmed in TON           ┃
┃     - Tokens appear in Telegram Wallet     ┃
┃     - Player sees updated balance          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 💾 Структура БД (PostgreSQL)

### Core Tables

```sql
-- Players
CREATE TABLE players (
  id UUID PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  ton_wallet_address VARCHAR(255) UNIQUE,
  
  -- Stats
  level INT DEFAULT 1,
  experience BIGINT DEFAULT 0,
  power INT DEFAULT 10,
  speed INT DEFAULT 10,
  stamina INT DEFAULT 10,
  defense INT DEFAULT 10,
  
  -- Resources
  money BIGINT DEFAULT 1000,
  fame INT DEFAULT 0,
  energy INT DEFAULT 100,
  rating INT DEFAULT 1000,
  
  -- Progress tracking
  total_fights INT DEFAULT 0,
  total_wins INT DEFAULT 0,
  total_knockouts INT DEFAULT 0,
  win_streak INT DEFAULT 0,
  
  -- Timestamps
  last_energy_regen TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- NFTs
CREATE TABLE nfts (
  id UUID PRIMARY KEY,
  token_id VARCHAR(255) UNIQUE NOT NULL,
  owner_id UUID REFERENCES players(id),
  type VARCHAR(50) NOT NULL,
  rarity VARCHAR(50) NOT NULL,
  equipped BOOLEAN DEFAULT FALSE,
  on_chain BOOLEAN DEFAULT FALSE,
  contract_address VARCHAR(255),
  blockchain_tx_hash VARCHAR(255),
  minted_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace Listings
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY,
  nft_id UUID UNIQUE REFERENCES nfts(id),
  seller_id UUID REFERENCES players(id),
  price DECIMAL(20,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- TON Transactions
CREATE TABLE ton_transactions (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  type VARCHAR(50) NOT NULL,
  amount VARCHAR(255),
  token VARCHAR(50) NOT NULL,
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP
);

-- Staking
CREATE TABLE stakes (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  pool_id UUID REFERENCES staking_pools(id),
  amount DECIMAL(20,2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  rewards DECIMAL(20,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Индексы для производительности

```sql
-- Player lookups
CREATE INDEX idx_players_telegram_id ON players(telegram_id);
CREATE INDEX idx_players_ton_wallet ON players(ton_wallet_address);
CREATE INDEX idx_players_rating ON players(rating DESC);

-- NFT queries
CREATE INDEX idx_nfts_owner ON nfts(owner_id);
CREATE INDEX idx_nfts_type_rarity ON nfts(type, rarity);
CREATE INDEX idx_nfts_equipped ON nfts(owner_id, equipped) WHERE equipped = true;

-- Marketplace
CREATE INDEX idx_listings_status ON marketplace_listings(status) WHERE status = 'active';
CREATE INDEX idx_listings_price ON marketplace_listings(price);

-- Transactions
CREATE INDEX idx_ton_tx_hash ON ton_transactions(tx_hash);
CREATE INDEX idx_ton_tx_status ON ton_transactions(status) WHERE status = 'pending';
```

---

## 🔄 Интеграция TON Blockchain

### Smart Contract Communication

```
Backend (NestJS)
       │
       │ @ton/ton SDK
       ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  TON Blockchain Network      ┃
┃  (Mainnet/Testnet)           ┃
┗━━━━━━━━━━━━┬━━━━━━━━━━━━━━━━┛
             │
      ┏━━━━━━┴━━━━━━┓
      │              │
┏━━━━━▼━━━━━┓  ┏━━━━▼━━━━━━━━┓
┃ BOXToken  ┃  ┃ NFTCollection┃
┃ Contract  ┃  ┃ Contract     ┃
┃ (Jetton)  ┃  ┃ (TEP-62)     ┃
┗━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━┛
      │              │
      │              │
      └━━━━━━┬━━━━━━┘
             │
             ↓
┏━━━━━━━━━━━━┴━━━━━━━━━━━━┓
┃   Telegram Wallet          ┃
┃   (Player's Real Assets)   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Transaction Types

```typescript
// 1. Mint (Game Rewards)
Game Master Wallet 
    → calls BOXToken.mint(playerAddress, amount)
    → Player receives tokens in Telegram Wallet

// 2. Transfer (P2P)
Player A Wallet
    → calls BOXToken.transfer(playerB, amount)
    → Player B receives tokens

// 3. NFT Mint (Achievement Rewards)
Game Master Wallet
    → calls NFTCollection.mint(playerAddress, metadata)
    → Player receives NFT in Telegram Wallet

// 4. NFT Transfer (Marketplace)
Player A Wallet
    → calls NFTItem.transfer(playerB)
    → Player B receives NFT
```

---

## 🌐 Frontend Architecture

### Page Structure

```
App.tsx (Router)
│
├── HomePage
│   └── Dashboard с основной информацией
│
├── TrainingPage
│   └── 4 типа тренировок + upgrades
│
├── FightPage
│   ├── AI opponent selection
│   └── FightScene (Phaser.js 2D animation)
│
├── CardsPage
│   └── Коллекция карт с бонусами
│
├── ProfilePage
│   └── Статы, статистика, настройки
│
├── LeaderboardPage
│   └── Топ-100 игроков по рейтингу
│
├── PvPPage
│   ├── Matchmaking (WebSocket)
│   ├── Live fight vs real player
│   └── Match history
│
├── TournamentsPage
│   ├── Active tournaments list
│   ├── Tournament bracket
│   └── Registration
│
├── ShopPage
│   └── Telegram Stars purchases
│
├── AchievementsPage
│   └── Все достижения с прогрессом
│
├── NFTGalleryPage
│   ├── Player's NFT collection
│   ├── Equip/unequip
│   └── Publish to blockchain
│
├── MarketplacePage
│   ├── Browse NFT listings
│   ├── Filters (type, rarity, price)
│   └── Buy/sell NFTs
│
└── WalletPage
    ├── BOX & TON balances
    ├── Withdraw tokens
    ├── Transaction history
    └── Staking interface
```

### State Management

```typescript
// Zustand Stores
interface GameStore {
  // Player state
  player: Player | null;
  
  // UI state
  loading: boolean;
  notifications: Notification[];
  
  // Actions
  fetchPlayer: () => Promise<void>;
  updatePlayer: (updates: Partial<Player>) => void;
  showNotification: (message: string) => void;
}

interface WalletStore {
  // TON Connect state
  address: string | null;
  isConnected: boolean;
  balance: string;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}
```

### Data Fetching (TanStack Query)

```typescript
// Query Keys
const queryKeys = {
  player: ['player'],
  nfts: ['nfts'],
  wallet: ['wallet'],
  balance: ['balance'],
  marketplace: ['marketplace', filters],
  achievements: ['achievements'],
  leaderboard: ['leaderboard'],
};

// Queries
const { data: player } = useQuery({
  queryKey: queryKeys.player,
  queryFn: () => api.getPlayer(),
  staleTime: 30000, // 30 seconds
});

// Mutations
const fightMutation = useMutation({
  mutationFn: (opponentId) => api.startFight(opponentId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.player });
  },
});
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend
```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/boxing_champion

# Redis
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...

# TON Blockchain
TON_NETWORK=mainnet # or testnet
TONCENTER_API_KEY=your_api_key
BOX_TOKEN_ADDRESS=EQAAAA...
NFT_COLLECTION_ADDRESS=EQBBBB...
GAME_MASTER_WALLET=EQCCCC...
GAME_MASTER_MNEMONIC="word1 word2 ... word24"
ENCRYPTION_KEY=encryption-key-for-sensitive-data

# Monitoring (optional)
SENTRY_DSN=https://...
```

#### Frontend
```bash
# API
VITE_BACKEND_URL=https://api.boxing-champion.app
VITE_WS_URL=wss://api.boxing-champion.app

# TON
VITE_TON_NETWORK=mainnet
```

---

## 🔒 Security Measures

### Backend Security

```typescript
// 1. Rate Limiting
@UseGuards(ThrottlerGuard)
@Throttler({ limit: 100, ttl: 60 })

// 2. Input Validation
class StartFightDto {
  @IsUUID()
  opponentId: string;
  
  @IsInt()
  @Min(1)
  @Max(10)
  difficulty: number;
}

// 3. Authorization Guards
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlayerController { ... }

// 4. SQL Injection Protection
// TypeORM автоматически использует parameterized queries

// 5. XSS Protection
@Transform(({ value }) => sanitizeHtml(value))
username: string;
```

### Smart Contract Security

```func
;; BOXToken.fc

() mint_tokens(...) impure {
  var (_, owner, _, _) = load_data();
  
  ;; Только owner может mint
  throw_unless(73, equal_slices(sender, owner));
  
  ;; Mint logic...
}

;; Reentrancy protection
;; Integer overflow protection
;; Access control
```

---

## 📡 Real-time Features (WebSocket)

### Socket.io Implementation

```typescript
// Backend Gateway
@WebSocketGateway({ cors: { origin: '*' } })
class PvpGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  
  @SubscribeMessage('join-matchmaking')
  async handleJoinMatchmaking(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    // Matchmaking logic...
    this.server.to(client.id).emit('match-found', opponent);
  }
}

// Frontend Hook
export function usePvP() {
  const [searching, setSearching] = useState(false);
  const [opponent, setOpponent] = useState(null);
  
  useEffect(() => {
    socket.on('match-found', (data) => {
      setOpponent(data.opponent);
      setSearching(false);
    });
    
    return () => socket.off('match-found');
  }, []);
  
  const startSearch = () => {
    socket.emit('join-matchmaking');
    setSearching(true);
  };
  
  return { searching, opponent, startSearch };
}
```

---

## 🔍 Monitoring & Logging

### Winston Logger

```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

WinstonModule.forRoot({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});
```

### Metrics Tracking

```typescript
// Key Metrics
interface Metrics {
  // Business
  dau: number;              // Daily Active Users
  mau: number;              // Monthly Active Users
  arpu: number;             // Average Revenue Per User
  conversionRate: number;   // Free → Paying
  
  // Game
  avgSessionLength: number;
  fightsPerDay: number;
  pvpMatchesPerDay: number;
  avgWinRate: number;
  
  // Technical
  apiResponseTime: number;
  errorRate: number;
  wsConnections: number;
  
  // Blockchain
  pendingTxCount: number;
  avgConfirmationTime: number;
  dailyGasCost: number;
}
```

---

## 📦 Deployment Architecture

### Production Stack

```yaml
Frontend:
  Platform: Vercel / Netlify
  CDN: Cloudflare
  Domain: app.boxing-champion.io

Backend:
  Platform: Railway / AWS ECS / Heroku
  Instances: 3+ (load balanced)
  Domain: api.boxing-champion.io

Database:
  Service: AWS RDS PostgreSQL
  Backup: Daily automated
  Replication: Read replicas

Cache:
  Service: AWS ElastiCache Redis
  Cluster: 2+ nodes

Blockchain:
  Network: TON Mainnet
  RPC: Multiple endpoints (TONCenter + backup)
  Monitoring: TONScan webhooks

CDN:
  Assets: Cloudflare R2
  Images: Optimized & cached
```

### Scaling Strategy

```
Load: 1K users
└── 1 backend instance
    1 PostgreSQL
    1 Redis

Load: 10K users
└── 3 backend instances (load balanced)
    1 PostgreSQL (read replicas)
    2 Redis (cluster)

Load: 100K users
└── 10+ backend instances
    PostgreSQL (master + 3 read replicas)
    Redis cluster (6 nodes)
    Separate WebSocket servers
```

---

## 📊 Performance Optimization

### Database

```sql
-- Partitioning для больших таблиц
CREATE TABLE ton_transactions_2025_01 
  PARTITION OF ton_transactions 
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Материализованные представления для leaderboards
CREATE MATERIALIZED VIEW leaderboard_cache AS
  SELECT id, username, rating, total_wins
  FROM players
  ORDER BY rating DESC
  LIMIT 100;

REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_cache;
```

### Redis Caching

```typescript
// Cache Strategy
const CACHE_TTL = {
  player: 60,           // 1 минута
  leaderboard: 300,     // 5 минут
  nfts: 120,            // 2 минуты
  marketplace: 60,      // 1 минута
  balance: 30,          // 30 секунд
};

// Cache-aside pattern
async getPlayer(id: string) {
  const cached = await redis.get(`player:${id}`);
  if (cached) return JSON.parse(cached);
  
  const player = await db.findOne({ where: { id } });
  await redis.setex(`player:${id}`, CACHE_TTL.player, JSON.stringify(player));
  
  return player;
}
```

### API Optimization

```typescript
// Pagination
@Get('leaderboard')
async getLeaderboard(
  @Query('page') page = 1,
  @Query('limit') limit = 50,
) {
  return this.playerService.getLeaderboard(page, limit);
}

// Field selection
@Get('players')
async getPlayers(
  @Query('fields') fields?: string,
) {
  const select = fields ? fields.split(',') : undefined;
  return this.playerRepository.find({ select });
}

// Lazy loading
const player = await this.playerRepository.findOne({
  where: { id },
  relations: ['equippedNFTs'], // Load only when needed
});
```

---

## 🧪 Testing Strategy

### Backend Tests

```typescript
// Unit Tests
describe('FightService', () => {
  it('should calculate damage correctly', () => {
    const damage = fightEngine.calculateDamage(player, opponent);
    expect(damage).toBeGreaterThan(0);
  });
  
  it('should determine winner', () => {
    const result = fightEngine.runFight(player, opponent);
    expect(result.winner).toBeDefined();
  });
});

// Integration Tests
describe('Fight API', () => {
  it('POST /fight/start', async () => {
    const response = await request(app.getHttpServer())
      .post('/fight/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ opponentId: '...' });
      
    expect(response.status).toBe(201);
  });
});
```

### Frontend Tests

```typescript
// Component Tests (Vitest + Testing Library)
describe('FightPage', () => {
  it('should render fight scene', () => {
    render(<FightPage />);
    expect(screen.getByText('Start Fight')).toBeInTheDocument();
  });
  
  it('should start fight on button click', async () => {
    const user = userEvent.setup();
    render(<FightPage />);
    
    await user.click(screen.getByText('Start Fight'));
    expect(mockStartFight).toHaveBeenCalled();
  });
});
```

---

## 📚 Technology Stack Summary

### Backend
```yaml
Framework: NestJS 10.x
Language: TypeScript 5.x
Database: PostgreSQL 15.x
ORM: TypeORM 0.3.x
Cache: Redis 7.x
WebSocket: Socket.io 4.x
Queue: Bull 4.x
Blockchain: @ton/ton, @ton/crypto
Validation: class-validator, class-transformer
Docs: Swagger (OpenAPI 3.0)
Logging: Winston
Testing: Jest
```

### Frontend
```yaml
Framework: React 18.x
Language: TypeScript 5.x
Build: Vite 5.x
Routing: React Router 6.x
State: Zustand 4.x
Data: TanStack Query 5.x
UI: TailwindCSS 3.x
Animations: Framer Motion 11.x
Game Engine: Phaser.js 3.x
Blockchain: @tonconnect/ui-react
HTTP: Axios
WebSocket: Socket.io-client
Testing: Vitest + Testing Library
```

### Smart Contracts
```yaml
Language: FunC
Standards: TEP-74 (Jetton), TEP-62 (NFT)
Network: TON Blockchain
Tools: func compiler, ton-contract-executor
```

### DevOps
```yaml
Containers: Docker + Docker Compose
CI/CD: GitHub Actions
Hosting: Vercel (frontend) + Railway (backend)
Monitoring: Sentry, CloudWatch
CDN: Cloudflare
```

---

## 📈 Scalability

### Current Capacity

```yaml
Concurrent Users: 1,000-5,000
Requests/sec: 500-1,000
WebSocket Connections: 1,000+
Database Connections: 100
Blockchain TPS: 100+ (TON can handle much more)
```

### Scaling Plan

```yaml
10K users:
  - 3 backend instances
  - PostgreSQL read replicas
  - Redis cluster
  - CDN for static assets

100K users:
  - 10+ backend instances
  - Database sharding
  - Separate WebSocket servers
  - Microservices architecture
  - Event-driven with message queue

1M users:
  - Kubernetes cluster
  - Multi-region deployment
  - Edge computing
  - Advanced caching strategies
```

---

## 🔗 External Integrations

```yaml
Telegram:
  - Bot API (notifications, commands)
  - Mini Apps (game interface)
  - Telegram Stars (payments)
  - Telegram Wallet (crypto)

TON Blockchain:
  - TONCenter API (blockchain queries)
  - TON Connect (wallet connection)
  - TON DNS (domain resolution)
  - TONScan (explorer)

Third-party:
  - IPFS (NFT metadata storage)
  - Cloudflare (CDN)
  - Sentry (error tracking)
  - Mixpanel (analytics)
```

---

## ✅ Production Checklist

- [ ] Smart contracts audited
- [ ] Smart contracts deployed on mainnet
- [ ] Backend deployed with SSL
- [ ] Frontend deployed on CDN
- [ ] Database backups configured
- [ ] Monitoring & alerts setup
- [ ] Rate limiting configured
- [ ] Error tracking active
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Telegram Bot approved
- [ ] TON Connect configured
- [ ] Legal documents (ToS, Privacy)
- [ ] Community channels created

---

**🚀 Production-Ready Architecture для масштабирования до миллионов пользователей!**
