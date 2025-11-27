import React, { useEffect, useState } from 'react';

interface SadEffect2Props {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

interface Snowflake {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  rotation: number;
  rotationSpeed: number;
}

const SadEffect2: React.FC<SadEffect2Props> = ({
  isActive,
  intensity = 'medium',
}) => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    if (!isActive) {
      setSnowflakes([]);
      return;
    }

    const snowflakeCount =
      intensity === 'light' ? 40 : intensity === 'medium' ? 80 : 120;
    const spawnInterval =
      intensity === 'light' ? 600 : intensity === 'medium' ? 400 : 250;

    // 雪を生成
    const spawnSnowflake = () => {
      if (snowflakes.length < snowflakeCount) {
        const newSnowflake: Snowflake = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: -10,
          speedX: (Math.random() - 0.5) * 1,
          speedY: 1 + Math.random() * 3,
          size: 2 + Math.random() * 6,
          opacity: 0.3 + Math.random() * 0.7,
          life: 1000 + Math.random() * 2000,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 2,
        };
        setSnowflakes((prev) => [...prev, newSnowflake]);
      }
    };

    const spawnIntervalId = setInterval(spawnSnowflake, spawnInterval);

    // アニメーション
    const animate = () => {
      setSnowflakes((prev) =>
        prev
          .map((snowflake) => ({
            ...snowflake,
            x: snowflake.x + snowflake.speedX,
            y: snowflake.y + snowflake.speedY,
            rotation: snowflake.rotation + snowflake.rotationSpeed,
            life: snowflake.life - 1,
          }))
          .filter(
            (snowflake) =>
              snowflake.life > 0 && snowflake.y < window.innerHeight + 100
          )
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, intensity, snowflakes.length]);

  const renderSnowflake = (snowflake: Snowflake) => {
    const points = [];
    const angle = (Math.PI * 2) / 6;

    for (let i = 0; i < 6; i++) {
      const x = Math.cos(angle * i) * snowflake.size;
      const y = Math.sin(angle * i) * snowflake.size;
      points.push(`${x},${y}`);
    }

    return (
      <div
        key={snowflake.id}
        className="absolute pointer-events-none"
        style={{
          left: snowflake.x,
          top: snowflake.y,
          opacity: snowflake.opacity,
          transform: `translate(-50%, -50%) rotate(${snowflake.rotation}deg)`,
        }}
      >
        <svg
          width={snowflake.size * 2}
          height={snowflake.size * 2}
          style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' }}
        >
          <polygon
            points={points.join(' ')}
            fill="white"
            stroke="lightblue"
            strokeWidth="0.5"
          />
        </svg>
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden">
      {snowflakes.map(renderSnowflake)}
    </div>
  );
};

export default SadEffect2;
