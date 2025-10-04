import React, { useEffect, useState } from 'react';

interface RainEffectProps {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

const RainEffect: React.FC<RainEffectProps> = ({
  isActive,
  intensity = 'medium',
}) => {
  const [raindrops, setRaindrops] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    if (!isActive) {
      setRaindrops([]);
      return;
    }

    const dropCount =
      intensity === 'light' ? 50 : intensity === 'medium' ? 100 : 150;

    // 雨粒を生成
    const generateRaindrops = () => {
      const newRaindrops = Array.from({ length: dropCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 2 + Math.random() * 4,
        length: 10 + Math.random() * 20,
        opacity: 0.3 + Math.random() * 0.4,
      }));
      setRaindrops(newRaindrops);
    };

    generateRaindrops();

    const animate = () => {
      setRaindrops((prev) =>
        prev
          .map((drop) => ({
            ...drop,
            y: drop.y + drop.speed,
            x: drop.x + (Math.random() - 0.5) * 0.5, // わずかな横揺れ
          }))
          .filter((drop) => drop.y < window.innerHeight + 100)
      );
    };

    const interval = setInterval(animate, 16); // 60fps

    return () => clearInterval(interval);
  }, [isActive, intensity]);

  // 雨粒が画面外に出たら新しい位置に再配置
  useEffect(() => {
    if (!isActive) return;

    const resetRaindrops = () => {
      setRaindrops((prev) =>
        prev.map((drop) =>
          drop.y > window.innerHeight
            ? {
                ...drop,
                y: -Math.random() * 100,
                x: Math.random() * window.innerWidth,
              }
            : drop
        )
      );
    };

    const interval = setInterval(resetRaindrops, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute bg-blue-200 opacity-60"
          style={{
            left: drop.x,
            top: drop.y,
            width: '1px',
            height: drop.length,
            opacity: drop.opacity,
            transform: 'rotate(15deg)',
            boxShadow: '0 0 2px rgba(59, 130, 246, 0.5)',
          }}
        />
      ))}

      {/* 雨の霧効果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-blue-900/20" />
    </div>
  );
};

export default RainEffect;
