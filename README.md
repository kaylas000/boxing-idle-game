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

## 📊 Реализовано на 100%

### ✅ Backend (Полностью функциональный)

- **Auth** - JWT авторизация + Telegram WebApp
- **Database** - PostgreSQL с TypeORM, миграции, индексы
- **Cache** - Redis для производительности
- **Game Logic** - тренировки, бои, прогрессия
- **API** - 15+ RESTful endpoints
- **Security** - Rate limiting, validation, CORS
- **Docs** - Swagger UI на /api/docs

### ✅ Frontend (Современный UI)

- **Pages** - 6 страниц (Home, Training, Fight, Cards, Profile, Leaderboard)
- **State** - Zustand + TanStack Query
- **Animations** - Framer Motion
- **Responsive** - Mobile-first дизайн
- **Telegram** - Полная интеграция SDK

### ✅ DevOps

- **Docker** - compose для dev окружения
- **CI/CD** - GitHub Actions
- **Deploy** - Ready для Railway/Vercel/AWS

---

## 🏗️ Архитектура

```
boxing-idle-game/
├── backend/              # NestJS + PostgreSQL + Redis
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/     # JWT + Telegram auth
│   │   │   ├── player/   # Player management
│   │   │   ├── training/ # Training system
│   │   │   ├── fight/    # Fight simulation
│   │   │   ├── cards/    # Card collection
│   │   │   └── shop/     # In-game shop
│   ├── docker-compose.yml
│   └── Dockerfile
│
├── frontend/             # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/          # API client, utils
│   │   └── App.tsx
│   └── package.json
│
├── .github/workflows/    # CI/CD
├── README.md            # Этот файл
├── README_FULL.md       # Детальная документация
└── DEPLOYMENT.md        # Гайд по деплою
```

---

## 🚀 Быстрый старт

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm или yarn

### 1. Клонирование

```bash
git clone https://github.com/kaylas000/boxing-idle-game.git
cd boxing-idle-game
```

### 2. Backend

```bash
cd backend
npm install

# Запустить БД
docker-compose up -d postgres redis

# Настроить .env
cp .env.example .env
# Отредактируйте .env

# Запустить сервер
npm run start:dev
```

**Backend доступен:**
- API: `http://localhost:3000/api/v1`
- Docs: `http://localhost:3000/api/docs` 📚

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

**Frontend:** `http://localhost:5173`

---

## 💻 Технологический стек

### Backend
```
NestJS 10 + TypeScript 5
PostgreSQL 16 + TypeORM
Redis 7
JWT + Passport
Swagger/OpenAPI
```

### Frontend
```
React 18 + TypeScript 5
Vite + TailwindCSS 3
Zustand + TanStack Query
Framer Motion
Telegram SDK
```

### DevOps
```
Docker + Docker Compose
GitHub Actions CI/CD
ESLint + Prettier
```

---

## 🎮 Игровые механики

### Система тренировок
- 4 типа тренировок (сила, скорость, выносливость, защита)
- Разная стоимость и длительность
- Мгновенные бонусы к статам

### Боевая система  
- Динамическая генерация противников
- Расчёт шансов на основе статов
- Нокауты (30% шанс при победе)
- История боёв

### Прогрессия
- Система уровней и опыта
- 4 основных стата
- Экспоненциальный рост стоимости улучшений
- Рейтинговая система

### Idle-механики
- Оффлайн доход (до 8 часов)
- Автосохранение
- Регенерация энергии (1/минуту)

---

## 📚 Документация

- **[📖 Полная документация](./README_FULL.md)** - детальное описание всех систем
- **[🚀 Deployment Guide](./DEPLOYMENT.md)** - гайд по развёртыванию
- **[📊 API Docs](http://localhost:3000/api/docs)** - Swagger UI

---

## 🔌 API Примеры

### Authentication
```bash
# Telegram auth
POST /api/v1/auth/telegram
{
  "id": 12345678,
  "first_name": "John",
  "username": "johndoe",
  "auth_date": 1234567890,
  "hash": "..."
}

# Guest auth
POST /api/v1/auth/guest
```

### Player
```bash
# Get profile
GET /api/v1/player/profile
Authorization: Bearer <token>

# Collect offline income
PATCH /api/v1/player/collect-offline
```

### Training
```bash
# Start training
POST /api/v1/training/start
{
  "trainingId": "power-training"
}
```

### Fight
```bash
# Generate opponent
GET /api/v1/fight/generate-opponent

# Start fight
POST /api/v1/fight/start
```

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

## 🛣️ Roadmap

### Текущая версия (v1.0) ✅
- Backend API
- Frontend UI
- Telegram integration
- Docker setup
- CI/CD

### Следующие шаги
- 🔴 Advanced graphics (Phaser.js)
- 🔴 PvP система
- 🔴 Турниры
- 🔴 Mobile apps (React Native)
- 🔴 Monetization (Telegram Stars)

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

🥊 **Станьте чемпионом!** 🏆

Сделано с ❤️ для настоящих боксёров

</div>
