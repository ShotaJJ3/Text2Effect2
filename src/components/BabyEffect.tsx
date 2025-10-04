import React, { useEffect, useState } from 'react';

interface BabyEffectProps {
  isActive: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

interface Baby {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  imageUrl: string;
  rotation: number;
  rotationSpeed: number;
  bouncePhase: number;
}

const BabyEffect: React.FC<BabyEffectProps> = ({
  isActive,
  intensity = 'medium',
}) => {
  const [babies, setBabies] = useState<Baby[]>([]);

  // 赤ちゃんの写真URL（フリー素材）
  const babyImages = [
    'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
  ];

  useEffect(() => {
    if (!isActive) {
      setBabies([]);
      return;
    }

    const babyCount =
      intensity === 'light' ? 8 : intensity === 'medium' ? 15 : 25;
    const spawnInterval =
      intensity === 'light' ? 3000 : intensity === 'medium' ? 2000 : 1500;

    // 赤ちゃんを生成
    const spawnBaby = () => {
      if (babies.length < babyCount) {
        const newBaby: Baby = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50, // 画面下部から
          speedX: (Math.random() - 0.5) * 4,
          speedY: -12 - Math.random() * 16, // 上向きの速度（大きくするため）
          size: 100 + Math.random() * 60,
          opacity: 0.8 + Math.random() * 0.2,
          life: 1000 + Math.random() * 2000,
          imageUrl: babyImages[Math.floor(Math.random() * babyImages.length)],
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 4,
          bouncePhase: Math.random() * Math.PI * 2,
        };
        setBabies((prev) => [...prev, newBaby]);
      }
    };

    const spawnIntervalId = setInterval(spawnBaby, spawnInterval);

    // アニメーション
    const animate = () => {
      setBabies((prev) =>
        prev
          .map((baby) => ({
            ...baby,
            x: baby.x + baby.speedX,
            y: baby.y + baby.speedY + Math.sin(baby.bouncePhase) * 0.5,
            rotation: baby.rotation + baby.rotationSpeed,
            bouncePhase: baby.bouncePhase + 0.1,
            speedY: baby.speedY + 0.5, // 重力（大きくするため）
            life: baby.life - 1,
            opacity: Math.max(0, baby.opacity - 0.0005),
          }))
          .filter((baby) => baby.life > 0 && baby.opacity > 0.1)
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, intensity, babies.length]);

  const renderBaby = (baby: Baby) => {
    return (
      <div
        key={baby.id}
        className="absolute pointer-events-none"
        style={{
          left: baby.x,
          top: baby.y,
          width: baby.size,
          height: baby.size,
          opacity: baby.opacity,
          transform: `translate(-50%, -50%) rotate(${baby.rotation}deg)`,
          filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))',
          animation: 'baby-float 2s ease-in-out infinite',
          zIndex: 10,
        }}
      >
        <img
          src={baby.imageUrl}
          alt="Baby"
          className="w-full h-full object-cover rounded-full"
          style={{
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 20px rgba(255, 182, 193, 0.6)',
          }}
        />

        {/* きらめきエフェクト */}
        {Math.random() > 0.7 && (
          <div
            className="absolute -top-2 -right-2 text-yellow-400"
            style={{
              fontSize: baby.size * 0.2,
              animation: 'sparkle 1s ease-in-out infinite',
            }}
          >
            ✨
          </div>
        )}

        {/* ハートエフェクト */}
        {Math.random() > 0.8 && (
          <div
            className="absolute -bottom-2 -left-2 text-pink-400"
            style={{
              fontSize: baby.size * 0.15,
              animation: 'heart-float 3s ease-in-out infinite',
            }}
          >
            💖
          </div>
        )}
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {babies.map(renderBaby)}

      {/* 優しい背景エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-purple-100/10 to-blue-100/15" />

      {/* 背景の赤ちゃん写真（ぼかし） */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${babyImages[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(50px)',
        }}
      />

      {/* きらめく星 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-60" />
      <div
        className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-pulse opacity-40"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-300 rounded-full animate-pulse opacity-50"
        style={{ animationDelay: '2s' }}
      />

      <style jsx>{`
        @keyframes baby-float {
          0%,
          100% {
            transform: translate(-50%, -50%) rotate(0deg) translateY(0px);
          }
          25% {
            transform: translate(-50%, -50%) rotate(2deg) translateY(-5px);
          }
          50% {
            transform: translate(-50%, -50%) rotate(0deg) translateY(-10px);
          }
          75% {
            transform: translate(-50%, -50%) rotate(-2deg) translateY(-5px);
          }
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes heart-float {
          0%,
          100% {
            opacity: 0.3;
            transform: translateY(0px);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default BabyEffect;
