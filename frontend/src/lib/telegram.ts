import { initData, viewport, themeParams } from '@telegram-apps/sdk';

export function initTelegramSDK() {
  try {
    // Инициализация Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Настройка темы
      if (tg.themeParams.bg_color) {
        document.body.style.backgroundColor = tg.themeParams.bg_color;
      }
      
      console.log('Telegram WebApp инициализирован');
    }
  } catch (error) {
    console.log('Запуск не в Telegram, используется режим разработки');
  }
}

export function getTelegramUser() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}
