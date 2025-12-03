# ⛓️ TON Blockchain Integration - Полная Реализация

> **Все токены и NFT работают напрямую в TON blockchain для Telegram Mini App**

---

## 🎯 Архитектура

### Принцип работы

```
Telegram Mini App
       ↓
   TON Connect
       ↓
Telegram Wallet (встроенный в Telegram)
       ↓
 TON Blockchain
       ↓
 Smart Contracts:
  - BOXToken.fc (Jetton)
  - NFTCollection.fc (NFT)
```

### Ключевые особенности

✅ **100% On-Chain** - все токены и NFT существуют в TON blockchain
✅ **Telegram Wallet** - используется встроенный кошелёк Telegram
✅ **TON Connect** - стандартный протокол подключения
✅ **Реальные транзакции** - каждая операция записывается в blockchain
✅ **Gas fees** - оплачиваются игроком в TON

---

## 🔧 Технический Stack

### Backend

```yaml
Framework: NestJS
Blockchain SDK: @ton/ton, @ton/crypto
Database: PostgreSQL (только для кеширования)
Queue: Bull (для проверки статусов транзакций)
```

### Frontend

```yaml
Framework: React + TypeScript
TON SDK: @tonconnect/ui-react
Wallet: Telegram Wallet (автоматически)
UI: TailwindCSS
```

### Smart Contracts

```yaml
Language: FunC
Standards:
  - TEP-74 (Jetton Token)
  - TEP-62 (NFT Standard)
  - TEP-64 (Token Data Standard)
Network: TON Mainnet
```

---

## 🚀 Как это работает

### 1. Подключение кошелька

```typescript
// Frontend
import { useTonConnect } from '@/hooks/useTonConnect';

function App() {
  const { connectWallet, address, isConnected } = useTonConnect();
  
  return (
    <button onClick={connectWallet}>
      {isConnected ? address : 'Connect Wallet'}
    </button>
  );
}
```

**Что происходит:**
1. Пользователь нажимает "Connect Wallet"
2. Открывается Telegram Wallet (встроенный в Telegram)
3. Пользователь подтверждает подключение
4. Frontend получает TON адрес
5. Backend связывает адрес с аккаунтом игрока

### 2. Начисление BOX токенов (Play-to-Earn)

```typescript
// Backend: игрок побеждает в бою
@Post('fight/complete')
async completeFight(@CurrentUser() player: Player) {
  // Расчёт награды
  const reward = 50; // BOX tokens
  
  // Mint токенов напрямую в blockchain
  await this.tonService.mintBoxTokens(
    player.id,
    reward,
    'fight_victory'
  );
  
  // Токены появятся в Telegram Wallet игрока через 5-10 секунд
}
```

**Что происходит:**
1. Backend вызывает smart contract BOXToken
2. Отправляется транзакция mint
3. Транзакция подтверждается в TON blockchain (5-10 сек)
4. Токены появляются в Telegram Wallet игрока
5. Игрок видит баланс в приложении

### 3. Покупка NFT на Marketplace

```typescript
// Frontend: игрок покупает NFT
const buyNFT = async (listingId: string, price: number) => {
  // 1. Отправка BOX токенов продавцу
  const tx = await sendTransaction({
    to: sellerAddress,
    amount: (price * 1_000_000_000).toString(), // в nano
  });
  
  // 2. Backend переносит NFT покупателю
  await api.post(`/marketplace/${listingId}/buy`, {
    txHash: tx.boc,
  });
};
```

**Что происходит:**
1. Frontend создаёт транзакцию перевода BOX токенов
2. Telegram Wallet запрашивает подтверждение
3. Пользователь подтверждает (платит gas fee в TON)
4. Транзакция отправляется в blockchain
5. Backend переносит NFT новому владельцу
6. NFT появляется в Telegram Wallet покупателя

### 4. Mint NFT за достижения

```typescript
// Backend: игрок получает достижение
@Post('achievements/:id/claim')
async claimAchievement(
  @Param('id') achievementId: string,
  @CurrentUser() player: Player,
) {
  // Mint NFT в blockchain
  const result = await this.tonService.mintNFT(player.id, {
    name: 'Champion Belt',
    description: 'Legendary belt for 100 wins',
    image: 'https://...',
    attributes: {
      powerBonus: 100,
      rarity: 'legendary',
    },
  });
  
  // NFT появится в Telegram Wallet
  return result;
}
```

---

## 💰 Gas Fees & Economics

### Типичные Gas Fees в TON

```yaml
Mint BOX Token: ~0.01 TON ($0.05)
Mint NFT: ~0.05 TON ($0.25)
Transfer Token: ~0.005 TON ($0.025)
Transfer NFT: ~0.01 TON ($0.05)
```

### Кто платит Gas?

