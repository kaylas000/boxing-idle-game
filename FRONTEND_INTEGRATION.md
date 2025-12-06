# 🚀 Frontend Integration Guide

## Frontend Components Created

### 1. **ReferralPage** ✅ Created
**Location:** `frontend/src/pages/ReferralPage.tsx` (14.2 KB)

**Features:**
- ✅ Referral code display with copy functionality
- ✅ Share button for social sharing
- ✅ Real-time statistics (total referrals, earnings, BOX tokens)
- ✅ Milestone system with progress bars
- ✅ Milestone rewards claiming
- ✅ Leaderboard of top referrers (top 20)
- ✅ Breakdown by referral levels (1-5)
- ✅ Animated UI with Framer Motion
- ✅ Responsive design

**API Endpoints Used:**
```typescript
GET  /api/referral/stats              // Overall statistics
GET  /api/referral/my-code            // User's referral code
GET  /api/referral/leaderboard        // Top referrers
POST /api/referral/milestone/:id/claim // Claim milestone reward
```

**To integrate into router:**
```typescript
// src/App.tsx or router configuration
import { ReferralPage } from './pages/ReferralPage';

// Add to route configuration:
{
  path: '/referrals',
  element: <ReferralPage />,
  name: 'Referrals',
}
```

---

### 2. **QuestsPage** ✅ Created
**Location:** `frontend/src/pages/QuestsPage.tsx` (13.2 KB)

**Features:**
- ✅ Daily quests display
- ✅ Quest categories: Available & Completed tabs
- ✅ Real-time progress tracking
- ✅ 12 quest types with icons (WIN_FIGHTS, TRAIN_TIMES, PVP_WIN, etc.)
- ✅ 3 difficulty levels with color coding
- ✅ Progress bars showing completion percentage
- ✅ Reward preview (money, BOX tokens, experience)
- ✅ Daily streak indicator
- ✅ Auto-generation of quests if none exist
- ✅ Animated quest cards
- ✅ Statistics panel

**API Endpoints Used:**
```typescript
GET  /api/quests/daily        // Get daily quests (auto-generates if needed)
POST /api/quests/generate     // Manually generate new quests
GET  /api/quests/stats        // Get quest statistics
```

**To integrate into router:**
```typescript
// src/App.tsx or router configuration
import { QuestsPage } from './pages/QuestsPage';

// Add to route configuration:
{
  path: '/quests',
  element: <QuestsPage />,
  name: 'Quests',
}
```

---

### 3. **ReferralBanner** ✅ Created
**Location:** `frontend/src/components/ReferralBanner.tsx` (5.7 KB)

**Features:**
- ✅ Collapsed banner showing referral earnings
- ✅ Expandable modal with full details
- ✅ Copy referral code button
- ✅ Share with friends functionality
- ✅ Live referral statistics
- ✅ Smooth animations

**To integrate into HomePage:**
```typescript
// src/pages/HomePage.tsx
import { ReferralBanner } from '../components/ReferralBanner';

function HomePage() {
  return (
    <div>
      {/* Add this at the top of your homepage */}
      <ReferralBanner />
      
      {/* Rest of homepage content */}
      {/* ... */}
    </div>
  );
}
```

---

### 4. **QuestsBadge** ✅ Created
**Location:** `frontend/src/components/QuestsBadge.tsx` (2.4 KB)

**Features:**
- ✅ Notification badge for completed quests
- ✅ Displays count of completed quests
- ✅ Shows completion percentage on hover
- ✅ Shows earned BOX tokens
- ✅ Animated badge

**To integrate into Navigation:**
```typescript
// src/components/Navigation.tsx or bottom nav
import { QuestsBadge } from './QuestsBadge';

function Navigation() {
  return (
    <nav className="flex items-center gap-4">
      <a href="/">Home</a>
      <a href="/fight">Fight</a>
      <a href="/training">Training</a>
      {/* Add QuestsBadge as clickable link */}
      <a href="/quests" className="relative">
        <QuestsBadge />
      </a>
      <a href="/profile">Profile</a>
    </nav>
  );
}
```

---

## Step-by-Step Integration

### Step 1: Create Routing Structure (5 minutes)

