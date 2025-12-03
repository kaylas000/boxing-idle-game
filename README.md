# 🥊 Boxing Champion - Web3 Play-to-Earn Game

> **Полноценная idle-игра на TON blockchain для Telegram Mini Apps с NFT, токенами и PvP**

[![TON Blockchain](https://img.shields.io/badge/Blockchain-TON-0098EA?style=for-the-badge&logo=telegram)](https://ton.org)
[![Telegram](https://img.shields.io/badge/Platform-Telegram-26A5E4?style=for-the-badge&logo=telegram)](https://telegram.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**Boxing Champion** - это инновационная Web3 игра в стиле idle-clicker, где игроки развивают карьеру виртуального боксёра, зарабатывают реальные криптоактивы (BOX токены и NFT) и соревнуются с другими игроками в PvP и турнирах.

[🎮 Играть сейчас](https://t.me/your_bot) | [📖 Документация](./docs) | [💬 Сообщество](https://t.me/boxing_champion)

---

## 🌟 Особенности

### 🎮 Игровые механики
- ⚔️ **PvP бои в реальном времени** - сражайтесь с живыми игроками через WebSocket
- 🏆 **Турниры** - соревнования на 8/16 человек с призовым фондом
- 💪 **Система прогрессии** - тренировки, улучшения, уровни, достижения
- 🎞️ **Анимированные бои** - полноценная 2D визуализация на Phaser.js
- 📊 **Рейтинговая система** - ELO matchmaking для честных матчей
- 🎯 **200+ достижений** - с наградами в виде токенов и NFT

### 💎 Web3 & Криптоэкономика
- 🪙 **BOX Token** - игровая криптовалюта на TON blockchain (TEP-74)
- 🖼️ **NFT система** - 5 типов коллекционных NFT с игровыми бонусами (TEP-62)
- 🛒 **NFT Marketplace** - P2P торговля с комиссией 5%
- 🔒 **Staking** - пассивный доход до 50% APY
- 💰 **Play-to-Earn** - реальные заработки за игру
- ⛓️ **100% On-Chain** - все активы в TON blockchain

### 🚀 Технологии
- **Backend**: NestJS + PostgreSQL + Redis + WebSocket
- **Frontend**: React + TypeScript + TailwindCSS + Phaser.js
- **Blockchain**: TON + Smart Contracts (FunC) + TON Connect
- **Platform**: Telegram Mini Apps
- **Wallet**: Telegram Wallet (встроенный)

---

## 📁 Структура проекта

```
boxing-idle-game/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # JWT + Telegram WebApp авторизация
│   │   │   ├── player/        # Управление игроками и профилями
│   │   │   ├── training/      # Система тренировок и прогрессии
│   │   │   ├── fight/         # Боевая система и AI противники
│   │   │   ├── pvp/           # PvP matchmaking + WebSocket
│   │   │   ├── tournament/    # Турнирная система
│   │   │   ├── achievement/   # Система достижений
│   │   │   ├── iap/           # In-App Purchases (Telegram Stars)
│   │   │   ├── ton/           # TON blockchain интеграция
│   │   │   ├── nft/           # NFT система (mint, equip, bonuses)
│   │   │   ├── token/         # BOX Token + Staking
│   │   │   ├── marketplace/   # NFT Marketplace
│   │   │   └── blockchain/    # Wallet management
│   │   ├── common/            # Shared utilities, guards, decorators
│   │   └── config/            # Configuration modules
│   ├── migrations/            # Database migrations
│   ├── test/                  # E2E и unit тесты
│   └── package.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── FightScene/   # Phaser.js 2D fight animation
│   │   │   ├── TonConnect/   # TON wallet integration
│   │   │   └── ...
│   │   ├── pages/            # Application pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── TrainingPage.tsx
│   │   │   ├── FightPage.tsx
│   │   │   ├── CardsPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   ├── PvPPage.tsx
│   │   │   ├── TournamentsPage.tsx
│   │   │   ├── ShopPage.tsx
│   │   │   ├── AchievementsPage.tsx
│   │   │   ├── NFTGalleryPage.tsx
│   │   │   ├── MarketplacePage.tsx
│   │   │   └── WalletPage.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useTonConnect.ts
│   │   │   ├── usePvP.ts
│   │   │   └── ...
│   │   ├── lib/              # API client, utilities
│   │   │   ├── api.ts        # Axios API client
│   │   │   ├── socket.ts     # Socket.io client
│   │   │   └── ton.ts        # TON SDK helpers
│   │   ├── stores/           # Zustand state management
│   │   ├── styles/           # TailwindCSS + global styles
│   │   └── types/            # TypeScript definitions
│   ├── public/
│   │   ├── tonconnect-manifest.json
│   │   └── assets/
│   └── package.json
│
├── contracts/                  # TON Smart Contracts
│   ├── BOXToken.fc            # Jetton token (TEP-74)
│   ├── NFTCollection.fc       # NFT collection (TEP-62)
│   ├── NFTItem.fc             # NFT item contract
│   └── scripts/
│       └── deploy.js          # Deployment scripts
│
├── docs/                       # Документация
│   ├── API.md                 # API Reference
│   ├── GAME_DESIGN.md         # Game Design Document
│   ├── CRYPTO_ECONOMY.md      # Криптоэкономика
│   └── TON_INTEGRATION.md     # TON blockchain integration
│
├── .github/
│   └── workflows/
│       ├── backend-ci.yml     # Backend CI/CD
│       └── frontend-ci.yml    # Frontend CI/CD
│
├── docker-compose.yml          # Development environment
├── README.md                   # Этот файл
└── LICENSE                     # MIT License
```

---

## 🎯 Игровая экономика

### 💰 Валюты

| Валюта | Тип | Назначение |
|--------|-----|------------|
| **Money** 💵 | In-game | Тренировки, улучшения, турниры |
| **Fame** ⭐ | In-game | Престиж, разблокировка контента |
| **Energy** ⚡ | In-game | Лимитирующий ресурс для боёв |
| **Rating** 🏆 | In-game | PvP рейтинг, matchmaking |
| **BOX Token** 🪙 | Crypto (TON) | Play-to-Earn, NFT покупки, staking |
| **TON** 💎 | Crypto | Gas fees, премиум контент |

### 🎮 Как зарабатывать BOX токены

```yaml
Победы в боях:        5-15 BOX + бонусы
Нокаут:               +5 BOX
Win streak (x5):      x2.0 множитель
PvP победа:           20-50 BOX
Турнирный приз:       100-1000 BOX
Достижения:           50-10,000 BOX
Ежедневные награды:   10-500 BOX
Продажа NFT:          Цена NFT в BOX
Staking (50% APY):    Пассивный доход
```

### 🖼️ NFT типы

| Тип | Описание | Бонусы |
|-----|----------|--------|
| **Boxer** 🥊 | Уникальные бойцы | +Power, +Speed, +Stamina, Special Ability |
| **Equipment** 🥊 | Перчатки, шорты, обувь | +Stats, Special Effects |
| **Gym** 🏋️ | Залы для тренировок | x2 EXP, -50% training cost |
| **Trainer** 🧑‍🏫 | Тренеры с бонусами | x2 Money, +Recovery |
| **Title Belt** 🏆 | Пояса чемпиона | +100 ко всем статам |

**5 уровней редкости:**
- Common (50%) - +5-15 stats
- Rare (30%) - +15-35 stats
- Epic (15%) - +35-60 stats
- Legendary (4%) - +60-90 stats
- Mythic (1%) - +90-150 stats

---

## 🚀 Быстрый старт

### Требования

```bash
Node.js >= 18.x
PostgreSQL >= 14.x
Redis >= 6.x
npm или yarn
```

### 1. Клонирование репозитория

```bash
git clone https://github.com/kaylas000/boxing-idle-game.git
cd boxing-idle-game
```

### 2. Установка зависимостей

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Настройка окружения

#### Backend (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/boxing_champion

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather

# TON Blockchain
TON_NETWORK=testnet
TONCENTER_API_KEY=your_toncenter_api_key
BOX_TOKEN_ADDRESS=EQD...
NFT_COLLECTION_ADDRESS=EQD...
GAME_MASTER_MNEMONIC="word1 word2 ... word24"
```

#### Frontend (.env.local)
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### 4. Запуск инфраструктуры

```bash
# Запустить PostgreSQL + Redis через Docker
docker-compose up -d postgres redis
```

### 5. Миграции базы данных

```bash
cd backend
npm run migration:run
```

### 6. Запуск приложения

```bash
# Backend (терминал 1)
cd backend
npm run start:dev

# Frontend (терминал 2)
cd frontend
npm run dev
```

### 7. Открыть в браузере

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs (Swagger)**: http://localhost:3000/api/docs

---

## 🎮 Основные игровые системы

### 1. Система боёв

**Механика:**
```typescript
// Расчёт урона
const playerPower = player.power + equipment.powerBonus + nft.powerBonus;
const damage = playerPower * critMultiplier * comboMultiplier;

// Шанс победы
const playerScore = power + speed + stamina + defense;
const opponentScore = opponent.power + ... ;
const winChance = playerScore / (playerScore + opponentScore);

// Система раундов
const rounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// Нокаут возможен в любом раунде при критическом ударе
```

**Визуализация:**
- Phaser.js 2D сцена
- Анимации ударов, блоков, нокаутов
- Healthbar progression
- Round counter
- Real-time commentary

### 2. PvP система

**Matchmaking:**
```typescript
// ELO-based matchmaking
const matchRange = 200; // ±200 рейтинга
const suitablePlayers = await findPlayers({
  rating: { between: [player.rating - 200, player.rating + 200] },
  status: 'searching',
});

// WebSocket real-time updates
socket.on('match-found', (opponent) => {
  // Начало боя
});
```

**Рейтинговая система:**
- Старт: 1000 рейтинга
- Победа: +25
- Поражение: -20
- Глобальный leaderboard
- Сезонные награды

### 3. Турниры

**Форматы:**
- Single Elimination (8 или 16 игроков)
- Entry fee: 5,000-20,000 Money
- Призовой фонд распределяется между топ-4
- 3 турнира одновременно (Beginner/Intermediate/Pro)

**Призы:**
```yaml
1 место: 50% фонда + Legendary NFT
2 место: 25% фонда + Epic NFT
3-4 место: 12.5% фонда + Rare NFT
```

### 4. Staking система

**Пулы:**
```yaml
Flexible (30 days):
  APY: 15%
  Min: 100 BOX
  Lock: 30 дней

Standard (90 days):
  APY: 30%
  Min: 500 BOX
  Lock: 90 дней

Premium (180 days):
  APY: 50%
  Min: 1000 BOX
  Lock: 180 дней
```

**Награды:**
- Ежедневное начисление
- Compound интерес
- Early unstake penalty: 10-20%

### 5. NFT Marketplace

**Механика:**
- Листинг NFT за BOX или TON
- Комиссия: 5% (50% burn, 50% treasury)
- Фильтры: тип, редкость, цена, статы
- История продаж
- Price discovery

---

## 🏗️ Технологическая архитектура

### Backend

```
┌─────────────────────────────────────┐
│      Telegram Mini App (Client)    │
└──────────────┬──────────────────────┘
               │ HTTPS / WSS
┌──────────────▼──────────────────────┐
│         NestJS API Gateway          │
│  ┌─────────────────────────────┐   │
│  │  Auth (JWT + Telegram)      │   │
│  │  Rate Limiting              │   │
│  │  CORS                       │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌─────▼────────┐
│  PostgreSQL │  │  Redis Cache │
│  (TypeORM)  │  │  (Bull Queue)│
└─────────────┘  └──────────────┘
       │
┌──────▼───────────────────────┐
│    TON Blockchain SDK        │
│  ┌─────────────────────┐     │
│  │  @ton/ton           │     │
│  │  @ton/crypto        │     │
│  │  TON Connect        │     │
│  └─────────────────────┘     │
└──────────┬───────────────────┘
           │
    ┌──────▼─────────┐
    │  TON Blockchain│
    │  - BOX Token   │
    │  - NFT Coll.   │
    └────────────────┘
```

### Frontend

```
┌─────────────────────────────────────┐
│         React Application           │
│  ┌─────────────────────────────┐   │
│  │  React Router (Navigation)  │   │
│  │  Zustand (State)            │   │
│  │  TanStack Query (Data)      │   │
│  │  Framer Motion (Animations) │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌─────▼────────┐
│  Phaser.js  │  │ TON Connect  │
│  (Fights)   │  │ (Wallet)     │
└─────────────┘  └──────────────┘
```

### Smart Contracts

```
TON Blockchain
│
├── BOXToken.fc (Jetton TEP-74)
│   ├── mint() - Game Master only
│   ├── transfer()
│   ├── burn()
│   └── get_wallet_data()
│
└── NFTCollection.fc (TEP-62)
    ├── mint_nft()
    ├── transfer_nft()
    └── get_nft_data()
```

---

## 📡 API Documentation

### Основные endpoints

```typescript
// Auth
POST   /api/auth/telegram         # Telegram WebApp авторизация
GET    /api/auth/profile           # Текущий профиль

// Player
GET    /api/player                 # Данные игрока
PATCH  /api/player/stats           # Обновить статы

// Training
POST   /api/training/start         # Начать тренировку
GET    /api/training/history       # История тренировок

// Fight
POST   /api/fight/start            # Начать бой
POST   /api/fight/complete         # Завершить бой

// PvP
POST   /api/pvp/join               # Присоединиться к matchmaking
POST   /api/pvp/leave              # Покинуть matchmaking
GET    /api/pvp/history            # История PvP матчей

// Tournaments
GET    /api/tournaments/active     # Активные турниры
POST   /api/tournaments/:id/register  # Регистрация
GET    /api/tournaments/my         # Мои турниры

// TON
POST   /api/ton/link-wallet        # Привязать TON wallet
GET    /api/ton/balance            # Баланс BOX токенов
GET    /api/ton/nfts               # Мои NFT

// NFT
GET    /api/nft/my                 # Мои NFT
POST   /api/nft/mint               # Создать NFT
POST   /api/nft/:id/equip          # Экипировать/снять

// Marketplace
GET    /api/marketplace/listings   # Листинги NFT
POST   /api/marketplace/listings   # Создать листинг
POST   /api/marketplace/:id/buy    # Купить NFT

// Achievements
GET    /api/achievements            # Все достижения
POST   /api/achievements/:id/claim # Получить награду
GET    /api/achievements/stats     # Статистика
```

**Полная документация:** http://localhost:3000/api/docs (Swagger UI)

---

## 🧪 Тестирование

### Unit тесты

```bash
cd backend
npm run test
```

### E2E тесты

```bash
cd backend
npm run test:e2e
```

### Frontend тесты

```bash
cd frontend
npm run test
```

### Coverage

```bash
npm run test:cov
```

---

## 🔒 Безопасность

### Реализованные меры

- ✅ JWT авторизация с refresh tokens
- ✅ Telegram WebApp signature validation
- ✅ Rate limiting (100 req/min per user)
- ✅ Input validation (class-validator)
- ✅ SQL injection protection (TypeORM)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Encrypted Game Master wallet
- ✅ Server-side game logic validation
- ✅ Anti-cheat механизмы

### Безопасность смарт-контрактов

- ✅ Owner-only mint functions
- ✅ Reentrancy protection
- ✅ Integer overflow protection
- ✅ Access control modifiers
- 🔄 Smart contract audit (рекомендуется перед mainnet)

---

## 📦 Deployment

### Backend (Railway/Heroku/AWS)

```bash
# 1. Build
npm run build

# 2. Миграции в production
DATABASE_URL=postgres://... npm run migration:run

# 3. Запуск
npm run start:prod
```

### Frontend (Vercel/Netlify)

```bash
# 1. Build
npm run build

# 2. Deploy
vercel deploy --prod
```

### Smart Contracts (TON)

```bash
cd contracts

# Компиляция
func -o BOXToken.fif BOXToken.fc
func -o NFTCollection.fif NFTCollection.fc

# Deploy
node scripts/deploy.js --network mainnet
```

### Docker

```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# Scale
docker-compose up -d --scale backend=3
```

---

## 📊 Monitoring & Analytics

### Метрики

```yaml
Business Metrics:
  - DAU/MAU
  - ARPU (Average Revenue Per User)
  - Conversion Rate
  - Retention (D1, D7, D30)
  - LTV (Lifetime Value)

Game Metrics:
  - Average session length
  - Fights per day
  - Win rate distribution
  - Progression speed
  - NFT trading volume

Technical Metrics:
  - API response time
  - Error rate
  - WebSocket connections
  - Blockchain transaction success rate
  - Gas costs
```

### Инструменты

- **Backend**: Winston logger + CloudWatch
- **Frontend**: Sentry error tracking
- **Analytics**: Mixpanel/Amplitude
- **Blockchain**: TONScan, TONCenter webhooks

---

## 🗺️ Roadmap

### ✅ Phase 1: Core Game (Completed)
- [x] Backend API с игровой логикой
- [x] Frontend UI/UX
- [x] Система боёв с Phaser.js анимацией
- [x] Тренировки и прогрессия
- [x] Достижения

### ✅ Phase 2: Multiplayer (Completed)
- [x] PvP система с WebSocket
- [x] Турниры 8/16 человек
- [x] Рейтинговая система
- [x] Leaderboards

### ✅ Phase 3: Web3 Integration (Completed)
- [x] TON blockchain интеграция
- [x] BOX Token (Jetton)
- [x] NFT система
- [x] NFT Marketplace
- [x] Staking пулы
- [x] Telegram Wallet интеграция

### 🔄 Phase 4: Growth & Expansion (In Progress)
- [ ] Мобильное приложение (iOS/Android)
- [ ] Гильдии/Кланы
- [ ] Сезонные ивенты
- [ ] Ежедневные квесты
- [ ] Реферальная программа
- [ ] Социальные функции

### 🔮 Phase 5: Ecosystem (Planned)
- [ ] DAO governance через BOX токены
- [ ] NFT lending/borrowing
- [ ] Cross-game NFT utility
- [ ] Esports турниры с большими призами
- [ ] Спонсорства реальных боксёров
- [ ] VR/AR интеграция

---

## 🤝 Contributing

Мы приветствуем вклад сообщества! Пожалуйста, прочитайте [CONTRIBUTING.md](./CONTRIBUTING.md) для деталей.

### Как внести вклад

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📜 License

Этот проект лицензирован под MIT License - см. [LICENSE](./LICENSE) для деталей.

---

## 📞 Контакты и поддержка

- **Telegram**: [@boxing_champion](https://t.me/boxing_champion)
- **Email**: support@boxing-champion.app
- **Discord**: [Join our server](https://discord.gg/boxing-champion)
- **Twitter**: [@BoxingChampGame](https://twitter.com/BoxingChampGame)

---

## 🙏 Acknowledgments

- [TON Foundation](https://ton.org) - Blockchain инфраструктура
- [Telegram](https://telegram.org) - Platform для Mini Apps
- [NestJS](https://nestjs.com) - Backend framework
- [React](https://react.dev) - Frontend library
- [Phaser.js](https://phaser.io) - Game engine для анимаций

---

## 📚 Дополнительная документация

- [API Reference](./docs/API.md)
- [Game Design Document](./docs/GAME_DESIGN.md)
- [Crypto Economy](./CRYPTO_ECONOMY.md)
- [TON Integration Guide](./TON_INTEGRATION.md)
- [Smart Contracts](./contracts/README.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

**🥊 Made with ❤️ by the Boxing Champion Team**

⭐ **Star us on GitHub** — it motivates us to make the game even better!

[⬆ Back to top](#-boxing-champion---web3-play-to-earn-game)
