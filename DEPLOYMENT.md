# 🚀 Deployment Guide

## Варианты деплоя

### Вариант 1: Quick Deploy (Рекомендуется для начала)

#### Backend → Railway/Render

**Railway:**
```bash
# 1. Установить Railway CLI
npm install -g @railway/cli

# 2. Войти
railway login

# 3. Инициализировать проект
cd backend
railway init

# 4. Добавить PostgreSQL
railway add postgresql

# 5. Добавить Redis  
railway add redis

# 6. Deploy
railway up

# 7. Настроить переменные окружения
railway variables set JWT_SECRET=your-secret-key
```

**Render:**
1. Создать новый Web Service
2. Подключить GitHub репозиторий
3. Build Command: `cd backend && npm install && npm run build`
4. Start Command: `cd backend && npm run start:prod`
5. Добавить PostgreSQL и Redis в Dashboard

#### Frontend → Vercel/Netlify

**Vercel:**
```bash
# 1. Установить Vercel CLI
npm install -g vercel

# 2. Deploy
cd frontend
vercel

# 3. Настроить environment variables
vercel env add VITE_API_URL production
```

**Netlify:**
1. Подключить GitHub
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`
4. Environment variables: `VITE_API_URL`

---

### Вариант 2: Docker Deploy (Production)

#### Все сервисы в Docker

```bash
# 1. Создать production docker-compose
cp docker-compose.yml docker-compose.prod.yml

# 2. Редактировать для продакшена
# - Убрать volume маппинги исходников
# - Добавить health checks
# - Настроить networks
# - Добавить restart: always

# 3. Build и deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      REDIS_HOST: redis
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${API_URL}
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:

networks:
  default:
    driver: bridge
```

---

### Вариант 3: Kubernetes (Для масштабирования)

```bash
# 1. Создать Kubernetes манифесты
kubectl create namespace boxing-game

# 2. Deploy PostgreSQL
kubectl apply -f k8s/postgres.yaml

# 3. Deploy Redis
kubectl apply -f k8s/redis.yaml

# 4. Deploy Backend
kubectl apply -f k8s/backend.yaml

# 5. Deploy Frontend
kubectl apply -f k8s/frontend.yaml

# 6. Настроить Ingress
kubectl apply -f k8s/ingress.yaml
```

---

## Telegram Bot Setup

### 1. Создать бота
```
1. Открыть @BotFather в Telegram
2. /newbot
3. Выбрать имя: Boxing Champion Bot
4. Выбрать username: boxing_champion_bot
5. Получить токен: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 2. Настроить WebApp
```
1. /mybots → выбрать бота
2. Bot Settings → Menu Button
3. Configure Menu Button
4. Вставить URL: https://your-frontend.vercel.app
```

### 3. Настроить команды
```
/setcommands
start - Начать игру
help - Помощь
profile - Мой профиль
shop - Магазин
```

---

## Environment Variables

### Backend (.env)
```bash
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USERNAME=boxing_user
DB_PASSWORD=strong-password-here
DB_DATABASE=boxing_game

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis-password

# JWT
JWT_SECRET=super-secret-jwt-key-256-bits
JWT_EXPIRATION=7d

# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_WEBAPP_URL=https://your-frontend.vercel.app

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend.railway.app/api/v1
```

---

## SSL/HTTPS Setup

### Certbot (Let's Encrypt)
```bash
# 1. Установить certbot
sudo apt install certbot python3-certbot-nginx

# 2. Получить сертификат
sudo certbot --nginx -d api.yourdomain.com

# 3. Авто-обновление
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### PM2 (для Node.js)
```bash
# 1. Установить PM2
npm install -g pm2

# 2. Запустить приложение
cd backend
pm2 start dist/main.js --name boxing-backend

# 3. Мониторинг
pm2 monit

# 4. Логи
pm2 logs boxing-backend

# 5. Авто-запуск при перезагрузке
pm2 startup
pm2 save
```

### Логирование
```bash
# Winston для логов
npm install winston

# Настроить в main.ts:
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const app = await NestFactory.create(AppModule, {
  logger: WinstonModule.createLogger({
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  }),
});
```

---

## Performance Optimization

### 1. Database Indexing
```sql
-- Добавить индексы
CREATE INDEX idx_players_telegram_id ON players(telegram_id);
CREATE INDEX idx_players_rating ON players(rating DESC);
CREATE INDEX idx_fight_history_player ON fight_history(player_id);
```

### 2. Redis Caching
```typescript
// Кэшировать лидерборд
@Injectable()
export class LeaderboardService {
  async getLeaderboard() {
    const cached = await this.redis.get('leaderboard');
    if (cached) return JSON.parse(cached);
    
    const leaderboard = await this.calculateLeaderboard();
    await this.redis.set('leaderboard', JSON.stringify(leaderboard), 'EX', 300);
    return leaderboard;
  }
}
```

### 3. CDN для статики
```bash
# Использовать Cloudflare для frontend
# Или AWS CloudFront
```

---

## Backup Strategy

### PostgreSQL Backups
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILE="$BACKUP_DIR/boxing_game_$DATE.sql"

pg_dump -h localhost -U boxing_user boxing_game > $FILE
gzip $FILE

# Удалить старые (>7 дней)
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
```

### Cron Job
```bash
# Бэкап каждый день в 2:00
0 2 * * * /path/to/backup.sh
```

---

## Security Checklist

- [ ] Все пароли в environment variables
- [ ] HTTPS на всех доменах
- [ ] Rate limiting включен
- [ ] CORS настроен правильно
- [ ] JWT secret длинный и случайный
- [ ] Database credentials сложные
- [ ] Firewall настроен (только 80, 443, 22)
- [ ] SSH only с ключами
- [ ] Updates автоматические
- [ ] Логи защищены
- [ ] Backups зашифрованы

---

**Готово к деплою! 🚀**
