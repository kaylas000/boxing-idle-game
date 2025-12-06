# 💫 Backend Migration Guide - Phase 4

**Date:** December 6, 2025  
**Status:** Ready to Run  
**Time to Complete:** 5-10 minutes

---

## ✅ Changes Made

### 1. app.module.ts
- ✅ Added `ReferralModule` import
- ✅ Added `QuestsModule` import
- ✅ Both modules now active in AppModule

### 2. Player Entity
- ✅ Added `referralCode` field (unique string)
- ✅ Added `loginStreak` field (integer, default: 0)
- ✅ Added `lastLoginDate` field (timestamp, nullable)
- ✅ Added `boxTokens` field (bigint, default: 0)

---

## 👀 Verification

### Check 1: Verify app.module.ts Changes
```bash
grep -n "ReferralModule\|QuestsModule" backend/src/app.module.ts
```
**Expected Output:**
```
Line: import { ReferralModule } from './modules/referral/referral.module';
Line: import { QuestsModule } from './modules/quests/quests.module';
Line: ReferralModule,
Line: QuestsModule,
```

### Check 2: Verify Player Entity Changes
```bash
grep -n "referralCode\|loginStreak\|lastLoginDate\|boxTokens" backend/src/modules/player/entities/player.entity.ts
```
**Expected Output:**
```
Line: @Column({ nullable: true, unique: true })
Line: referralCode: string;
Line: @Column({ type: 'int', default: 0 })
Line: loginStreak: number;
Line: @Column({ type: 'timestamp', nullable: true })
Line: lastLoginDate: Date;
Line: @Column({ type: 'bigint', default: 0 })
Line: boxTokens: number;
```

---

## 🗣️ Database Migration Steps

### Option 1: TypeORM Auto-Migration (Recommended for Development)

**If running in development mode with `synchronize: true`:**

```bash
cd backend
npm run start:dev
```

✅ TypeORM will automatically create/update tables on startup
✅ No manual migration needed
✅ Check logs for confirmation:

```
[TypeOrmModule] Database connected successfully
[NestFactory] Application successfully started
```

---

### Option 2: Manual TypeORM Migration (Production Recommended)

**Step 1: Generate Migration**
```bash
cd backend
npm run migration:generate -- -n AddReferralAndQuestFields
```

**Expected Output:**
```
Migration /path/to/migrations/1733542531234-AddReferralAndQuestFields.ts has been generated successfully.
```

**Step 2: Review Generated Migration**
```bash
cat ./migrations/[timestamp]-AddReferralAndQuestFields.ts
```

**Should contain:**
```typescript
// ADD columns
await queryRunner.query(`ALTER TABLE "players" ADD "referralCode" character varying`);
await queryRunner.query(`ALTER TABLE "players" ADD "loginStreak" integer DEFAULT 0`);
await queryRunner.query(`ALTER TABLE "players" ADD "lastLoginDate" TIMESTAMP`);
await queryRunner.query(`ALTER TABLE "players" ADD "boxTokens" bigint DEFAULT 0`);

// CREATE indexes for unique constraint
await queryRunner.query(`CREATE UNIQUE INDEX "IDX_referralCode" ON "players" ("referralCode")`);
```

**Step 3: Run Migration**
```bash
npm run migration:run
```

**Expected Output:**
```
query: START TRANSACTION
query: ALTER TABLE "players" ADD "referralCode" character varying
query: ALTER TABLE "players" ADD "loginStreak" integer DEFAULT 0
query: ALTER TABLE "players" ADD "lastLoginDate" TIMESTAMP
query: ALTER TABLE "players" ADD "boxTokens" bigint DEFAULT 0
query: CREATE UNIQUE INDEX "IDX_referralCode" ON "players" ("referralCode")
query: COMMIT

Migration AddReferralAndQuestFields.ts has been executed successfully.
```

---

## ✅ Verification Queries

### Check New Columns in Database

```sql
-- Connect to PostgreSQL
psql -h localhost -U boxing -d boxing_db

-- List columns in players table
\d players
```

**You should see:**
```
Column          | Type                | Modifiers
────────────────┼─────────────────────┼──────────
id              | uuid                | not null
telogramId      | character varying   | not null
...
referralCode    | character varying   | unique
loginStreak     | integer             | default 0
lastLoginDate   | timestamp           | nullable
boxTokens       | bigint              | default 0
```

### Verify Referral Code Uniqueness
```sql
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'players' AND constraint_type = 'UNIQUE';
```

**Expected Output:**
```
constraint_name     | constraint_type | table_name
────────────────────┼─────────────────┼───────────
PK_players          | PRIMARY KEY     | players
UQ_players_telegramId | UNIQUE        | players
UQ_players_referralCode | UNIQUE      | players  <- NEW
```

---

## 🔧 Testing the Integration

### Test 1: Start Backend Server
```bash
cd backend
npm run start:dev
```

