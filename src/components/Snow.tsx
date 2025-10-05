import React from 'react';

interface SnowProps {
  isActive?: boolean;
  flakeCount?: number;
}

const Snow: React.FC<SnowProps> = ({ isActive = true, flakeCount = 100 }) => {
  const snowflakes = Array.from({ length: flakeCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 12,
    size: 3 + Math.random() * 5,
    opacity: 0.4 + Math.random() * 0.6,
  }));

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0);
          }
          25% {
            transform: translateY(25vh) translateX(20px);
          }
          50% {
            transform: translateY(50vh) translateX(-20px);
          }
          75% {
            transform: translateY(75vh) translateX(15px);
          }
          100% {
            transform: translateY(100vh) translateX(0);
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
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            style={{
              position: 'absolute',
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
              opacity: flake.opacity,
              left: `${flake.left}%`,
              top: '-10px',
              animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Snow;