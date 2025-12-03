import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Swords, CreditCard, User, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: 'Главная' },
  { path: '/training', icon: Dumbbell, label: 'Тренировки' },
  { path: '/fight', icon: Swords, label: 'Бои' },
  { path: '/cards', icon: CreditCard, label: 'Карты' },
  { path: '/leaderboard', icon: Trophy, label: 'Рейтинг' },
  { path: '/profile', icon: User, label: 'Профиль' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto pb-24">
        <Outlet />
      </div>

      {/* Навигация */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-lg border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-6 gap-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors hover:bg-dark-700"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-red-500/20 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 mb-1 relative z-10 ${
                      isActive ? 'text-red-500' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs relative z-10 ${
                      isActive ? 'text-red-500 font-semibold' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