**Look for:**
```
[Scheduler] Quest generation scheduled
[Scheduler] Quest cleanup scheduled
[NestFactory] Application successfully started on port 3000
```

### Test 2: Create a Test User
```bash
curl -X POST http://localhost:3000/api/auth/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123456789,
    "first_name": "Test",
    "username": "testuser",
    "auth_date": '$(date +%s)',
    "hash": "test_hash"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "player": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "telegramId": "123456789",
    "referralCode": "ABC12345",
    "loginStreak": 0,
    "boxTokens": 0,
    ...
  }
}
```

### Test 3: Get Player Profile
```bash
curl -X GET http://localhost:3000/api/player \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "referralCode": "ABC12345",
  "loginStreak": 0,
  "lastLoginDate": null,
  "boxTokens": 0,
  ...
}
```

### Test 4: Test Referral API
```bash
curl -X GET http://localhost:3000/api/referral/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "totalReferrals": 0,
  "referralsByLevel": {
    "level1": 0,
    "level2": 0,
    "level3": 0,
    "level4": 0,
    "level5": 0
  },
  "totalEarnings": 0,
  "totalBoxTokens": 0,
  "milestones": [],
  "topReferrals": []
}
```

### Test 5: Test Quests API
```bash
curl -X GET http://localhost:3000/api/quests/daily \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "questType": "WIN_FIGHTS",
    "difficulty": "EASY",
    "targetCount": 3,
    "currentProgress": 0,
    "rewards": {
      "money": 5000,
      "boxTokens": 50,
      "experience": 100
    },
    "isCompleted": false,
    "isClaimed": false,
    "expiresAt": "2025-12-07T13:55:00Z"
  },
  ...
]
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "ReferralModule is not defined"
**Cause:** Import missing in app.module.ts  
**Solution:**
```bash
# Verify import exists
grep "import { ReferralModule }" backend/src/app.module.ts
# Verify module in imports array
grep "ReferralModule," backend/src/app.module.ts
```

### Issue 2: "Column 'referralCode' does not exist"
**Cause:** Migration not run  
**Solution:**
```bash
# Run migration
cd backend
npm run migration:run

# Verify column exists
psql -c "SELECT referralCode FROM players LIMIT 1;"
```

### Issue 3: "Unique constraint violation"
**Cause:** Duplicate referral codes  
**Solution:**
```sql
-- Check for duplicates
SELECT referralCode, COUNT(*) FROM players 
GROUP BY referralCode HAVING COUNT(*) > 1;

-- Fix by updating the service to generate unique codes
```

### Issue 4: "Scheduler tasks not running"
**Cause:** ScheduleModule not imported in app.module.ts  
**Solution:**
```bash
# Verify ScheduleModule is imported
grep "ScheduleModule.forRoot()" backend/src/app.module.ts

# If missing, it's already added in current version
```

---

## 🐋 Rollback (If Needed)

### Rollback Last Migration
```bash
cd backend
npm run migration:revert
```

### Full Rollback
```bash
# Drop added columns
psql -U boxing -d boxing_db -c 
'ALTER TABLE players DROP COLUMN IF EXISTS referralCode;'
'ALTER TABLE players DROP COLUMN IF EXISTS loginStreak;'
'ALTER TABLE players DROP COLUMN IF EXISTS lastLoginDate;'
'ALTER TABLE players DROP COLUMN IF EXISTS boxTokens;'
```

---

## ✅ Completion Checklist

- [ ] app.module.ts updated with new modules
- [ ] Player entity updated with 4 new fields
- [ ] Database migration generated
- [ ] Database migration executed
- [ ] Backend server started successfully
- [ ] Scheduler tasks visible in logs
- [ ] Referral API responding
- [ ] Quests API responding
- [ ] Test user created successfully
- [ ] No error logs in backend console

---

## 🚀 Next Steps

Once migration is complete:

1. **Frontend Integration** (45 minutes)
   - Add routes to App.tsx
   - Integrate components
   - Update navigation

2. **Testing** (1-2 hours)
   - Manual desktop testing
   - Mobile testing
   - API integration testing

3. **Deployment** (1-2 hours)
   - Deploy backend
   - Deploy frontend
   - Monitor for errors

---

## 📈 Database Schema Changes

**Before:**
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY,
  telegramId VARCHAR UNIQUE,
  money BIGINT DEFAULT 1000,
  -- ... other columns
);
```

**After:**
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY,
  telegramId VARCHAR UNIQUE,
  referralCode VARCHAR UNIQUE,              -- NEW
  loginStreak INTEGER DEFAULT 0,            -- NEW
  lastLoginDate TIMESTAMP,                  -- NEW
  boxTokens BIGINT DEFAULT 0,               -- NEW
  money BIGINT DEFAULT 1000,
  -- ... other columns
);
```

---

**Created:** December 6, 2025  
**Status:** Ready to Execute  
**Estimated Duration:** 5-10 minutes

Let's go! 🚀
