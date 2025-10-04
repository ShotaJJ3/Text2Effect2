import React, { useEffect, useState } from 'react';

interface RandomEmotionEffectProps {
  isActive: boolean;
  emotion: 'happy' | 'joyful' | 'sad' | 'angry' | 'normal';
  intensity?: 'subtle' | 'moderate' | 'strong';
}

interface RandomElement {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  type: string;
  color: string;
  emoji?: string;
}

const RandomEmotionEffect: React.FC<RandomEmotionEffectProps> = ({
  isActive,
  emotion,
  intensity = 'moderate',
}) => {
  const [elements, setElements] = useState<RandomElement[]>([]);

  // 感情別のランダムエフェクト設定
  const getEmotionSettings = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return {
          types: ['star', 'sparkle', 'heart', 'balloon'],
          emojis: ['⭐', '✨', '💖', '🎈', '🎉', '🎊'],
          colors: ['#ffd700', '#ff69b4', '#ff6347', '#32cd32', '#ffa500'],
          shapes: 'round',
        };
      case 'joyful':
        return {
          types: ['flower', 'butterfly', 'sunshine', 'rainbow'],
          emojis: ['🌻', '🦋', '☀️', '🌈', '🌺', '🌼'],
          colors: ['#ffd700', '#ff69b4', '#ff6347', '#32cd32', '#00bfff'],
          shapes: 'organic',
        };
      case 'sad':
        return {
          types: ['tear', 'cloud', 'droplet', 'mist'],
          emojis: ['💧', '☁️', '💦', '🌫️', '❄️', '🌧️'],
          colors: ['#4169e1', '#87ceeb', '#b0c4de', '#778899', '#708090'],
          shapes: 'flowing',
        };
      case 'angry':
        return {
          types: ['flame', 'spark', 'burst', 'shock'],
          emojis: ['🔥', '💥', '⚡', '💢', '😡', '🌪️'],
          colors: ['#ff4500', '#dc143c', '#ff6347', '#ffd700', '#ff0000'],
          shapes: 'sharp',
        };
      case 'normal':
        return {
          types: ['dot', 'line', 'circle', 'square'],
          emojis: ['⚪', '⚫', '🔘', '⬜', '⬛', '🔳'],
          colors: ['#808080', '#a9a9a9', '#c0c0c0', '#d3d3d3', '#696969'],
          shapes: 'geometric',
        };
      default:
        return {
          types: ['dot'],
          emojis: ['⚪'],
          colors: ['#808080'],
          shapes: 'round',
        };
    }
  };

  useEffect(() => {
    if (!isActive) {
      setElements([]);
      return;
    }

    const settings = getEmotionSettings(emotion);
    const elementCount =
      intensity === 'subtle' ? 15 : intensity === 'moderate' ? 25 : 35;
    const spawnInterval =
      intensity === 'subtle' ? 1000 : intensity === 'moderate' ? 700 : 500;

    // ランダム要素を生成
    const spawnElement = () => {
      if (elements.length < elementCount) {
        const newElement: RandomElement = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speedX: (Math.random() - 0.5) * (emotion === 'angry' ? 4 : 2),
          speedY: (Math.random() - 0.5) * (emotion === 'angry' ? 4 : 2),
          size:
            emotion === 'angry'
              ? 8 + Math.random() * 12
              : 6 + Math.random() * 10,
          opacity: 0.4 + Math.random() * 0.5,
          life: 300 + Math.random() * 400,
          type: settings.types[
            Math.floor(Math.random() * settings.types.length)
          ],
          color:
            settings.colors[Math.floor(Math.random() * settings.colors.length)],
          emoji:
            Math.random() > 0.5
              ? settings.emojis[
                  Math.floor(Math.random() * settings.emojis.length)
                ]
              : undefined,
        };
        setElements((prev) => [...prev, newElement]);
      }
    };

    const spawnIntervalId = setInterval(spawnElement, spawnInterval);

    // アニメーション
    const animate = () => {
      setElements((prev) =>
        prev
          .map((element) => ({
            ...element,
            x: element.x + element.speedX,
            y: element.y + element.speedY,
            life: element.life - 1,
            opacity: Math.max(0, element.opacity - 0.002),
            speedX: element.speedX + (Math.random() - 0.5) * 0.1,
            speedY: element.speedY + (Math.random() - 0.5) * 0.1,
          }))
          .filter((element) => element.life > 0 && element.opacity > 0.1)
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, emotion, intensity, elements.length]);

  const renderElement = (element: RandomElement) => {
    const settings = getEmotionSettings(emotion);

    if (element.emoji) {
      return (
        <div
          key={element.id}
          className="absolute pointer-events-none"
          style={{
            left: element.x,
            top: element.y,
            fontSize: element.size,
            opacity: element.opacity,
            transform: `translate(-50%, -50%) rotate(${element.life * 0.5}deg)`,
            filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))',
          }}
        >
          {element.emoji}
        </div>
      );
    }

    // 形状ベースの要素
    const borderRadius =
      settings.shapes === 'round'
        ? '50%'
        : settings.shapes === 'square'
        ? '0%'
        : settings.shapes === 'sharp'
        ? '20%'
        : '50%';

    return (
      <div
        key={element.id}
        className="absolute pointer-events-none"
        style={{
          left: element.x,
          top: element.y,
          width: element.size,
          height: element.size,
          opacity: element.opacity,
          backgroundColor: element.color,
          borderRadius: borderRadius,
          transform: `translate(-50%, -50%) rotate(${element.life * 0.2}deg)`,
          boxShadow: `0 0 ${element.size}px ${element.color}`,
          animation:
            emotion === 'angry'
              ? 'pulse 0.5s infinite'
              : emotion === 'happy'
              ? 'bounce 1s infinite'
              : emotion === 'joyful'
              ? 'float 2s ease-in-out infinite'
              : 'none',
        }}
      />
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden">
      {elements.map(renderElement)}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          40% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
          60% {
            transform: translate(-50%, -50%) translateY(-5px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default RandomEmotionEffect;
