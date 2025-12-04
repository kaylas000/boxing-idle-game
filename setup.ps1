# =============================================================================
# 🥊 Boxing Champion - Автоматический установщик (Windows PowerShell)
# =============================================================================
# Этот скрипт автоматически:
# - Устанавливает все зависимости (backend, frontend, blockchain)
# - Настраивает .env файлы
# - Запускает базы данных (PostgreSQL, Redis) через Docker
# - Применяет миграции
# - Запускает приложение
# =============================================================================

$ErrorActionPreference = "Stop"

# Цвета для вывода
function Write-Header {
    param($Message)
    Write-Host "`n" -NoNewline
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Blue
    Write-Host ""
}

function Write-Step {
    param($Message)
    Write-Host "✓ " -ForegroundColor Green -NoNewline
    Write-Host $Message
}

function Write-Info {
    param($Message)
    Write-Host "ℹ " -ForegroundColor Yellow -NoNewline
    Write-Host $Message
}

function Write-Error-Custom {
    param($Message)
    Write-Host "✗ " -ForegroundColor Red -NoNewline
    Write-Host $Message
}

# Проверка системных требований
function Check-Requirements {
    Write-Header "Проверка системных требований"
    
    $missing = $false
    
    # Node.js
    try {
        $nodeVersion = node --version
        Write-Step "Node.js установлен: $nodeVersion"
    } catch {
        Write-Error-Custom "Node.js не найден. Установите Node.js >= 18.x"
        Write-Info "Скачать: https://nodejs.org/"
        $missing = $true
    }
    
    # npm
    try {
        $npmVersion = npm --version
        Write-Step "npm установлен: $npmVersion"
    } catch {
        Write-Error-Custom "npm не найден"
        $missing = $true
    }
    
    # Docker
    try {
        $dockerVersion = docker --version
        Write-Step "Docker установлен: $dockerVersion"
    } catch {
        Write-Error-Custom "Docker не найден. Установите Docker Desktop"
        Write-Info "Скачать: https://www.docker.com/products/docker-desktop"
        $missing = $true
    }
    
    # Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Step "Docker Compose установлен: $composeVersion"
    } catch {
        Write-Error-Custom "Docker Compose не найден"
        $missing = $true
    }
    
    if ($missing) {
        Write-Host ""
        Write-Error-Custom "Не все зависимости установлены. Установите недостающие компоненты и запустите скрипт снова."
        exit 1
    }
    
    Write-Host ""
}

# Запрос Telegram Bot Token
function Get-TelegramToken {
    Write-Header "Настройка Telegram Bot"
    
    Write-Host "Для работы приложения нужен Telegram Bot Token" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Как получить токен:"
    Write-Host "1. Откройте Telegram и найдите @BotFather"
    Write-Host "2. Отправьте команду /newbot"
    Write-Host "3. Следуйте инструкциям (имя и username бота)"
    Write-Host "4. Скопируйте полученный токен"
    Write-Host ""
    Write-Host "Формат токена: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz" -ForegroundColor Yellow
    Write-Host ""
    
    $token = Read-Host "Введите ваш Telegram Bot Token"
    
    # Простая валидация формата токена
    if ($token -notmatch "^[0-9]+:[A-Za-z0-9_-]+$") {
        Write-Error-Custom "Неверный формат токена. Токен должен быть в формате: 123456789:ABCdef..."
        exit 1
    }
    
    Write-Step "Токен принят"
    Write-Host ""
    
    return $token
}

# Установка зависимостей Backend
function Install-Backend {
    param($TelegramToken)
    
    Write-Header "Установка Backend зависимостей"
    
    Set-Location backend
    
    Write-Info "Установка npm пакетов..."
    npm install
    Write-Step "Backend зависимости установлены"
    
    # Создание .env файла
    Write-Info "Создание .env файла..."
    Copy-Item .env.example .env
    
    # Вставка Telegram Bot Token
    (Get-Content .env) -replace 'TELEGRAM_BOT_TOKEN=your-telegram-bot-token', "TELEGRAM_BOT_TOKEN=$TelegramToken" | Set-Content .env
    
    Write-Step ".env файл создан и настроен"
    
    Set-Location ..
    Write-Host ""
}

