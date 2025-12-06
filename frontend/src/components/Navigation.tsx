import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Dumbbell,
  Fist,
  LayoutGrid,
  User,
  Trophy,
  Zap,
  Gift,
} from 'lucide-react';
import { QuestsBadge } from './QuestsBadge';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Dumbbell, label: 'Training', path: '/training' },
    { icon: Fist, label: 'Fight', path: '/fight' },
    { icon: LayoutGrid, label: 'Cards', path: '/cards' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    // NEW ITEMS - Added December 6, 2025
    { icon: Zap, label: 'Quests', path: '/quests', badge: true },
    { icon: Gift, label: 'Referrals', path: '/referrals' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800/90 backdrop-blur-sm border-t border-slate-700 px-2 py-3 z-40">
      <div className="flex justify-around items-center gap-1 max-w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors relative ${
                active
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={item.label}
            >
              {item.badge ? (
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  <QuestsBadge />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-xs hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