**Option A: Using React Router v6**

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReferralPage } from './pages/ReferralPage';
import { QuestsPage } from './pages/QuestsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/fight" element={<FightPage />} />
        
        {/* NEW ROUTES */}
        <Route path="/referrals" element={<ReferralPage />} />
        <Route path="/quests" element={<QuestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Option B: Using custom router**

```typescript
// src/config/routes.ts
export const routes = [
  { path: '/', component: HomePage, name: 'Home' },
  { path: '/fight', component: FightPage, name: 'Fight' },
  { path: '/referrals', component: ReferralPage, name: 'Referrals' },  // NEW
  { path: '/quests', component: QuestsPage, name: 'Quests' },          // NEW
];
```

---

### Step 2: Add to Navigation (5 minutes)

**Update your bottom navigation or header:**

```typescript
// src/components/Navigation.tsx
import { Trophy, Zap, Gift } from 'lucide-react';
import { QuestsBadge } from './QuestsBadge';

function Navigation() {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Sword, label: 'Fight', path: '/fight' },
    { icon: Dumbbell, label: 'Training', path: '/training' },
    // NEW ITEMS:
    { icon: Zap, label: 'Quests', path: '/quests', component: QuestsBadge },
    { icon: Gift, label: 'Referrals', path: '/referrals' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-2 py-3 flex justify-around">
      {navItems.map((item) => (
        <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1">
          {item.component ? (
            <item.component />
          ) : (
            <item.icon className="w-6 h-6 text-slate-400" />
          )}
          <span className="text-xs text-slate-400">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
```

---

### Step 3: Add ReferralBanner to HomePage (3 minutes)

```typescript
// src/pages/HomePage.tsx
import { ReferralBanner } from '../components/ReferralBanner';

function HomePage() {
  return (
    <div className="pb-24">
      {/* Add this banner at the top */}
      <ReferralBanner />

      {/* Rest of your homepage content */}
      <div className="mt-6">
        {/* Your existing content */}
      </div>
    </div>
  );
}
```

---

### Step 4: Ensure API Client is Configured (5 minutes)

**Check your `lib/api.ts` is properly configured:**

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Step 5: Test Components (10 minutes)

**Test ReferralPage:**
```bash
cd frontend
npm start
# Navigate to http://localhost:3000/referrals
```

**Check functionality:**
- ✅ Referral code displays
- ✅ Copy button works
- ✅ Share button works
- ✅ Statistics load
- ✅ Milestones display
- ✅ Leaderboard loads

**Test QuestsPage:**
```bash
# Navigate to http://localhost:3000/quests
```

**Check functionality:**
- ✅ Quests load
- ✅ Progress bars update
- ✅ Tabs switch between available/completed
- ✅ Statistics load
- ✅ Streak displays (if applicable)

---

## Backend Integration Checklist

### ✅ Already Done
- ✅ Referral module complete
- ✅ Quests module complete
- ✅ API endpoints ready
- ✅ Database entities created
- ✅ Services implemented

### ⚠️ TO DO: Add to app.module.ts

**Backend:** `backend/src/app.module.ts`

```typescript
import { ReferralModule } from './modules/referral/referral.module';
import { QuestsModule } from './modules/quests/quests.module';

@Module({
  imports: [
    // Existing imports...
    
    // Add these:
    ReferralModule,
    QuestsModule,
  ],
})
export class AppModule {}
```

### ⚠️ TO DO: Update Player Entity

**Backend:** `backend/src/modules/player/entities/player.entity.ts`

```typescript
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Existing fields...

  // ADD THESE NEW FIELDS:
  @Column({ nullable: true, unique: true })
  referralCode: string;

  @Column({ default: 0 })
  loginStreak: number;

  @Column({ nullable: true })
  lastLoginDate: Date;

  @Column({ default: 0 })
  boxTokens: number;

  // Existing fields...
}
```

---

## Performance Optimization

### Cache Strategy
```typescript
// Use refetchInterval for less critical data
const { data: stats } = useQuery({
  queryKey: ['referral-stats'],
  queryFn: fetchStats,
  refetchInterval: 30000, // 30 seconds
});

// Disable automatic refetch on window focus
const { data: leaderboard } = useQuery({
  queryKey: ['referral-leaderboard'],
  queryFn: fetchLeaderboard,
  refetchOnWindowFocus: false,
});
```

### Request Batching
```typescript
// Combine multiple API calls
const { data: allData } = useQuery({
  queryKey: ['combined-data'],
  queryFn: async () => {
    const [stats, code, leaderboard] = await Promise.all([
      api.get('/referral/stats'),
      api.get('/referral/my-code'),
      api.get('/referral/leaderboard'),
    ]);
    return { stats: stats.data, code: code.data, leaderboard: leaderboard.data };
  },
});
```

---

## Troubleshooting

### Issue: "API returns 401 Unauthorized"
**Solution:** Ensure JWT token is properly set in localStorage
```typescript
const token = localStorage.getItem('auth_token');
console.log('Auth token:', token); // Debug
```

### Issue: "Quests not generating"
**Solution:** Check backend scheduled tasks are running
```bash
cd backend
npm run start:dev
# Look for logs: "[Scheduler] Quest generation scheduled"
```

### Issue: "Referral code not displaying"
**Solution:** Verify API endpoint returns data
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/referral/my-code
```

---

## Total Time to Complete Integration

- ReferralPage routing: **5 min**
- QuestsPage routing: **5 min**
- Navigation updates: **5 min**
- ReferralBanner integration: **3 min**
- API client verification: **5 min**
- Testing: **10 min**
- **TOTAL: ~35 minutes**

---

## Next Steps After Integration

1. **Deploy and Test** (30 min)
   - Deploy backend with new modules
   - Deploy frontend with new pages
   - Test full flow end-to-end

2. **Push Notifications** (2 hours)
   - Add quest notifications
   - Add referral notifications
   - Setup Telegram notifications

3. **Analytics Setup** (1 hour)
   - Track referral conversions
   - Track quest completion rates
   - Setup Mixpanel/Amplitude

4. **Marketing & Launch** (ongoing)
   - Create teasers
   - Setup referral incentive campaign
   - Launch with press release

---

## Files Checklist

- [x] `frontend/src/pages/ReferralPage.tsx` - Created
- [x] `frontend/src/pages/QuestsPage.tsx` - Created
- [x] `frontend/src/components/ReferralBanner.tsx` - Created
- [x] `frontend/src/components/QuestsBadge.tsx` - Created
- [ ] Update `frontend/src/App.tsx` - Add routes
- [ ] Update `frontend/src/components/Navigation.tsx` - Add nav items
- [ ] Update `frontend/src/pages/HomePage.tsx` - Add ReferralBanner
- [ ] Update `backend/src/app.module.ts` - Add modules
- [ ] Update `backend/src/modules/player/entities/player.entity.ts` - Add fields

---

**Created:** December 6, 2025
**Last Updated:** December 6, 2025  
**Status:** Ready for integration ✅
