# 🚀 Быстрый старт - Boxing Champion

> **Автоматическая установка и запуск проекта за 5 минут!**

---

## 📌 Предварительные требования

Перед запуском скрипта установите:

### Для всех операционных систем:

1. **Node.js >= 18.x**  
   Скачать: https://nodejs.org/

2. **Docker Desktop**  
   Скачать: https://www.docker.com/products/docker-desktop

3. **Telegram Bot Token**  
   - Откройте Telegram и найдите @BotFather
   - Отправьте `/newbot`
   - Следуйте инструкциям и получите токен
   - Формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

---

## 🐧 Linux / macOS - Автоматическая установка

### Шаг 1: Клонировать репозиторий

```bash
git clone https://github.com/kaylas000/boxing-idle-game.git
cd boxing-idle-game
```

### Шаг 2: Запустить скрипт установки

```bash
chmod +x setup.sh
./setup.sh
```

### 🎯 Что происходит автоматически:

✅ Проверка системных требований (Node.js, npm, Docker)  
✅ Запрос Telegram Bot Token  
✅ Установка **backend** зависимостей (`npm install`)  
✅ Создание `.env` файла с вашим токеном  
✅ Установка **frontend** зависимостей  
✅ Установка **blockchain** зависимостей (опционально)  
✅ Запуск **PostgreSQL** и **Redis** через Docker  
✅ Применение миграций базы данных  
✅ Предложение запустить backend  

### Шаг 3: Запустить frontend (в новом терминале)

```bash
cd frontend
npm run dev
```

### 🎉 Готово!

- **Backend API**: http://localhost:3000
- **API Docs (Swagger)**: http://localhost:3000/api/docs
- **Frontend**: http://localhost:5173

---

## 💻 Windows - Автоматическая установка

### Шаг 1: Клонировать репозиторий

```powershell
git clone https://github.com/kaylas000/boxing-idle-game.git
cd boxing-idle-game
```

### Шаг 2: Запустить PowerShell от имени администратора

Правый клик по PowerShell → "Запустить от имени администратора"

### Шаг 3: Разрешить выполнение скриптов (если ещё не разрешено)

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Шаг 4: Запустить скрипт установки

```powershell
.\setup.ps1
```

### 🎯 Что происходит автоматически:

Те же шаги, что и в Linux/macOS версии.

### Шаг 5: Запустить frontend (в новом окне PowerShell)

```powershell
cd frontend
npm run dev
```

### 🎉 Готово!

- **Backend API**: http://localhost:3000
- **API Docs (Swagger)**: http://localhost:3000/api/docs
- **Frontend**: http://localhost:5173

---

## 🛠️ Полезные команды

### Управление базами данных

```bash
# Остановить БД
cd backend
docker-compose down

# Запустить БД
docker-compose up -d postgres redis

# Перезапустить БД
docker-compose restart

# Просмотр логов
docker-compose logs -f postgres
docker-compose logs -f redis

# Очистить всё (удалить данные)
docker-compose down -v
```

### Миграции базы данных

```bash
cd backend

# Применить миграции
npm run migration:run

# Откатить последнюю миграцию
npm run migration:revert

# Сгенерировать новую миграцию
npm run migration:generate -- -n MigrationName
```

### Запуск приложения

```bash
# Backend разработка (hot reload)
cd backend
npm run start:dev

# Backend production
cd backend
npm run build
npm run start:prod

# Frontend разработка
cd frontend
npm run dev

# Frontend production build
cd frontend
npm run build
npm run preview
```

### Тестирование

```bash
# Backend тесты
cd backend
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

### Деплой смарт-контрактов

```bash
cd blockchain

# Компиляция
npm run compile

# Тестирование
npm run test

# Деплой в testnet
npm run deploy:testnet

# Деплой в mainnet
npm run deploy:mainnet
```

---

## ⚠️ Решение проблем

### Проблема: Docker контейнеры не запускаются

**Решение:**
```bash
# Убедитесь, что Docker Desktop запущен
docker ps

# Если ошибка, перезапустите Docker Desktop
```

### Проблема: Ошибка при `npm install`

**Решение:**
```bash
# Очистить кэш
npm cache clean --force

# Удалить node_modules и переустановить
rm -rf node_modules package-lock.json
npm install
```

### Проблема: Не могу подключиться к PostgreSQL

**Решение:**
```bash
# Проверить статус контейнера
cd backend
docker-compose ps

# Просмотреть логи
docker-compose logs postgres

# Перезапустить
docker-compose restart postgres
```

### Проблема: Порт уже занят

**Решение:**
```bash
# Найти процесс, занимающий порт 3000
# Linux/macOS:
lsof -i :3000

# Windows:
netstat -ano | findstr :3000

# Убить процесс или изменить порт в backend/.env
```

### Проблема: Telegram Bot не отвечает

**Решение:**
```bash
# 1. Проверить токен в backend/.env
cat backend/.env | grep TELEGRAM_BOT_TOKEN

# 2. Проверить, что backend запущен
curl http://localhost:3000/api/v1/health

# 3. Проверить логи backend
cd backend
npm run start:dev
```

---

## 📚 Дополнительная документация

- [README.md](./README.md) - Полное описание проекта
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Руководство по деплою
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура приложения
- [TON_INTEGRATION.md](./TON_INTEGRATION.md) - Интеграция с TON blockchain

---

## ✨ Что дальше?

После успешного запуска:

1. 👨‍💻 **Ознакомьтесь с API**  
   Откройте http://localhost:3000/api/docs для Swagger UI

2. 🎮 **Протестируйте игру**  
   Откройте http://localhost:5173 в браузере

3. 🛠️ **Изучите код**  
   Просмотрите `backend/src/modules/` для игровой логики

4. 🚀 **Деплой**  
   Смотрите [DEPLOYMENT.md](./DEPLOYMENT.md) для production развертывания

---

## 👥 Поддержка

Если возникли проблемы:

- 🐛 **Issues**: https://github.com/kaylas000/boxing-idle-game/issues
- 💬 **Telegram**: [@boxing_champion](https://t.me/boxing_champion)

---

**🥊 Made with ❤️ by the Boxing Champion Team**

⭐ **Star us on GitHub** - it motivates us to make the game even better!
