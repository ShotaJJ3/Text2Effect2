import React, { useEffect, useState } from 'react';

interface AngryEffect2Props {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

interface Lava {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  color: string;
  trail: Array<{ x: number; y: number; opacity: number; size: number }>;
}

const AngryEffect2: React.FC<AngryEffect2Props> = ({
  isActive,
  intensity = 'medium',
}) => {
  const [lavas, setLavas] = useState<Lava[]>([]);

  const colors = [
    '#ff4500',
    '#ff6347',
    '#ff0000',
    '#ff8c00',
    '#ffd700',
    '#8b0000',
  ];

  useEffect(() => {
    if (!isActive) {
      setLavas([]);
      return;
    }

    const lavaCount =
      intensity === 'light' ? 50 : intensity === 'medium' ? 80 : 120;
    const spawnInterval =
      intensity === 'light' ? 4000 : intensity === 'medium' ? 3000 : 2500;

    // 溶岩を一斉に生成（大爆発）
    const spawnLava = () => {
      if (lavas.length < lavaCount) {
        const newLavas: Lava[] = [];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight + 50;

        // 一度にたくさんの細かい溶岩を生成
        const batchSize =
          intensity === 'light' ? 15 : intensity === 'medium' ? 25 : 35;

        for (let i = 0; i < batchSize; i++) {
          const angle = (Math.PI * 2 * i) / batchSize + Math.random() * 0.5;
          const distance = 50 + Math.random() * 100;
          const speed = 15 + Math.random() * 20;

          newLavas.push({
            id: Date.now() + Math.random() + i,
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed - 10, // 少し上向きに
            size: 8 + Math.random() * 16, // 細かいサイズ
            opacity: 0.9 + Math.random() * 0.1,
            life: 600 + Math.random() * 800,
            color: colors[Math.floor(Math.random() * colors.length)],
            trail: [],
          });
        }

        setLavas((prev) => [...prev, ...newLavas]);
      }
    };

    const spawnIntervalId = setInterval(spawnLava, spawnInterval);

    // アニメーション
    const animate = () => {
      setLavas((prev) =>
        prev
          .map((lava) => {
            const newTrail = [
              { x: lava.x, y: lava.y, opacity: 1, size: lava.size },
              ...lava.trail.slice(0, 8).map((point) => ({
                ...point,
                opacity: point.opacity * 0.8,
                size: point.size * 0.95,
              })),
            ].filter((point) => point.opacity > 0.02);

            return {
              ...lava,
              x: lava.x + lava.speedX,
              y: lava.y + lava.speedY,
              life: lava.life - 1,
              trail: newTrail,
              speedY: lava.speedY + 0.8, // 重力を調整
              speedX: lava.speedX + (Math.random() - 0.5) * 0.8,
            };
          })
          .filter(
            (lava) =>
              lava.life > 0 &&
              lava.x > -100 &&
              lava.x < window.innerWidth + 100 &&
              lava.y > -100 &&
              lava.y < window.innerHeight + 100
          )
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, intensity, lavas.length]);

  const renderLava = (lava: Lava) => {
    return (
      <div key={lava.id} className="absolute pointer-events-none">
        {/* トレイル */}
        {lava.trail.map((point, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              left: point.x,
              top: point.y,
              width: point.size,
              height: point.size,
              backgroundColor: lava.color,
              opacity: point.opacity * 0.7,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(3px)',
              boxShadow: `0 0 ${point.size * 1.5}px ${lava.color}, 0 0 ${
                point.size * 3
              }px ${lava.color}`,
            }}
          />
        ))}

        {/* メインの溶岩塊 */}
        <div
          className="absolute rounded-full"
          style={{
            left: lava.x,
            top: lava.y,
            width: lava.size,
            height: lava.size,
            backgroundColor: lava.color,
            opacity: lava.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${lava.size * 2}px ${lava.color}, 0 0 ${
              lava.size * 4
            }px ${lava.color}, 0 0 ${lava.size * 6}px ${lava.color}`,
            animation: 'volcano-pulse 0.4s infinite alternate',
          }}
        />

        {/* 内側の炎 */}
        <div
          className="absolute rounded-full"
          style={{
            left: lava.x,
            top: lava.y,
            width: lava.size * 0.7,
            height: lava.size * 0.7,
            backgroundColor: '#ffd700',
            opacity: lava.opacity * 0.9,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(3px)',
            animation: 'volcano-flicker 0.15s infinite alternate',
          }}
        />

        {/* 火花 */}
        <div
          className="absolute rounded-full"
          style={{
            left: lava.x + (Math.random() - 0.5) * lava.size,
            top: lava.y + (Math.random() - 0.5) * lava.size,
            width: lava.size * 0.4,
            height: lava.size * 0.4,
            backgroundColor: '#ffff00',
            opacity: lava.opacity * 0.8,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(1px)',
            boxShadow: '0 0 8px #ffff00',
            animation: 'spark-flicker 0.2s infinite alternate',
          }}
        />
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden">
      {lavas.map(renderLava)}

      {/* 火山の背景エフェクト */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[800px] h-64 opacity-40"
        style={{
          background:
            'linear-gradient(45deg, #ff8c69, #ffa07a, #ff6b6b, #cd5c5c, #ff8c69)',
          borderRadius: '50% 50% 0 0',
          filter: 'blur(16px)',
          animation: 'volcano-glow 2s ease-in-out infinite alternate',
        }}
      />

      {/* 追加の爆発エフェクト */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1000px] h-48 opacity-35"
        style={{
          background: 'radial-gradient(ellipse, #ff6b6b, #ffa07a, transparent)',
          borderRadius: '50%',
          filter: 'blur(25px)',
          animation: 'volcano-explosion 1.5s ease-in-out infinite alternate',
        }}
      />

      {/* 超巨大爆発エフェクト */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1200px] h-32 opacity-20"
        style={{
          background:
            'radial-gradient(circle, #ffffff, #ff6b6b, #ffa07a, transparent)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'mega-explosion 3s ease-in-out infinite alternate',
        }}
      />

      <style jsx>{`
        @keyframes volcano-pulse {
          0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
          }
        }
        @keyframes volcano-flicker {
          0% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }
        @keyframes spark-flicker {
          0% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(0.6);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.8);
          }
        }
        @keyframes volcano-glow {
          0% {
            opacity: 0.4;
            transform: translateX(-50%) scale(1);
          }
          100% {
            opacity: 0.8;
            transform: translateX(-50%) scale(1.4);
          }
        }
        @keyframes volcano-explosion {
          0% {
            opacity: 0.3;
            transform: translateX(-50%) scale(0.7);
          }
          100% {
            opacity: 0.7;
            transform: translateX(-50%) scale(1.6);
          }
        }
        @keyframes mega-explosion {
          0% {
            opacity: 0.1;
            transform: translateX(-50%) scale(0.5);
          }
          100% {
            opacity: 0.5;
            transform: translateX(-50%) scale(2);
          }
        }
      `}</style>
    </div>
  );
};

export default AngryEffect2;
