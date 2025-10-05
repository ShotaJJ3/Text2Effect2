import React from 'react';

interface ConfettiProps {
  isActive?: boolean;
  pieceCount?: number;
}

const Kamihubuki: React.FC<ConfettiProps> = ({ isActive = true, pieceCount = 70 }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B500', '#FF1493'];
  
  const confettiPieces = Array.from({ length: pieceCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    width: 8 + Math.random() * 8,
    height: 6 + Math.random() * 6,
  }));

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-10px) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) rotate(90deg) translateX(30px);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(-30px);
          }
          75% {
            transform: translateY(75vh) rotate(270deg) translateX(20px);
          }
          100% {
            transform: translateY(100vh) rotate(360deg) translateX(0);
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
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            style={{
              position: 'absolute',
              width: `${piece.width}px`,
              height: `${piece.height}px`,
              backgroundColor: piece.color,
              left: `${piece.left}%`,
              top: '-20px',
              transform: `rotate(${piece.rotation}deg)`,
              animation: `confettiFall ${piece.duration}s linear ${piece.delay}s infinite`,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Kamihubuki;