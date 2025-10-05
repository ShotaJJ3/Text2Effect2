import React, { useState, useEffect } from 'react';

interface CalmRippleProps {
  isActive?: boolean;
  frequency?: number;
}

interface RippleCircle {
  id: number;
  x: number;
  y: number;
  size: number;
}

const Hamon2: React.FC<CalmRippleProps> = ({ 
  isActive = true, 
  frequency = 1200 
}) => {
  const [ripples, setRipples] = useState<RippleCircle[]>([]);

  useEffect(() => {
    if (!isActive) {
      setRipples([]);
      return;
    }

    let rippleId = 0;

    const createRipple = () => {
      const newRipple: RippleCircle = {
        id: rippleId++,
        x: Math.random() * 100, 
        y: Math.random() * 100, 
        size: 200 + Math.random() * 700,
      };

      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 7000); // アニメーション時間より長く設定
    };

    createRipple();

    const interval = setInterval(createRipple, frequency);

    return () => clearInterval(interval);
  }, [isActive, frequency]);

  return (
    <>
      <style>{`
        @keyframes calmRipple1 {
          0% {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          100% {
            width: var(--size);
            height: var(--size);
            opacity: 0;
          }
        }

        @keyframes calmRipple2 {
          0% {
            width: 0;
            height: 0;
            opacity: 0.4;
          }
          100% {
            width: calc(var(--size) * 1.3);
            height: calc(var(--size) * 1.3);
            opacity: 0;
          }
        }

        @keyframes calmRipple3 {
          0% {
            width: 0;
            height: 0;
            opacity: 0.3;
          }
          100% {
            width: calc(var(--size) * 1.6);
            height: calc(var(--size) * 1.6);
            opacity: 0;
          }
        }

        @keyframes calmRipple4 {
          0% {
            width: 0;
            height: 0;
            opacity: 0.25;
          }
          100% {
            width: calc(var(--size) * 1.9);
            height: calc(var(--size) * 1.9);
            opacity: 0;
          }
        }

        @keyframes calmRipple5 {
          0% {
            width: 0;
            height: 0;
            opacity: 0.2;
          }
          100% {
            width: calc(var(--size) * 2.2);
            height: calc(var(--size) * 2.2);
            opacity: 0;
          }
        }
      `}</style>
      
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 1000,
          opacity: isActive ? 1 : 0,
          transition: 'opacity 1s',
        }}
      >
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            style={{
              position: 'absolute',
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: '2px solid rgba(120, 180, 220, 0.9)',
                borderRadius: '50%',
                animation: 'calmRipple1 6s ease-out forwards',
                ['--size' as any]: `${ripple.size}px`,
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1.5px solid rgba(120, 180, 220, 0.75)',
                borderRadius: '50%',
                animation: 'calmRipple2 6s ease-out 0.6s forwards',
                ['--size' as any]: `${ripple.size}px`,
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1px solid rgba(120, 180, 220, 0.8)',
                borderRadius: '50%',
                animation: 'calmRipple3 6s ease-out 1.2s forwards',
                ['--size' as any]: `${ripple.size}px`,
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1px solid rgba(120, 180, 220, 0.75)',
                borderRadius: '50%',
                animation: 'calmRipple4 6s ease-out 1.8s forwards',
                ['--size' as any]: `${ripple.size}px`,
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                border: '0.5px solid rgba(120, 180, 220, 0.8)',
                borderRadius: '50%',
                animation: 'calmRipple5 6s ease-out 2.4s forwards',
                ['--size' as any]: `${ripple.size}px`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Hamon2;