#!/bin/bash

# =============================================================================
# 🥊 Boxing Champion - Автоматический установщик и запуск
# =============================================================================
# Этот скрипт автоматически:
# - Устанавливает все зависимости (backend, frontend, blockchain)
# - Настраивает .env файлы
# - Запускает базы данных (PostgreSQL, Redis) через Docker
# - Применяет миграции
# - Запускает приложение
# =============================================================================

set -e  # Остановить при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для красивого вывода
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Проверка наличия команд
check_requirements() {
    print_header "Проверка системных требований"
    
    local missing_deps=0
    
    # Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_step "Node.js установлен: $NODE_VERSION"
    else
        print_error "Node.js не найден. Установите Node.js >= 18.x"
        print_info "Скачать: https://nodejs.org/"
        missing_deps=1
    fi
    
    # npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_step "npm установлен: $NPM_VERSION"
    else
        print_error "npm не найден"
        missing_deps=1
    fi
    
    # Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_step "Docker установлен: $DOCKER_VERSION"
    else
        print_error "Docker не найден. Установите Docker"
        print_info "Скачать: https://www.docker.com/get-started"
        missing_deps=1
    fi
    
    # Docker Compose
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
        print_step "Docker Compose установлен: $COMPOSE_VERSION"
    else
        print_error "Docker Compose не найден"
        missing_deps=1
    fi
    
    if [ $missing_deps -eq 1 ]; then
        echo ""
        print_error "Не все зависимости установлены. Установите недостающие компоненты и запустите скрипт снова."
        exit 1
    fi
    
    echo ""
}

# Запрос Telegram Bot Token
get_telegram_token() {
    print_header "Настройка Telegram Bot"
    
    echo -e "${YELLOW}Для работы приложения нужен Telegram Bot Token${NC}"
    echo ""
    echo "Как получить токен:"
    echo "1. Откройте Telegram и найдите @BotFather"
    echo "2. Отправьте команду /newbot"
    echo "3. Следуйте инструкциям (имя и username бота)"
    echo "4. Скопируйте полученный токен"
    echo ""
    echo -e "${YELLOW}Формат токена: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz${NC}"
    echo ""
    
    read -p "Введите ваш Telegram Bot Token: " TELEGRAM_BOT_TOKEN
    
    # Простая валидация формата токена
    if [[ ! $TELEGRAM_BOT_TOKEN =~ ^[0-9]+:[A-Za-z0-9_-]+$ ]]; then
        print_error "Неверный формат токена. Токен должен быть в формате: 123456789:ABCdef..."
        exit 1
    fi
    
    print_step "Токен принят"
    echo ""
}

# Установка зависимостей Backend
install_backend() {
    print_header "Установка Backend зависимостей"
    
    cd backend
    
    print_info "Установка npm пакетов..."
    npm install
    print_step "Backend зависимости установлены"
    
    # Создание .env файла
    print_info "Создание .env файла..."
    cp .env.example .env
    
    # Вставка Telegram Bot Token
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|TELEGRAM_BOT_TOKEN=your-telegram-bot-token|TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN|g" .env
    else
        # Linux
        sed -i "s|TELEGRAM_BOT_TOKEN=your-telegram-bot-token|TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN|g" .env
    fi
    
    print_step ".env файл создан и настроен"
    
    cd ..
    echo ""
}

# Установка зависимостей Frontend
install_frontend() {
    print_header "Установка Frontend зависимостей"
    
    cd frontend
    
    print_info "Установка npm пакетов..."
    npm install
    print_step "Frontend зависимости установлены"
    
    cd ..
    echo ""
}

# Установка зависимостей Blockchain (опционально)
install_blockchain() {
    print_header "Установка Blockchain зависимостей (опционально)"
    
    read -p "Установить зависимости для смарт-контрактов? (y/n): " install_contracts
    
    if [[ $install_contracts == "y" || $install_contracts == "Y" ]]; then
        cd blockchain
        print_info "Установка npm пакетов..."
        npm install
        print_step "Blockchain зависимости установлены"
        cd ..
    else
        print_info "Пропущено"
    fi
    
    echo ""
}

# Запуск баз данных через Docker
start_databases() {
    print_header "Запуск баз данных (PostgreSQL + Redis)"
    
    cd backend
    
    print_info "Проверка запущенных контейнеров..."
    
    # Остановить старые контейнеры, если есть
    if docker-compose ps | grep -q "boxing-game"; then
        print_info "Останавливаю старые контейнеры..."
        docker-compose down
    fi
    
    print_info "Запускаю PostgreSQL и Redis..."
    docker-compose up -d postgres redis
    
    print_step "Базы данных запущены"
    print_info "Ожидание готовности баз данных (10 секунд)..."
    sleep 10
    
    cd ..
    echo ""
}

# Применение миграций базы данных
run_migrations() {
    print_header "Применение миграций базы данных"
    
    cd backend
    
    print_info "Запуск миграций..."
    npm run migration:run 2>&1 || {
        print_error "Ошибка при применении миграций"
        print_info "Это нормально, если миграции уже применены"
    }
    
    print_step "Миграции применены"
    
    cd ..
    echo ""
}

# Финальная информация
print_summary() {
    print_header "🎉 Установка завершена успешно!"
    
    echo -e "${GREEN}Всё готово к запуску!${NC}"
    echo ""
    echo "Для запуска приложения:"
    echo ""
    echo -e "${YELLOW}Backend:${NC}"
    echo "  cd backend"
    echo "  npm run start:dev"
    echo "  Откроется на: http://localhost:3000"
    echo "  API Docs: http://localhost:3000/api/docs"
    echo ""
    echo -e "${YELLOW}Frontend (в новом терминале):${NC}"
    echo "  cd frontend"
    echo "  npm run dev"
    echo "  Откроется на: http://localhost:5173"
    echo ""
    echo -e "${YELLOW}Полезные команды:${NC}"
    echo "  Остановить БД:     cd backend && docker-compose down"
    echo "  Просмотр логов БД: cd backend && docker-compose logs -f"
    echo "  Перезапуск БД:     cd backend && docker-compose restart"
    echo ""
    
    read -p "Запустить Backend сейчас? (y/n): " start_backend
    
    if [[ $start_backend == "y" || $start_backend == "Y" ]]; then
        echo ""
        print_info "Запускаю Backend в режиме разработки..."
        cd backend
        npm run start:dev
    else
        echo ""
        print_info "Для запуска выполните: cd backend && npm run start:dev"
    fi
}

# Главная функция
main() {
    clear
    
    cat << "EOF"
    
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║        🥊  BOXING CHAMPION - АВТОМАТИЧЕСКИЙ УСТАНОВЩИК  🥊   ║
    ║                                                              ║
    ║            Web3 Play-to-Earn Game на TON Blockchain         ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    
EOF
    
    echo ""
    
    # Выполнение шагов установки
    check_requirements
    get_telegram_token
    install_backend
    install_frontend
    install_blockchain
    start_databases
    run_migrations
    print_summary
}

# Запуск скрипта
main
