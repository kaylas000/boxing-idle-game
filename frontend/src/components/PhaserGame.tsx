import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { FightScene, FightConfig, FightResult } from '../game/FightScene';

interface PhaserGameProps {
  config: Omit<FightConfig, 'onComplete'>;
  onComplete: (result: FightResult) => void;
}

export default function PhaserGame({ config, onComplete }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#1a1a1a',
      scene: FightScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Phaser.Game(gameConfig);

    // Передать конфигурацию в сцену
    gameRef.current.scene.start('FightScene', {
      ...config,
      onComplete
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
      style={{ aspectRatio: '4/3' }}
    />
  );
}
