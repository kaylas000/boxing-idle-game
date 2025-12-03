import Phaser from 'phaser';
import { BoxerSprite } from './BoxerSprite';
import { ParticleEffects } from './ParticleEffects';
import { SoundManager } from './SoundManager';

export interface FightConfig {
  player: {
    name: string;
    power: number;
    speed: number;
    stamina: number;
    defense: number;
  };
  opponent: {
    name: string;
    power: number;
    speed: number;
    stamina: number;
    defense: number;
  };
  onComplete: (result: FightResult) => void;
}

export interface FightResult {
  winner: 'player' | 'opponent';
  knockout: boolean;
  rounds: number;
  damage: {
    player: number;
    opponent: number;
  };
}

export class FightScene extends Phaser.Scene {
  private playerBoxer!: BoxerSprite;
  private opponentBoxer!: BoxerSprite;
  private particles!: ParticleEffects;
  private soundManager!: SoundManager;
  private config!: FightConfig;
  private currentRound: number = 1;
  private maxRounds: number = 12;
  private fightActive: boolean = false;
  
  private playerHealth: number = 100;
  private opponentHealth: number = 100;
  private playerStamina: number = 100;
  private opponentStamina: number = 100;

  constructor() {
    super({ key: 'FightScene' });
  }

  init(data: FightConfig) {
    this.config = data;
    this.playerHealth = 100;
    this.opponentHealth = 100;
    this.playerStamina = 100;
    this.opponentStamina = 100;
    this.currentRound = 1;
  }

  preload() {
    // Загрузка ассетов
    this.load.setBaseURL('https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/');
    
    // Загрузка спрайтов боксёров (placeholder, можно заменить)
    this.load.image('player', 'sprites/phaser-dude.png');
    this.load.image('opponent', 'sprites/phaser-dude.png');
    
    // Загрузка фона ринга
    this.load.image('ring', 'skies/space3.png');
    
    // Эффекты
    this.load.image('particle', 'particles/red.png');
    this.load.image('hit-effect', 'particles/white.png');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Фон ринга
    const bg = this.add.image(width / 2, height / 2, 'ring');
    bg.setDisplaySize(width, height);
    bg.setAlpha(0.3);

    // Канаты ринга
    this.createRingRopes();

    // Создание боксёров
    this.playerBoxer = new BoxerSprite(
      this,
      width * 0.3,
      height * 0.6,
      'player',
      this.config.player,
      'player'
    );

    this.opponentBoxer = new BoxerSprite(
      this,
      width * 0.7,
      height * 0.6,
      'opponent',
      this.config.opponent,
      'opponent'
    );

    // Эффекты частиц
    this.particles = new ParticleEffects(this);

    // Звуковой менеджер
    this.soundManager = new SoundManager(this);

    // UI
    this.createUI();

    // Начать бой через 2 секунды
    this.time.delayedCall(2000, () => {
      this.startFight();
    });
  }

  private createRingRopes() {
    const { width, height } = this.cameras.main;
    const ropeY = [height * 0.4, height * 0.5, height * 0.6];
    
    ropeY.forEach(y => {
      const rope = this.add.rectangle(width / 2, y, width * 0.8, 3, 0xffffff);
      rope.setAlpha(0.5);
    });
  }

