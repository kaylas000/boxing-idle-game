import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { initTelegramSDK } from './lib/telegram';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';
import FightPage from './pages/FightPage';
import CardsPage from './pages/CardsPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import { ReferralPage } from './pages/ReferralPage';
import { QuestsPage } from './pages/QuestsPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  useEffect(() => {
    initTelegramSDK();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="fight" element={<FightPage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          {/* ROUTES - Added December 6, 2025 */}
          <Route path="referrals" element={<ReferralPage />} />
          <Route path="quests" element={<QuestsPage />} />
          <Route path="community" element={<CommunityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
