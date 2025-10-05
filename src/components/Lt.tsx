import React, { useState, useEffect } from 'react';

interface LightningProps {
  isActive?: boolean;
  frequency?: number; // 稲妻の発生頻度（ミリ秒）
}

interface LightningBolt {
  id: number;
  left: number;
  color: string;
  duration: number;
}

const Lt: React.FC<LightningProps> = ({ 
  isActive = true, 
  frequency = 1100
}) => {
  const [bolts, setBolts] = useState<LightningBolt[]>([]);

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
        left: Math.random() * 90 + 5, // 5% ~ 95%
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 300 + Math.random() * 200, // 300-500ms
      };

      setBolts(prev => [...prev, newBolt]);

      // 稲妻を自動削除
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
            transform: translateY(-100%);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
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
            transform: translateY(0);
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

          {/* 稲妻本体 */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: `${bolt.left}%`,
              width: '4px',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 1000,
              animation: `lightning-strike ${bolt.duration}ms ease-out`,
            }}
          >
            {/* メインの稲妻 */}
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(to bottom, ${bolt.color}, transparent)`,
                boxShadow: `0 0 20px ${bolt.color}, 0 0 40px ${bolt.color}`,
                filter: 'blur(1px)',
              }}
            />
            
            {/* 稲妻の枝分かれ（左） */}
            <div
              style={{
                position: 'absolute',
                top: '30%',
                left: '-20px',
                width: '2px',
                height: '30vh',
                background: `linear-gradient(to bottom, ${bolt.color}, transparent)`,
                boxShadow: `0 0 10px ${bolt.color}`,
                transform: 'rotate(-20deg)',
                filter: 'blur(1px)',
              }}
            />

            {/* 稲妻の枝分かれ（右） */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-15px',
                width: '2px',
                height: '20vh',
                background: `linear-gradient(to bottom, ${bolt.color}, transparent)`,
                boxShadow: `0 0 10px ${bolt.color}`,
                transform: 'rotate(25deg)',
                filter: 'blur(1px)',
              }}
            />

            {/* 中心の明るい部分 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '100%',
                background: `linear-gradient(to bottom, #FFFFFF, ${bolt.color}, transparent)`,
              }}
            />
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

export default Lt;