# Установка зависимостей Frontend
function Install-Frontend {
    Write-Header "Установка Frontend зависимостей"
    
    Set-Location frontend
    
    Write-Info "Установка npm пакетов..."
    npm install
    Write-Step "Frontend зависимости установлены"
    
    Set-Location ..
    Write-Host ""
}

# Установка зависимостей Blockchain (опционально)
function Install-Blockchain {
    Write-Header "Установка Blockchain зависимостей (опционально)"
    
    $install = Read-Host "Установить зависимости для смарт-контрактов? (y/n)"
    
    if ($install -eq "y" -or $install -eq "Y") {
        Set-Location blockchain
        Write-Info "Установка npm пакетов..."
        npm install
        Write-Step "Blockchain зависимости установлены"
        Set-Location ..
    } else {
        Write-Info "Пропущено"
    }
    
    Write-Host ""
}

# Запуск баз данных через Docker
function Start-Databases {
    Write-Header "Запуск баз данных (PostgreSQL + Redis)"
    
    Set-Location backend
    
    Write-Info "Проверка запущенных контейнеров..."
    
    # Остановить старые контейнеры, если есть
    $containers = docker-compose ps -q
    if ($containers) {
        Write-Info "Останавливаю старые контейнеры..."
        docker-compose down
    }
    
    Write-Info "Запускаю PostgreSQL и Redis..."
    docker-compose up -d postgres redis
    
    Write-Step "Базы данных запущены"
    Write-Info "Ожидание готовности баз данных (10 секунд)..."
    Start-Sleep -Seconds 10
    
    Set-Location ..
    Write-Host ""
}

# Применение миграций базы данных
function Run-Migrations {
    Write-Header "Применение миграций базы данных"
    
    Set-Location backend
    
    Write-Info "Запуск миграций..."
    try {
        npm run migration:run
        Write-Step "Миграции применены"
    } catch {
        Write-Error-Custom "Ошибка при применении миграций"
        Write-Info "Это нормально, если миграции уже применены"
    }
    
    Set-Location ..
    Write-Host ""
}

# Финальная информация
function Show-Summary {
    Write-Header "🎉 Установка завершена успешно!"
    
    Write-Host "Всё готово к запуску!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Для запуска приложения:"
    Write-Host ""
    Write-Host "Backend:" -ForegroundColor Yellow
    Write-Host "  cd backend"
    Write-Host "  npm run start:dev"
    Write-Host "  Откроется на: http://localhost:3000"
    Write-Host "  API Docs: http://localhost:3000/api/docs"
    Write-Host ""
    Write-Host "Frontend (в новом терминале):" -ForegroundColor Yellow
    Write-Host "  cd frontend"
    Write-Host "  npm run dev"
    Write-Host "  Откроется на: http://localhost:5173"
    Write-Host ""
    Write-Host "Полезные команды:" -ForegroundColor Yellow
    Write-Host "  Остановить БД:     cd backend; docker-compose down"
    Write-Host "  Просмотр логов БД: cd backend; docker-compose logs -f"
    Write-Host "  Перезапуск БД:     cd backend; docker-compose restart"
    Write-Host ""
    
    $startBackend = Read-Host "Запустить Backend сейчас? (y/n)"
    
    if ($startBackend -eq "y" -or $startBackend -eq "Y") {
        Write-Host ""
        Write-Info "Запускаю Backend в режиме разработки..."
        Set-Location backend
        npm run start:dev
    } else {
        Write-Host ""
        Write-Info "Для запуска выполните: cd backend; npm run start:dev"
    }
}

# Главная функция
function Main {
    Clear-Host
    
    Write-Host @"

    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║        🥊  BOXING CHAMPION - АВТОМАТИЧЕСКИЙ УСТАНОВЩИК  🥊   ║
    ║                                                              ║
    ║            Web3 Play-to-Earn Game на TON Blockchain         ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    
"@
    
    # Выполнение шагов установки
    Check-Requirements
    $token = Get-TelegramToken
    Install-Backend -TelegramToken $token
    Install-Frontend
    Install-Blockchain
    Start-Databases
    Run-Migrations
    Show-Summary
}

# Запуск скрипта
Main
