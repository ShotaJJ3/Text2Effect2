import React from 'react';

interface RainProps {
  isActive?: boolean;
  dropCount?: number;
}

const Rain: React.FC<RainProps> = ({ isActive = true, dropCount = 50 }) => {
  const raindrops = Array.from({ length: dropCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 1 + Math.random() * 2,
  }));

  return (
    <>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
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
        {raindrops.map((drop) => (
          <div
            key={drop.id}
            style={{
              position: 'absolute',
              width: '2px',
              height: '25px',
              background:
                'linear-gradient(to bottom, rgba(100, 120, 150, 0.8), rgba(150, 170, 200, 0.3))',
              animation: `fall ${drop.duration}s linear ${drop.delay}s infinite`,
              top: '-30px',
              left: `${drop.left}%`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Rain;