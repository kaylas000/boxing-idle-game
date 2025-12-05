# ⚡ Быстрая установка новых функций (5 минут)

Этот гайд поможет быстро интегрировать реферальную систему и ежедневные квесты.

---

## Шаг 1: Установка зависимостей

```bash
cd backend
npm install @nestjs/schedule
```

---

## Шаг 2: Добавьте модули в app.module.ts

Откройте `backend/src/app.module.ts` и добавьте:

```typescript
import { ReferralModule } from './modules/referral/referral.module';
import { QuestsModule } from './modules/quests/quests.module';

@Module({
  imports: [
    // ... существующие модули
    ReferralModule,  // <-- Добавьте эту строку
    QuestsModule,    // <-- Добавьте эту строку
  ],
})
export class AppModule {}
```

---

## Шаг 3: Обновите Player entity

Откройте `backend/src/modules/player/entities/player.entity.ts` и добавьте поля:

```typescript
@Entity('players')
export class Player {
  // ... существующие поля

  // Добавьте эти поля:
  @Column({ type: 'varchar', length: 8, unique: true, nullable: true })
  referralCode: string;

  @Column({ type: 'int', default: 0 })
  loginStreak: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginDate: Date;

  // Если boxTokens еще не добавлен, добавьте:
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  boxTokens: number;
}
```

---

## Шаг 4: Запустите миграции

```bash
cd backend

# Сгенерируйте миграции
npm run migration:generate -- -n AddReferralAndQuests

# Примените миграции
npm run migration:run
```

---

## Шаг 5: Интегрируйте в существующие модули

### 5.1. В fight.service.ts

Добавьте в constructor:

```typescript
import { ReferralService } from '../referral/referral.service';
import { QuestsService } from '../quests/quests.service';
import { QuestType } from '../quests/entities/daily-quest.entity';

constructor(
  // ... существующие зависимости
  private readonly referralService: ReferralService,
  private readonly questsService: QuestsService,
) {}
```

В методе `completeFight()` после победы:

```typescript
if (result.winner === playerId) {
  // Существующий код...
  
  // Добавьте эти строки:
  await this.referralService.processReferralReward(
    playerId,
    moneyEarned,
    boxTokensEarned,
    'fight_win'
  );
  
  await this.questsService.updateQuestProgress(
    playerId,
    QuestType.WIN_FIGHTS,
    1
  );
}
```

### 5.2. В training.service.ts

Добавьте в constructor:

```typescript
import { QuestsService } from '../quests/quests.service';
import { QuestType } from '../quests/entities/daily-quest.entity';

constructor(
  // ... существующие
  private readonly questsService: QuestsService,
) {}
```

В методе `completeTraining()`:

```typescript
await this.questsService.updateQuestProgress(
  playerId,
  QuestType.TRAIN_TIMES,
  1
);
```

### 5.3. В pvp.service.ts

Добавьте в constructor:

```typescript
import { ReferralService } from '../referral/referral.service';
import { QuestsService } from '../quests/quests.service';
import { QuestType } from '../quests/entities/daily-quest.entity';

constructor(
  // ... существующие
  private readonly referralService: ReferralService,
  private readonly questsService: QuestsService,
) {}
```

После победы в PvP:

```typescript
if (winner) {
  await this.referralService.processReferralReward(
    winner.id,
    rewardMoney,
    rewardBoxTokens,
    'pvp_win'
  );
  
  await this.questsService.updateQuestProgress(
    winner.id,
    QuestType.PVP_WIN,
    1
  );
}
```

---

## Шаг 6: Добавьте модули в imports

В `fight.module.ts`, `training.module.ts`, `pvp.module.ts` добавьте:

```typescript
import { ReferralModule } from '../referral/referral.module';
import { QuestsModule } from '../quests/quests.module';

@Module({
  imports: [
    // ... существующие
    ReferralModule,
    QuestsModule,
  ],
  // ...
})
```

---

## Шаг 7: Перезапустите backend

```bash
cd backend
npm run start:dev
```

---

## Шаг 8: Проверьте API

Откройте Swagger docs: `http://localhost:3000/api/docs`

Проверьте, что появились новые эндпоинты:

**Referral:**
- `POST /api/referral/use-code`
- `GET /api/referral/my-code`
- `GET /api/referral/stats`
- `GET /api/referral/leaderboard`

**Quests:**
- `GET /api/quests/daily`
- `POST /api/quests/generate`
- `GET /api/quests/stats`

---

## Тестирование

### Тест реферальной системы:

1. Создайте 2 тестовых аккаунта
2. Получите реферальный код первого: `GET /api/referral/my-code`
3. Используйте код вторым: `POST /api/referral/use-code`
4. Проверьте статистику: `GET /api/referral/stats`
5. Победите в бою вторым аккаунтом
6. Проверьте, что первый получил 20% от заработка

### Тест квестов:

1. Запросите квесты: `GET /api/quests/daily`
2. Проверьте, что сгенерировалось 3 квеста
3. Победите в боях / проведите тренировки
4. Проверьте, что `currentValue` увеличился
5. Завершите квест и проверьте получение наград

---

## ✅ Готово!

Теперь у вас есть:
- 👥 **5-уровневая реферальная система** с милстоунами
- 🎯 **Ежедневные квесты** с автогенерацией
- 📊 **Автоматическое начисление наград**
- 🏆 **Лидерборд рефереров**

### Следующие шаги:

1. Создайте Frontend компоненты:
   - `ReferralPage.tsx`
   - `QuestsPage.tsx`
   - Баннер на главной

2. Добавьте рекламную интеграцию

3. Настройте Push-уведомления

---

## Помощь

Если что-то не работает:

1. Проверьте логи: `docker-compose logs backend`
2. Проверьте базу: `docker-compose exec postgres psql -U user -d boxing_game`
3. Перезапустите сервисы: `docker-compose restart`

**🚀 Успехов в запуске!**
