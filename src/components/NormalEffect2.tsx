import React, { useEffect, useState } from 'react';

interface NormalEffect2Props {
  isActive: boolean;
  intensity?: 'subtle' | 'moderate' | 'strong';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  life: number;
  color: string;
}

const NormalEffect2: React.FC<NormalEffect2Props> = ({
  isActive,
  intensity = 'moderate',
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const colors = ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563'];

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const particleCount =
      intensity === 'subtle' ? 20 : intensity === 'moderate' ? 40 : 60;
    const spawnInterval =
      intensity === 'subtle' ? 1000 : intensity === 'moderate' ? 700 : 500;

    // 粒子を生成
    const spawnParticle = () => {
      if (particles.length < particleCount) {
        const newParticle: Particle = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          size: 3 + Math.random() * 5,
          opacity: 0.2 + Math.random() * 0.4,
          life: 600 + Math.random() * 800,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setParticles((prev) => [...prev, newParticle]);
      }
    };

    const spawnIntervalId = setInterval(spawnParticle, spawnInterval);

    // アニメーション
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.speedX,
            y: particle.y + particle.speedY,
            life: particle.life - 1,
            opacity: Math.max(0, particle.opacity - 0.001),
          }))
          .filter((particle) => particle.life > 0 && particle.opacity > 0.05)
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, intensity, particles.length]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 2px rgba(156, 163, 175, 0.3)`,
          }}
        />
      ))}
    </div>
  );
};

export default NormalEffect2;
