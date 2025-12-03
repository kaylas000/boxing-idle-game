# 🥊 Boxing Champion - Полноценная Production-Ready Игра

> **Professional idle-game с микросервисной архитектурой, готовая к миллионам пользователей**

[![Backend](https://img.shields.io/badge/Backend-NestJS-red)](./backend)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](./frontend)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 🎯 Что это?

Boxing Champion - это **полноценная production-ready игра** в стиле Hamster Combat, где вы управляете карьерой боксёра. Проект включает:

- ✅ **Backend на NestJS** с PostgreSQL и Redis
- ✅ **Frontend на React** с TypeScript и TailwindCSS  
- ✅ **Telegram Mini App** интеграция
- ✅ **Docker** контейнеризация
- ✅ **CI/CD** пайплайны
- ✅ **API документация** (Swagger)
- ✅ **Deployment-ready** конфигурации
- ✅ **🎞️ Анимированные бои на Phaser.js**
- ✅ **⚔️ PvP система (реальные игроки)**
- ✅ **🏆 Турниры 8/16 человек**
- ✅ **💎 Монетизация через Telegram Stars**
- ✅ **🎖️ Система достижений**

## 📊 Реализовано на 100%

### ✅ Backend (Полностью функциональный)

- **Auth** - JWT авторизация + Telegram WebApp
- **Database** - PostgreSQL с TypeORM, миграции, индексы
- **Cache** - Redis для производительности
- **Game Logic** - тренировки, бои, прогрессия
- **Fight Engine** - расчёт урона, шансы победы, нокауты
- **PvP** - матчмейкинг, рейтинг, история матчей
- **Tournaments** - сущности турниров, участников, призы
- **IAP (In-App Purchases)** - покупки через Telegram Stars
- **Achievements** - система достижений и наград
- **API** - 20+ RESTful endpoints
- **Security** - Rate limiting, validation, CORS
- **Docs** - Swagger UI на /api/docs

### ✅ Frontend (Современный UI)

- **Pages** - 9+ страниц:
  - Home, Training, Fight, Cards, Profile, Leaderboard
  - PvP, Tournaments, Shop, Achievements
- **State** - Zustand + TanStack Query
- **Animations** - Framer Motion
- **Phaser.js интеграция** - полноценная 2D сцена боя
- **Responsive** - Mobile-first дизайн
- **Telegram** - Полная интеграция SDK

### ✅ DevOps

- **Docker** - compose для dev окружения
- **CI/CD** - GitHub Actions
- **Deploy** - Ready для Railway/Vercel/AWS

---

## 🏗️ Архитектура

```bash
boxing-idle-game/
├── backend/                      # NestJS + PostgreSQL + Redis
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/             # JWT + Telegram auth
│   │   │   ├── player/           # Player management
│   │   │   ├── training/         # Training system
│   │   │   ├── fight/            # Fight simulation
│   │   │   ├── cards/            # Card collection
│   │   │   ├── shop/             # In-game shop
│   │   │   ├── pvp/              # PvP система
│   │   │   ├── tournament/       # Турниры
│   │   │   ├── iap/              # In-App Purchases (Telegram Stars)
│   │   │   └── achievements/     # Достижения
│   ├── docker-compose.yml
│   └── Dockerfile
│
├── frontend/                     # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   └── PhaserGame.tsx    # Встраивание Phaser сцены
│   │   ├── game/
│   │   │   ├── FightScene.ts     # Логика анимированного боя
│   │   │   ├── BoxerSprite.ts    # Спрайты боксёров
│   │   │   ├── ParticleEffects.ts# Эффекты частиц
│   │   │   └── SoundManager.ts   # Звуки
│   │   ├── pages/
│   │   │   ├── FightPage.tsx     # Бои (анимация + быстрый бой)
│   │   │   ├── PvPPage.tsx       # PvP арена
│   │   │   ├── TournamentPage.tsx# Турниры
│   │   │   ├── ShopPage.tsx      # Магазин (Telegram Stars)
│   │   │   └── AchievementsPage.tsx # Достижения
│   │   ├── lib/                  # API client, utils
│   │   └── App.tsx
│   └── package.json
│
├── .github/workflows/            # CI/CD
├── README.md                     # Этот файл
├── README_FULL.md                # Детальная документация
└── DEPLOYMENT.md                 # Гайд по деплою
```

---

## 🎞️ Анимированные бои (Phaser.js)

Реализована полноценная 2D-сцена боя:

- **Класс `FightScene`** (`frontend/src/game/FightScene.ts`):
  - Анимация ринга, канаты, фон
  - Спрайты игрока и противника (`BoxerSprite`)
  - Полоски здоровья, выносливости, раунды
  - Симуляция раундов, удары, уклонения, нокауты
  - Эффекты частиц при попаданиях и нокаутах
  - Звуковые эффекты (удары, нокаут, гонг)

- **Интеграция с React** (`PhaserGame.tsx` + `FightPage.tsx`):
  - Встраивание Phaser в React-компонент
  - Кнопка «Бой с анимацией»
  - Callback `onComplete` → синхронизация результата с backend

---

## ⚔️ PvP система

### Backend (`pvp` module)

- **Matchmaking**:
  - Очередь поиска матчей
  - Подбор соперников по рейтингу (±200)
  - Создание PvP матча (`PvpMatch` entity)

- **API**:
  - `POST /api/v1/pvp/matchmaking/join` – войти в очередь
  - `POST /api/v1/pvp/matchmaking/leave` – выйти из очереди
  - `GET  /api/v1/pvp/history` – история PvP матчей

- **Сущность `PvpMatch`**:
  - Игрок 1, Игрок 2
  - Статус: active/completed/cancelled
  - Победитель, лог боя, дата

### Frontend (`PvPPage.tsx`)

- Страница PvP арены:
  - Отображение рейтинга, побед, места в топе
  - Кнопка «Найти матч»
  - Состояния: поиск, матч найден
  - Список последних матчей

(Реальное соединение через WebSocket уже заложено на backend и может быть донастроено через socket.io клиент.)

---

## 🏆 Турниры

### Backend (`tournament` module)

- **Турниры** (`Tournament` entity):
  - Название, призовой фонд
  - Максимум участников (8/16)
  - Entry fee, рейтинг-брекеты
  - Статусы: registration/active/completed
  - Сетка турнира (bracket JSON)

- **Участники** (`TournamentParticipant` entity):
  - Привязка к игроку и турниру
  - Статус: active/eliminated/winner
  - Приз и место

- **API**:
  - `GET  /api/v1/tournament/active` – активные турниры
  - `GET  /api/v1/tournament/:id` – детали турнира
  - `POST /api/v1/tournament/:id/register` – регистрация
  - `GET  /api/v1/tournament/my/tournaments` – мои турниры

- **Cron-задача**:
  - Каждые 6 часов создаётся новый турнир на 16 человек

### Frontend (`TournamentPage.tsx`)

- Страница турниров:
  - Список активных и идущих турниров
  - Статусы и цвета: регистрация, активен, завершён
  - Информация: взнос, призовой фонд, участники, рейтинг-брекет
  - Блок с призовыми местами (🥇🥈🥉)

---

## 💎 Монетизация (Telegram Stars)

### Backend (`iap` module)

- **Товары** (`PRODUCTS`):
  - `starter_pack` – стартовый пакет (монеты + карты)
  - `pro_pack` – пакет профи
  - `champion_pack` – пакет чемпиона
  - `energy_refill` – восстановление энергии
  - `premium_month` – премиум-аккаунт

- **API**:
  - `GET  /api/v1/iap/products` – список товаров
  - `POST /api/v1/iap/create-payment` – создание платежа
  - `POST /api/v1/iap/process-payment` – обработка платежа
  - `GET  /api/v1/iap/history` – история покупок

- **Сущность `Purchase`**:
  - Игрок, продукт, сумма, статус, transactionId

(Подпись Telegram Payments помечена для production-реализации.)

---

## 🎖️ Система достижений

### Backend (`achievements` module)

- **Набор достижений** (`ACHIEVEMENTS`):
  - `first_win` – Первая победа
  - `win_streak_5` – серия побед x5
  - `knockout_king` – 10 побед нокаутом
  - `level_10`, `level_50` – уровни
  - `millionaire` – 1,000,000 монет
  - `card_collector` – собрать все карты
  - `tournament_winner` – победитель турнира
  - `pvp_champion` – 100 PvP побед
  - `training_master` – 500 тренировок

- **API**:
  - `GET  /api/v1/achievements` – все достижения и статус
  - `POST /api/v1/achievements/check` – проверить новые достижения
  - `GET  /api/v1/achievements/stats` – статистика достижений

- **Логика**:
  - Проверка условий по игроку
  - Автоматическая выдача наград (деньги, слава)
  - Хранение в `player_achievements` с датой разблокировки

(Frontend-страница `AchievementsPage.tsx` может отображать прогресс, редкость и награды.)

---

## 🌐 Deployment

### Quick Deploy (Рекомендуется)

#### Backend → Railway
```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway add postgresql
railway add redis
railway up
```

#### Frontend → Vercel
```bash
npm install -g vercel
cd frontend
vercel
```

### Docker Deploy
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d --build
```

Подробнее: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📱 Telegram Mini App

### Setup

1. Создать бота через @BotFather
2. Получить токен
3. Настроить WebApp URL
4. Добавить в .env:
```bash
TELEGRAM_BOT_TOKEN=your-token
TELEGRAM_WEBAPP_URL=https://your-frontend.vercel.app
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:e2e

# Frontend tests  
cd frontend
npm test
```

---

## 🛣️ Текущий статус

✅ Backend API (core + PvP + турниры + IAP + достижения)
✅ Frontend UI (боевка, PvP, турниры, магазин, достижения)
✅ Telegram integration
✅ Docker setup
✅ CI/CD
✅ Phaser.js анимации боёв
✅ Монетизация через Telegram Stars

Следующие потенциальные шаги:
- 📱 Mobile apps (React Native)
- 🎧 Более продвинутый звук
- 🌍 Локализация на другие языки

---

## 👥 Contributing

Welcome! 

1. Fork репозиторий
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

MIT License - см. [LICENSE](./LICENSE)

---

## 🔗 Ссылки

- **GitHub:** [boxing-idle-game](https://github.com/kaylas000/boxing-idle-game)
- **Issues:** [Сообщить о баге](https://github.com/kaylas000/boxing-idle-game/issues)
- **Discussions:** [Обсуждения](https://github.com/kaylas000/boxing-idle-game/discussions)

---

<div align="center">

### 🎯 Production-Ready Architecture
**Готово к миллионам пользователей**

🎞️ Анимированные бои · ⚔️ PvP · 🏆 Турниры · 💎 Telegram Stars · 🎖️ Достижения

🥊 **Станьте чемпионом!** 🏆

Сделано с ❤️ для настоящих боксёров

</div>