  private createUI() {
    const { width } = this.cameras.main;

    // Имена боксёров
    this.add.text(50, 30, this.config.player.name, {
      fontSize: '24px',
      color: '#00ff00',
      fontStyle: 'bold'
    });

    this.add.text(width - 250, 30, this.config.opponent.name, {
      fontSize: '24px',
      color: '#ff0000',
      fontStyle: 'bold'
    });

    // Полоски здоровья
    this.createHealthBar(50, 70, this.playerHealth, 'player');
    this.createHealthBar(width - 250, 70, this.opponentHealth, 'opponent');

    // Номер раунда
    this.add.text(width / 2, 30, `Раунд ${this.currentRound}`, {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  private createHealthBar(x: number, y: number, health: number, id: string) {
    const bar = this.add.rectangle(x, y, 200, 20, 0x222222);
    const fill = this.add.rectangle(x, y, (health / 100) * 200, 20, health > 30 ? 0x00ff00 : 0xff0000);
    fill.setOrigin(0, 0.5);
    bar.setOrigin(0, 0.5);

    this.add.existing(bar);
    this.add.existing(fill);

    // Сохраняем ссылку для обновления
    if (id === 'player') {
      this.data.set('playerHealthBar', fill);
    } else {
      this.data.set('opponentHealthBar', fill);
    }
  }

  private startFight() {
    this.fightActive = true;
    this.simulateRound();
  }

  private simulateRound() {
    if (!this.fightActive) return;

    // Таймер раунда (3 минуты = 3000ms в игре)
    const roundDuration = 3000;
    const actionInterval = 500; // Удар каждые 500ms

    const roundTimer = this.time.addEvent({
      delay: actionInterval,
      callback: () => {
        this.performAction();
      },
      repeat: Math.floor(roundDuration / actionInterval)
    });

    // Конец раунда
    this.time.delayedCall(roundDuration, () => {
      this.endRound();
    });
  }

  private performAction() {
    // Определить, кто атакует
    const playerAttacks = Math.random() < 0.5;

    if (playerAttacks) {
      this.playerAttack();
    } else {
      this.opponentAttack();
    }
  }

  private playerAttack() {
    const { power, speed } = this.config.player;
    const { defense } = this.config.opponent;

    // Шанс попадания
    const hitChance = speed / (speed + defense);
    if (Math.random() > hitChance) {
      this.opponentBoxer.dodge();
      return;
    }

    // Расчёт урона
    const baseDamage = power / 10;
    const staminaMultiplier = this.playerStamina / 100;
    const damage = baseDamage * staminaMultiplier * (0.8 + Math.random() * 0.4);

    // Анимация удара
    this.playerBoxer.punch(() => {
      // Попадание
      this.opponentHealth -= damage;
      this.opponentBoxer.hit();
      this.particles.hitEffect(this.opponentBoxer.x, this.opponentBoxer.y);
      this.soundManager.playPunch();
      this.updateHealthBars();

      // Проверка нокаута
      if (this.opponentHealth <= 0) {
        this.knockout('player');
      }
    });

    // Расход выносливости
    this.playerStamina = Math.max(0, this.playerStamina - 2);
  }

  private opponentAttack() {
    const { power, speed } = this.config.opponent;
    const { defense } = this.config.player;

    const hitChance = speed / (speed + defense);
    if (Math.random() > hitChance) {
      this.playerBoxer.dodge();
      return;
    }

    const baseDamage = power / 10;
    const staminaMultiplier = this.opponentStamina / 100;
    const damage = baseDamage * staminaMultiplier * (0.8 + Math.random() * 0.4);

    this.opponentBoxer.punch(() => {
      this.playerHealth -= damage;
      this.playerBoxer.hit();
      this.particles.hitEffect(this.playerBoxer.x, this.playerBoxer.y);
      this.soundManager.playPunch();
      this.updateHealthBars();

      if (this.playerHealth <= 0) {
        this.knockout('opponent');
      }
    });

    this.opponentStamina = Math.max(0, this.opponentStamina - 2);
  }

  private updateHealthBars() {
    const playerBar = this.data.get('playerHealthBar') as Phaser.GameObjects.Rectangle;
    const opponentBar = this.data.get('opponentHealthBar') as Phaser.GameObjects.Rectangle;

    if (playerBar) {
      playerBar.setSize((Math.max(0, this.playerHealth) / 100) * 200, 20);
      playerBar.setFillStyle(this.playerHealth > 30 ? 0x00ff00 : 0xff0000);
    }

    if (opponentBar) {
      opponentBar.setSize((Math.max(0, this.opponentHealth) / 100) * 200, 20);
      opponentBar.setFillStyle(this.opponentHealth > 30 ? 0x00ff00 : 0xff0000);
    }
  }

  private endRound() {
    this.currentRound++;

    if (this.currentRound > this.maxRounds) {
      // Бой окончен - победа по очкам
      this.endFight(this.playerHealth > this.opponentHealth ? 'player' : 'opponent', false);
    } else {
      // Восстановление выносливости между раундами
      this.playerStamina = Math.min(100, this.playerStamina + 30);
      this.opponentStamina = Math.min(100, this.opponentStamina + 30);

      // Следующий раунд
      this.time.delayedCall(1000, () => {
        this.simulateRound();
      });
    }
  }

  private knockout(winner: 'player' | 'opponent') {
    this.fightActive = false;
    
    if (winner === 'player') {
      this.opponentBoxer.knockout();
    } else {
      this.playerBoxer.knockout();
    }

    this.soundManager.playKnockout();
    this.particles.knockoutEffect(
      winner === 'player' ? this.opponentBoxer.x : this.playerBoxer.x,
      winner === 'player' ? this.opponentBoxer.y : this.playerBoxer.y
    );

    this.time.delayedCall(2000, () => {
      this.endFight(winner, true);
    });
  }

  private endFight(winner: 'player' | 'opponent', knockout: boolean) {
    const result: FightResult = {
      winner,
      knockout,
      rounds: this.currentRound,
      damage: {
        player: 100 - this.playerHealth,
        opponent: 100 - this.opponentHealth
      }
    };

    // Показать результат
    this.showResult(result);

    // Вызвать callback через 3 секунды
    this.time.delayedCall(3000, () => {
      this.config.onComplete(result);
    });
  }

  private showResult(result: FightResult) {
    const { width, height } = this.cameras.main;

    // Затемнение
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // Текст результата
    const resultText = result.winner === 'player' ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ';
    const color = result.winner === 'player' ? '#00ff00' : '#ff0000';

    this.add.text(width / 2, height / 2 - 50, resultText, {
      fontSize: '64px',
      color: color,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    if (result.knockout) {
      this.add.text(width / 2, height / 2 + 20, 'НОКАУТ!', {
        fontSize: '48px',
        color: '#ffff00',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    this.add.text(width / 2, height / 2 + 80, `Раунд ${result.rounds}`, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }
}
