import React, { useEffect, useState } from 'react';

interface NormalMoodEffectProps {
  isActive: boolean;
  intensity?: 'subtle' | 'moderate' | 'strong';
}

interface MoodElement {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  type: 'neutral' | 'calm' | 'peaceful';
}

const NormalMoodEffect: React.FC<NormalMoodEffectProps> = ({
  isActive,
  intensity = 'moderate',
}) => {
  const [moodElements, setMoodElements] = useState<MoodElement[]>([]);
  const [breathingScale, setBreathingScale] = useState(1);

  // 呼吸のようなアニメーション
  useEffect(() => {
    if (!isActive) return;

    const breathe = () => {
      setBreathingScale((prev) => 1 + Math.sin(Date.now() * 0.001) * 0.02);
    };

    const interval = setInterval(breathe, 16);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setMoodElements([]);
      return;
    }

    const elementCount =
      intensity === 'subtle' ? 20 : intensity === 'moderate' ? 35 : 50;
    const spawnInterval =
      intensity === 'subtle' ? 800 : intensity === 'moderate' ? 500 : 300;

    // ムード要素を生成
    const spawnElement = () => {
      if (moodElements.length < elementCount) {
        const types: ('neutral' | 'calm' | 'peaceful')[] = [
          'neutral',
          'calm',
          'peaceful',
        ];
        const newElement: MoodElement = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          size: 6 + Math.random() * 8,
          opacity: 0.3 + Math.random() * 0.4,
          life: 400 + Math.random() * 400,
          type: types[Math.floor(Math.random() * types.length)],
        };
        setMoodElements((prev) => [...prev, newElement]);
      }
    };

    const spawnIntervalId = setInterval(spawnElement, spawnInterval);

    // アニメーション
    const animate = () => {
      setMoodElements((prev) =>
        prev
          .map((element) => ({
            ...element,
            x: element.x + element.speedX,
            y: element.y + element.speedY,
            life: element.life - 1,
            opacity: Math.max(0, element.opacity - 0.001),
          }))
          .filter((element) => element.life > 0 && element.opacity > 0.1)
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, intensity, moodElements.length]);

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      style={{
        transform: `scale(${breathingScale})`,
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      {/* ムード要素 */}
      {moodElements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full"
          style={{
            left: element.x,
            top: element.y,
            width: element.size,
            height: element.size,
            opacity: element.opacity,
            backgroundColor:
              element.type === 'neutral'
                ? '#9ca3af'
                : element.type === 'calm'
                ? '#6b7280'
                : '#4b5563',
            boxShadow: '0 0 4px rgba(156, 163, 175, 0.3)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* 穏やかなグラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/5 via-gray-200/3 to-gray-300/5" />

      {/* 中央の穏やかな円 */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300/20"
        style={{
          width: '200px',
          height: '200px',
          animation: 'gentle-pulse 4s ease-in-out infinite',
        }}
      />

      {/* 小さな静かな要素 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400/30 rounded-full animate-pulse" />
      <div
        className="absolute top-3/4 right-1/4 w-3 h-3 bg-gray-500/25 rounded-full animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-1 h-1 bg-gray-400/40 rounded-full animate-pulse"
        style={{ animationDelay: '2s' }}
      />

      <style jsx>{`
        @keyframes gentle-pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default NormalMoodEffect;
