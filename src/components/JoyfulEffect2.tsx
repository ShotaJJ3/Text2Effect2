import React, { useEffect, useState } from 'react';

interface JoyfulEffect2Props {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

interface Butterfly {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  wingPhase: number;
  color: string;
}

const JoyfulEffect2: React.FC<JoyfulEffect2Props> = ({
  isActive,
  intensity = 'medium',
}) => {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);

  const colors = [
    '#ff69b4',
    '#ff1493',
    '#ffc0cb',
    '#da70d6',
    '#ee82ee',
    '#dda0dd',
  ];

  useEffect(() => {
    if (!isActive) {
      setButterflies([]);
      return;
    }

    const butterflyCount =
      intensity === 'light' ? 8 : intensity === 'medium' ? 15 : 25;
    const spawnInterval =
      intensity === 'light' ? 2000 : intensity === 'medium' ? 1500 : 1000;

    // 蝶を生成
    const spawnButterfly = () => {
      if (butterflies.length < butterflyCount) {
        const newButterfly: Butterfly = {
          id: Date.now() + Math.random(),
          x: Math.random() > 0.5 ? -50 : window.innerWidth + 50,
          y: Math.random() * window.innerHeight,
          speedX: (Math.random() - 0.5) * 3,
          speedY: (Math.random() - 0.5) * 2,
          size: 20 + Math.random() * 30,
          opacity: 0.6 + Math.random() * 0.4,
          life: 800 + Math.random() * 400,
          wingPhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setButterflies((prev) => [...prev, newButterfly]);
      }
    };

    const spawnIntervalId = setInterval(spawnButterfly, spawnInterval);

    // アニメーション
    const animate = () => {
      setButterflies((prev) =>
        prev
          .map((butterfly) => ({
            ...butterfly,
            x: butterfly.x + butterfly.speedX,
            y:
              butterfly.y +
              butterfly.speedY +
              Math.sin(butterfly.wingPhase) * 0.5,
            wingPhase: butterfly.wingPhase + 0.3,
            life: butterfly.life - 1,
            opacity: Math.max(0, butterfly.opacity - 0.001),
          }))
          .filter((butterfly) => butterfly.life > 0 && butterfly.opacity > 0.1)
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, intensity, butterflies.length]);

  const renderButterfly = (butterfly: Butterfly) => {
    const wingOffset = Math.sin(butterfly.wingPhase) * 5;

    return (
      <div
        key={butterfly.id}
        className="absolute pointer-events-none"
        style={{
          left: butterfly.x,
          top: butterfly.y,
          fontSize: butterfly.size,
          opacity: butterfly.opacity,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            position: 'relative',
            filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))',
          }}
        >
          {/* 蝶の体 */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '4px',
              height: '20px',
              backgroundColor: '#8b4513',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          />
          {/* 左上の羽 */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '15px',
              height: '12px',
              backgroundColor: butterfly.color,
              borderRadius: '50% 10% 10% 50%',
              transform: `translate(-50%, -50%) rotate(${wingOffset}deg) translate(-8px, -6px)`,
              zIndex: 1,
            }}
          />
          {/* 右上の羽 */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '15px',
              height: '12px',
              backgroundColor: butterfly.color,
              borderRadius: '10% 50% 50% 10%',
              transform: `translate(-50%, -50%) rotate(${-wingOffset}deg) translate(8px, -6px)`,
              zIndex: 1,
            }}
          />
          {/* 左下の羽 */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '12px',
              height: '10px',
              backgroundColor: butterfly.color,
              borderRadius: '50% 10% 10% 50%',
              transform: `translate(-50%, -50%) rotate(${
                wingOffset * 0.8
              }deg) translate(-7px, 8px)`,
              zIndex: 1,
            }}
          />
          {/* 右下の羽 */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '12px',
              height: '10px',
              backgroundColor: butterfly.color,
              borderRadius: '10% 50% 50% 10%',
              transform: `translate(-50%, -50%) rotate(${
                -wingOffset * 0.8
              }deg) translate(7px, 8px)`,
              zIndex: 1,
            }}
          />
        </div>
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden">
      {butterflies.map(renderButterfly)}
    </div>
  );
};

export default JoyfulEffect2;
