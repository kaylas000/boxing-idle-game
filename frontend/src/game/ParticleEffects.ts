import Phaser from 'phaser';

export class ParticleEffects {
  private scene: Phaser.Scene;
  private hitParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private knockoutParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createEmitters();
  }

  private createEmitters() {
    // Эффект попадания
    try {
      const hitEmitter = this.scene.add.particles(0, 0, 'particle', {
        speed: { min: 50, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 300,
        gravityY: 200
      });
      hitEmitter.stop();
      this.hitParticles = hitEmitter;
    } catch (e) {
      console.warn('Particles not loaded, using fallback');
    }
  }

  hitEffect(x: number, y: number) {
    if (this.hitParticles) {
      this.hitParticles.setPosition(x, y);
      this.hitParticles.explode(10);
    } else {
      // Fallback: простые круги
      this.createSimpleHitEffect(x, y);
    }
  }

  knockoutEffect(x: number, y: number) {
    if (this.hitParticles) {
      this.hitParticles.setPosition(x, y);
      this.hitParticles.explode(50);
    } else {
      this.createSimpleKnockoutEffect(x, y);
    }

    // Эффект вспышки
    this.createFlashEffect(x, y);
  }

  private createSimpleHitEffect(x: number, y: number) {
    // Создать несколько красных кругов
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5;
      const circle = this.scene.add.circle(
        x,
        y,
        5,
        0xff0000
      );

      this.scene.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * 50,
        y: y + Math.sin(angle) * 50,
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () => circle.destroy()
      });
    }
  }

  private createSimpleKnockoutEffect(x: number, y: number) {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const circle = this.scene.add.circle(
        x,
        y,
        8,
        0xffff00
      );

      this.scene.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * 100,
        y: y + Math.sin(angle) * 100,
        alpha: 0,
        scale: 0,
        duration: 500,
        onComplete: () => circle.destroy()
      });
    }
  }

  private createFlashEffect(x: number, y: number) {
    const flash = this.scene.add.circle(x, y, 100, 0xffffff, 0.8);
    
    this.scene.tweens.add({
      targets: flash,
      scale: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => flash.destroy()
    });
  }

  starEffect(x: number, y: number, count: number = 5) {
    // Звёздочки при нокдауне
    for (let i = 0; i < count; i++) {
      const star = this.scene.add.star(
        x,
        y - 50,
        5,
        10,
        20,
        0xffff00
      );

      const angle = (Math.PI * 2 * i) / count;
      const radius = 40;

      this.scene.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * radius,
        y: y - 50 + Math.sin(angle) * radius,
        angle: 360,
        duration: 2000,
        repeat: -1
      });

      // Удалить через 3 секунды
      this.scene.time.delayedCall(3000, () => {
        this.scene.tweens.add({
          targets: star,
          alpha: 0,
          duration: 500,
          onComplete: () => star.destroy()
        });
      });
    }
  }
}
