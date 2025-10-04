import React, { useEffect, useState } from 'react';

interface JoyBubbleEffectProps {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  opacity: number;
}

const JoyBubbleEffect: React.FC<JoyBubbleEffectProps> = ({
  isActive,
  intensity = 'medium',
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const colors = [
    '#FF9ECD', // パステルピンク
    '#87CEEB', // スカイブルー
    '#98FB98', // ペールグリーン
    '#DDA0DD', // パステルパープル
    '#FFB347', // パステルオレンジ
    '#B0E0E6', // パウダーブルー
    '#F0E68C', // カーキ
    '#E6E6FA', // ラベンダー
  ];

  useEffect(() => {
    if (!isActive) {
      setBubbles([]);
      return;
    }

    // バブルを生成
    const createBubble = () => {
      const newBubble: Bubble = {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        size: Math.random() * 30 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: -(Math.random() * 2 + 1),
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.4 + 0.4,
      };
      setBubbles((prev) => [...prev, newBubble]);
    };

    // バブルのアニメーション
    const animateBubbles = () => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y + bubble.speedY,
            x: bubble.x + Math.sin(bubble.wobbleOffset) * 2,
            wobbleOffset: bubble.wobbleOffset + bubble.wobbleSpeed,
          }))
          .filter((bubble) => bubble.y > -100)
      );
    };

    const spawnInterval = setInterval(
      createBubble,
      intensity === 'light' ? 1000 : intensity === 'medium' ? 700 : 400
    );
    const animationInterval = setInterval(animateBubbles, 1000 / 60);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(animationInterval);
    };
  }, [isActive, intensity]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          style={{
            position: 'absolute',
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
            borderRadius: '50%',
            opacity: bubble.opacity,
            transition: 'opacity 0.3s',
            filter: 'blur(2px)',
            boxShadow: `0 0 10px ${bubble.color}44`,
          }}
        />
      ))}
    </div>
  );
};

export default JoyBubbleEffect;
