import React, { useEffect, useState } from 'react';

interface HappyEffect2Props {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  life: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
}

const HappyEffect2: React.FC<HappyEffect2Props> = ({
  isActive,
  intensity = 'medium',
}) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
  ];

  useEffect(() => {
    if (!isActive) {
      setConfetti([]);
      return;
    }

    const confettiCount =
      intensity === 'light' ? 30 : intensity === 'medium' ? 60 : 100;
    const spawnInterval =
      intensity === 'light' ? 800 : intensity === 'medium' ? 500 : 300;

    // 紙吹雪を生成
    const spawnConfetti = () => {
      if (confetti.length < confettiCount) {
        const shapes: ('circle' | 'square' | 'triangle' | 'star')[] = [
          'circle',
          'square',
          'triangle',
          'star',
        ];
        const newConfetti: Confetti = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: -10,
          speedX: (Math.random() - 0.5) * 4,
          speedY: 2 + Math.random() * 6,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 10,
          size: 4 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 300 + Math.random() * 400,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        };
        setConfetti((prev) => [...prev, newConfetti]);
      }
    };

    const spawnIntervalId = setInterval(spawnConfetti, spawnInterval);

    // アニメーション
    const animate = () => {
      setConfetti((prev) =>
        prev
          .map((item) => ({
            ...item,
            x: item.x + item.speedX,
            y: item.y + item.speedY,
            rotation: item.rotation + item.rotationSpeed,
            speedY: item.speedY + 0.1, // 重力
            life: item.life - 1,
          }))
          .filter((item) => item.life > 0 && item.y < window.innerHeight + 100)
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, intensity, confetti.length]);

  const renderShape = (item: Confetti) => {
    const baseStyle = {
      width: item.size,
      height: item.size,
      backgroundColor: item.color,
      position: 'absolute' as const,
      left: item.x,
      top: item.y,
      opacity: Math.max(0, item.life / 700),
      transform: `rotate(${item.rotation}deg)`,
      boxShadow: `0 0 4px ${item.color}`,
    };

    switch (item.shape) {
      case 'circle':
        return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
      case 'square':
        return <div style={{ ...baseStyle, borderRadius: '2px' }} />;
      case 'triangle':
        return (
          <div
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${item.size / 2}px solid transparent`,
              borderRight: `${item.size / 2}px solid transparent`,
              borderBottom: `${item.size}px solid ${item.color}`,
            }}
          />
        );
      case 'star':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: 'transparent',
              fontSize: item.size,
              color: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Arial',
            }}
          >
            ⭐
          </div>
        );
      default:
        return <div style={baseStyle} />;
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden">
      {confetti.map(renderShape)}
    </div>
  );
};

export default HappyEffect2;
