import Phaser from 'phaser';

export class SoundManager {
  private scene: Phaser.Scene;
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initSounds();
  }

  private initSounds() {
    // В production версии здесь будут загружены реальные звуки
    // Сейчас используем Web Audio API для генерации звуков
  }

  playPunch() {
    // Звук удара
    this.playTone(200, 0.1, 0.1);
  }

  playHit() {
    // Звук попадания
    this.playTone(150, 0.15, 0.15);
  }

  playMiss() {
    // Звук промаха (свист)
    this.playTone(800, 0.05, 0.2, 'sine');
  }

  playKnockout() {
    // Звук нокаута (драматичный)
    this.playTone(100, 0.3, 0.5);
    setTimeout(() => this.playTone(80, 0.3, 0.3), 200);
  }

  playBellRound() {
    // Звук гонга
    this.playTone(400, 0.2, 0.8, 'triangle');
  }

  playCrowdCheer() {
    // Шум толпы (белый шум)
    this.playNoise(1.0, 0.5);
  }

  private playTone(
    frequency: number,
    duration: number,
    volume: number = 0.3,
    type: OscillatorType = 'square'
  ) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Audio not available');
    }
  }

  private playNoise(volume: number, duration: number) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = audioContext.sampleRate * duration;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * volume;
      }

      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      source.start();
    } catch (e) {
      console.warn('Audio not available');
    }
  }
}
