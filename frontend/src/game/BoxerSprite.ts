import Phaser from 'phaser';

export class BoxerSprite extends Phaser.GameObjects.Sprite {
  private nameText: Phaser.GameObjects.Text;
  private stats: any;
  private side: 'player' | 'opponent';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    stats: any,
    side: 'player' | 'opponent'
  ) {
    super(scene, x, y, texture);
    this.stats = stats;
    this.side = side;

    scene.add.existing(this);
    this.setScale(2);
    this.setFlipX(side === 'opponent');

    // Имя под боксёром
    this.nameText = scene.add.text(x, y + 80, stats.name, {
      fontSize: '16px',
      color: side === 'player' ? '#00ff00' : '#ff0000',
      fontStyle: 'bold'
    });
    this.nameText.setOrigin(0.5);

    // Idle анимация
    this.playIdleAnimation();
  }

  private playIdleAnimation() {
    // Плавное покачивание
    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  punch(onComplete: () => void) {
    // Анимация удара
    const direction = this.side === 'player' ? 1 : -1;
    const originalX = this.x;

    this.scene.tweens.add({
      targets: this,
      x: this.x + (50 * direction),
      duration: 100,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => {
        this.x = originalX;
        onComplete();
      }
    });

    // Поворот при ударе
    this.scene.tweens.add({
      targets: this,
      angle: 10 * direction,
      duration: 100,
      yoyo: true
    });
  }

  hit() {
    // Анимация получения урона
    const originalTint = this.tintTopLeft;
    
    // Красная вспышка
    this.setTint(0xff0000);
    
    // Откат назад
    const direction = this.side === 'player' ? -1 : 1;
    const originalX = this.x;

    this.scene.tweens.add({
      targets: this,
      x: this.x + (30 * direction),
      duration: 150,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => {
        this.x = originalX;
      }
    });

    // Убрать красный оттенок
    this.scene.time.delayedCall(200, () => {
      this.clearTint();
    });

    // Тряска
    this.scene.tweens.add({
      targets: this,
      angle: { from: -5, to: 5 },
      duration: 50,
      repeat: 3,
      yoyo: true,
      onComplete: () => {
        this.angle = 0;
      }
    });
  }

  dodge() {
    // Анимация уклонения
    const originalX = this.x;
    const originalY = this.y;
    const direction = this.side === 'player' ? -1 : 1;

    this.scene.tweens.add({
      targets: this,
      x: this.x + (40 * direction),
      y: this.y - 20,
      duration: 200,
      ease: 'Back.easeOut',
      yoyo: true,
      onComplete: () => {
        this.x = originalX;
        this.y = originalY;
      }
    });
  }

  knockout() {
    // Анимация нокаута
    this.scene.tweens.killTweensOf(this);

    // Падение
    this.scene.tweens.add({
      targets: this,
      angle: 90 * (this.side === 'player' ? 1 : -1),
      y: this.y + 50,
      alpha: 0.5,
      duration: 1000,
      ease: 'Bounce.easeOut'
    });

    // Затемнение имени
    this.scene.tweens.add({
      targets: this.nameText,
      alpha: 0.3,
      duration: 500
    });
  }

  destroy(fromScene?: boolean) {
    this.nameText.destroy();
    super.destroy(fromScene);
  }
}