**Для игровых наград (mint):**
- ✅ Платит Game Master Wallet (игра)
- ❌ Игрок не платит
- Игрок получает токены/NFT бесплатно

**Для P2P операций (transfer, marketplace):**
- ❌ Платит игрок
- Необходимо иметь TON для gas
- Типичная транзакция: 0.005-0.01 TON

### Решение проблемы Gas Fees

**Подход 1: Gas Sponsorship**
```typescript
// Backend спонсирует gas для новых игроков
if (player.totalGasSponsored < 10) {
  await this.sponsorGas(player.tonWalletAddress, '0.1'); // 0.1 TON
  player.totalGasSponsored += 1;
}
```

**Подход 2: Batch Operations**
```typescript
// Накопление наград и mint раз в день
await this.tonService.batchMintTokens([
  { player: player1, amount: 150 },
  { player: player2, amount: 200 },
  // ... до 100 игроков
]);
// Экономия: 1 транзакция вместо 100
```

---

## 🔐 Безопасность

### Game Master Wallet

**Что это:**
- Специальный кошелёк игры для mint операций
- Хранится на backend (зашифрованная мнемоника)
- Имеет права mint в smart contracts

**Защита:**
```typescript
// .env (НИКОГДА не коммитить!)
GAME_MASTER_MNEMONIC="word1 word2 ... word24"

// Backend: шифрование
import { encrypt, decrypt } from 'crypto';

const encryptedMnemonic = encrypt(
  process.env.GAME_MASTER_MNEMONIC,
  process.env.ENCRYPTION_KEY
);
```

### Anti-Cheat

```typescript
// Backend валидация перед mint
if (reward > MAX_REWARD_PER_FIGHT) {
  throw new BadRequestException('Invalid reward amount');
}

if (player.lastFightAt > Date.now() - 10000) {
  throw new BadRequestException('Too fast! Cooldown: 10s');
}

// Rate limiting
@Throttle({ limit: 10, ttl: 60 }) // 10 mint/минуту
async mintTokens() { ... }
```

---

## 📊 Мониторинг Blockchain

### Отслеживание транзакций

```typescript
// Cron job: каждые 30 секунд
@Cron('*/30 * * * * *')
async checkPendingTransactions() {
  const pending = await this.tonTransactionRepository.find({
    where: { status: 'pending' },
  });

  for (const tx of pending) {
    const status = await this.tonService.checkTransactionStatus(tx.txHash);
    
    if (status.confirmed) {
      tx.status = status.success ? 'completed' : 'failed';
      tx.confirmedAt = new Date();
      await this.tonTransactionRepository.save(tx);
      
      // Уведомить игрока
      await this.notifyPlayer(tx.player, tx);
    }
  }
}
```

### Webhooks от TONCenter

```typescript
@Post('webhooks/ton')
async handleTonWebhook(@Body() data: any) {
  // TONCenter отправляет уведомление о новой транзакции
  const tx = await this.tonTransactionRepository.findOne({
    where: { txHash: data.hash },
  });
  
  if (tx) {
    tx.status = 'completed';
    tx.confirmedAt = new Date();
    await this.tonTransactionRepository.save(tx);
  }
}
```

---

## 🧪 Тестирование

### Testnet

```bash
# .env.development
TON_NETWORK=testnet
TONCENTER_API_KEY=your_testnet_key
BOX_TOKEN_ADDRESS=EQD... # testnet contract
NFT_COLLECTION_ADDRESS=EQD... # testnet contract
```

### Получить testnet TON

1. Открыть https://t.me/testgiver_ton_bot
2. Отправить TON адрес
3. Получить 5 testnet TON
4. Использовать для тестов

### Unit тесты

```typescript
describe('TonService', () => {
  it('should mint BOX tokens', async () => {
    const result = await tonService.mintBoxTokens(
      playerId,
      100,
      'test_reward'
    );
    
    expect(result.success).toBe(true);
    expect(result.txHash).toBeDefined();
  });
  
  it('should check transaction status', async () => {
    const status = await tonService.checkTransactionStatus(txHash);
    expect(status.confirmed).toBe(true);
  });
});
```

---

## 📱 UI/UX для Пользователей

### Первое подключение

```tsx
// Экран onboarding
function OnboardingScreen() {
  return (
    <div className="tutorial">
      <h2>🎮 Добро пожаловать в Boxing Champion!</h2>
      
      <p>Для начала игры подключите Telegram Wallet:</p>
      
      <ol>
        <li>Нажмите "Connect Wallet"</li>
        <li>Подтвердите в Telegram Wallet</li>
        <li>Начните зарабатывать BOX токены!</li>
      </ol>
      
      <TonConnectButton />
      
      <p className="note">
        💡 Все токены и NFT будут храниться в вашем Telegram Wallet
      </p>
    </div>
  );
}
```

### Отображение транзакций

