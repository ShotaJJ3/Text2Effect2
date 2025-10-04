import React, { useEffect, useState } from 'react';

interface SakuraEffectProps {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

interface SakuraPetal {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  color: string;
}

const SakuraEffect: React.FC<SakuraEffectProps> = ({
  isActive,
  intensity = 'medium',
}) => {
  const [petals, setPetals] = useState<SakuraPetal[]>([]);

  const colors = ['#ffb3d1', '#ffc0cb', '#ffcccb', '#ffe4e1', '#f0e6ff'];

  useEffect(() => {
    if (!isActive) {
      setPetals([]);
      return;
    }

    const petalCount =
      intensity === 'light' ? 30 : intensity === 'medium' ? 60 : 100;

    // 桜の花びらを生成
    const generatePetals = () => {
      const newPetals = Array.from({ length: petalCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: (Math.random() - 0.5) * 2,
        speedY: 0.5 + Math.random() * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        size: 8 + Math.random() * 12,
        opacity: 0.4 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setPetals(newPetals);
    };

    generatePetals();

    const animate = () => {
      setPetals((prev) =>
        prev
          .map((petal) => ({
            ...petal,
            x: petal.x + petal.speedX,
            y: petal.y + petal.speedY,
            rotation: petal.rotation + petal.rotationSpeed,
            speedX: petal.speedX + (Math.random() - 0.5) * 0.1, // 風の効果
          }))
          .filter((petal) => petal.y < window.innerHeight + 100)
      );
    };

    const interval = setInterval(animate, 16); // 60fps

    return () => clearInterval(interval);
  }, [isActive, intensity]);

  // 花びらが画面外に出たら新しい位置に再配置
  useEffect(() => {
    if (!isActive) return;

    const resetPetals = () => {
      setPetals((prev) =>
        prev.map((petal) =>
          petal.y > window.innerHeight ||
          petal.x < -50 ||
          petal.x > window.innerWidth + 50
            ? {
                ...petal,
                y: -Math.random() * 100,
                x: Math.random() * window.innerWidth,
                speedX: (Math.random() - 0.5) * 2,
                speedY: 0.5 + Math.random() * 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 4,
                opacity: 0.4 + Math.random() * 0.6,
                color: colors[Math.floor(Math.random() * colors.length)],
              }
            : petal
        )
      );
    };

    const interval = setInterval(resetPetals, 2000);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: petal.x,
            top: petal.y,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            transform: `rotate(${petal.rotation}deg)`,
            filter: 'blur(0.5px)',
          }}
        >
          {/* 桜の花びらの形状 */}
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 20 20"
            style={{ fill: petal.color }}
          >
            <path d="M10 2C10 2 8 4 8 8C8 12 10 14 10 14C10 14 12 12 12 8C12 4 10 2 10 2Z" />
            <ellipse
              cx="10"
              cy="10"
              rx="3"
              ry="2"
              transform="rotate(45 10 10)"
            />
            <ellipse
              cx="10"
              cy="10"
              rx="3"
              ry="2"
              transform="rotate(-45 10 10)"
            />
          </svg>
        </div>
      ))}

      {/* 桜の霧効果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-pink-500/10" />
    </div>
  );
};

export default SakuraEffect;
