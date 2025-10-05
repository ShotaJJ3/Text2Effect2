import React, { useState, useEffect } from 'react';

interface LightningProps {
  isActive?: boolean;
  frequency?: number;
}

interface LightningBolt {
  id: number;
  left: number;
  color: string;
  duration: number;
  path: string;
}

const Lt2: React.FC<LightningProps> = ({ 
  isActive = true, 
  frequency = 1100
}) => {
  const [bolts, setBolts] = useState<LightningBolt[]>([]);

  const generateZigzagPath = () => {
    const segments = 6 + Math.floor(Math.random() * 4); // 6-9セグメント
    let pathData = 'M 50 0';
    let currentX = 50;
    let currentY = 0;
    
    for (let i = 0; i < segments; i++) {
      const offsetX = (Math.random() - 0.5) * 60; // -30 to 30
      currentX += offsetX;
      currentY += 100 / segments;
      pathData += ` L ${currentX} ${currentY}`;
    }
    
    return pathData;
  };

  useEffect(() => {
    if (!isActive) {
      setBolts([]);
      return;
    }

    const colors = ['#FFD700', '#FFEB3B', '#00E5FF', '#80D8FF', '#FFFFFF','#6F51A1','#CC1669'];
    let boltId = 0;

    const createLightning = () => {
      
      const newBolt: LightningBolt = {
        id: boltId++,
        left: Math.random() * 80 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 300 + Math.random() * 200,
        path: generateZigzagPath(),
      };

      setBolts(prev => [...prev, newBolt]);

      setTimeout(() => {
        setBolts(prev => prev.filter(bolt => bolt.id !== newBolt.id));
      }, newBolt.duration);
    };

    const interval = setInterval(createLightning, frequency);

    return () => clearInterval(interval);
  }, [isActive, frequency]);

  return (
    <>
      <style>{`
        @keyframes lightning-strike {
          0% {
            opacity: 0;
            stroke-dashoffset: 1000;
          }
          10% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
          20% {
            opacity: 0.8;
          }
          30% {
            opacity: 1;
          }
          40% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: 0;
          }
        }

        @keyframes flash {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>

      {isActive && bolts.map((bolt) => (
        <React.Fragment key={bolt.id}>
          {/* 画面全体のフラッシュ */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: bolt.color,
              pointerEvents: 'none',
              zIndex: 999,
              animation: `flash ${bolt.duration}ms ease-out`,
            }}
          />

          {/* 稲妻本体（SVG） */}
          <svg
            style={{
              position: 'fixed',
              top: 0,
              left: `${bolt.left}%`,
              width: '200px',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 1000,
              transform: 'translateX(-50%)',
              animation: `lightning-strike ${bolt.duration}ms ease-out`,
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* グローエフェクト */}
            <defs>
              <filter id={`glow-${bolt.id}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* 外側のグロー */}
            <path
              d={bolt.path}
              fill="none"
              stroke={bolt.color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
              filter={`url(#glow-${bolt.id})`}
            />

            {/* メインの稲妻 */}
            <path
              d={bolt.path}
              fill="none"
              stroke={bolt.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${bolt.id})`}
            />

            {/* 中心の明るい部分 */}
            <path
              d={bolt.path}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
          </svg>
        </React.Fragment>
      ))}
    </>
  );
};

export default Lt2;