```tsx
function TransactionItem({ tx }) {
  return (
    <div className="transaction">
      <div className="type">
        {tx.type === 'mint' && '⭐ Получено'}
        {tx.type === 'transfer' && '➡️ Отправлено'}
      </div>
      
      <div className="amount">
        {tx.amount} {tx.token}
      </div>
      
      <div className="status">
        {tx.status === 'pending' && (
          <span className="loading">⏳ Ожидание...</span>
        )}
        {tx.status === 'completed' && (
          <span className="success">✅ Подтверждено</span>
        )}
      </div>
      
      <a 
        href={`https://tonscan.org/tx/${tx.txHash}`}
        target="_blank"
      >
        Посмотреть в Explorer →
      </a>
    </div>
  );
}
```

### Подтверждение транзакции

```tsx
function BuyNFTDialog({ nft, price }) {
  const [status, setStatus] = useState('idle');
  
  const handleBuy = async () => {
    setStatus('preparing');
    
    try {
      // Отправка транзакции
      const tx = await sendTransaction({
        to: nft.owner,
        amount: price,
      });
      
      setStatus('pending');
      
      // Ожидание подтверждения
      await waitForConfirmation(tx.hash);
      
      setStatus('completed');
    } catch (error) {
      setStatus('failed');
    }
  };
  
  return (
    <dialog>
      {status === 'idle' && (
        <>
          <p>Вы покупаете: {nft.name}</p>
          <p>Цена: {price} BOX</p>
          <button onClick={handleBuy}>Подтвердить покупку</button>
        </>
      )}
      
      {status === 'preparing' && (
        <p>⏳ Подготовка транзакции...</p>
      )}
      
      {status === 'pending' && (
        <>
          <p>⏳ Ожидание подтверждения в blockchain...</p>
          <p className="note">Это может занять 5-10 секунд</p>
        </>
      )}
      
      {status === 'completed' && (
        <>
          <p>✅ Покупка завершена!</p>
          <p>NFT появится в вашем кошельке через несколько секунд</p>
        </>
      )}
    </dialog>
  );
}
```

---

## 🚀 Deployment

### 1. Deploy Smart Contracts

```bash
cd contracts

# Компиляция
func -o BOXToken.fif BOXToken.fc
func -o NFTCollection.fif NFTCollection.fc

# Deploy на mainnet
node scripts/deploy.js --network mainnet

# Сохранить адреса контрактов
echo "BOX_TOKEN_ADDRESS=EQD..." >> .env.production
echo "NFT_COLLECTION_ADDRESS=EQD..." >> .env.production
```

### 2. Setup Backend

```bash
# Установить зависимости
cd backend
npm install

# Миграции БД
npm run migration:run

# Настроить .env
TON_NETWORK=mainnet
GAME_MASTER_MNEMONIC="..."
BOX_TOKEN_ADDRESS=EQD...
NFT_COLLECTION_ADDRESS=EQD...
TONCENTER_API_KEY=...

# Запустить
npm run start:prod
```

### 3. Setup Frontend

```bash
cd frontend
npm install

# Обновить tonconnect-manifest.json
cp public/tonconnect-manifest.json dist/

# Build
npm run build

# Deploy на Vercel/Netlify
vercel deploy
```

### 4. Настройка Telegram Bot

```bash
# BotFather команды
/newapp
# Name: Boxing Champion
# URL: https://your-app.vercel.app
# Photo: загрузить icon.png
```

---

## 📈 Scaling

### Оптимизация Gas Costs

**Batch mint (до 100 игроков за раз):**
```typescript
const rewards = [
  { player: 'EQD...', amount: 150 },
  { player: 'EQD...', amount: 200 },
  // ... до 100
];

await this.tonService.batchMint(rewards);
// Gas: 0.01 TON вместо 1 TON (экономия 99%)
```

### Кеширование балансов

```typescript
// Redis cache для балансов
await redis.setex(
  `balance:${address}`,
  60, // TTL 60 секунд
  balance
);

// Обновление каждые 60 секунд вместо каждого запроса
```

### Оптимизация NFT queries

```typescript
// Индексация NFT в БД для быстрого поиска
@Index(['owner', 'rarity'])
@Index(['type', 'onChain'])
class NFTCache {
  // Синхронизация с blockchain раз в 5 минут
}
```

---

## ✅ Checklist для Launch

- [ ] Smart contracts deployed на mainnet
- [ ] Game Master Wallet создан и пополнен TON
- [ ] Backend подключен к TON mainnet
- [ ] Frontend интегрирован с TON Connect
- [ ] tonconnect-manifest.json опубликован
- [ ] Telegram Bot настроен
- [ ] Тестирование на testnet завершено
- [ ] Monitoring и alerts настроены
- [ ] Документация обновлена
- [ ] Community уведомлено

---

**🎮 Boxing Champion теперь полностью работает на TON blockchain в Telegram!** 🚀
