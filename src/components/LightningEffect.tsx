import React, { useState, useEffect } from 'react';

interface LightningEffectProps {
  isActive: boolean;
  onFlash?: () => void;
}

const LightningEffect: React.FC<LightningEffectProps> = ({
  isActive,
  onFlash,
}) => {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (isActive) {
      const flashInterval = setInterval(() => {
        // 一回の強烈な雷
        setIsFlashing(true);
        onFlash?.();

        setTimeout(() => {
          setIsFlashing(false);
        }, 200 + Math.random() * 300); // 200-500msの長いフラッシュ
      }, 3000 + Math.random() * 4000); // 3-7秒間隔でランダムに

      return () => clearInterval(flashInterval);
    }
  }, [isActive, onFlash]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* 画面全体のフラッシュ */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-200 ${
          isFlashing ? 'opacity-80' : 'opacity-0'
        }`}
      />

      {/* 追加のフラッシュ効果 */}
      <div
        className={`absolute inset-0 bg-blue-100 transition-opacity duration-150 ${
          isFlashing ? 'opacity-60' : 'opacity-0'
        }`}
      />

      {/* 強烈なフラッシュ */}
      <div
        className={`absolute inset-0 bg-yellow-100 transition-opacity duration-100 ${
          isFlashing ? 'opacity-40' : 'opacity-0'
        }`}
      />

      {/* 暗い雲の背景 - 画面全体 */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-black opacity-30 -z-10" />

      {/* 雷の稲妻エフェクト */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        {/* メイン稲妻パス */}
        <path
          d="M 200 50 
             L 250 150 
             L 220 200 
             L 300 250 
             L 280 300 
             L 350 350 
             L 320 400 
             L 400 450 
             L 380 500 
             L 450 550 
             L 420 600 
             L 500 650 
             L 480 700 
             L 550 750 
             L 520 800 
             L 600 850"
          stroke="#ffff00"
          strokeWidth="15"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isFlashing ? 1 : 0}
          className="transition-opacity duration-300 filter drop-shadow-2xl"
        />

        {/* 稲妻のグロー効果 */}
        <path
          d="M 200 50 
             L 250 150 
             L 220 200 
             L 300 250 
             L 280 300 
             L 350 350 
             L 320 400 
             L 400 450 
             L 380 500 
             L 450 550 
             L 420 600 
             L 500 650 
             L 480 700 
             L 550 750 
             L 520 800 
             L 600 850"
          stroke="#ffffff"
          strokeWidth="25"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isFlashing ? 0.6 : 0}
          className="transition-opacity duration-300"
        />

        {/* 雷の稲妻パス2 */}
        <path
          d="M 700 30 
             L 750 130 
             L 720 180 
             L 800 230 
             L 780 280 
             L 850 330 
             L 820 380 
             L 900 430 
             L 880 480 
             L 950 530 
             L 920 580 
             L 1000 630 
             L 980 680 
             L 1050 730 
             L 1020 780 
             L 1100 830"
          stroke="#00ffff"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isFlashing ? 1 : 0}
          className="transition-opacity duration-300 filter drop-shadow-xl"
        />

        {/* 稲妻パス2のグロー効果 */}
        <path
          d="M 700 30 
             L 750 130 
             L 720 180 
             L 800 230 
             L 780 280 
             L 850 330 
             L 820 380 
             L 900 430 
             L 880 480 
             L 950 530 
             L 920 580 
             L 1000 630 
             L 980 680 
             L 1050 730 
             L 1020 780 
             L 1100 830"
          stroke="#ffffff"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isFlashing ? 0.5 : 0}
          className="transition-opacity duration-300"
        />

        {/* 雷の稲妻パス3 */}
        <path
          d="M 450 20 
             L 500 120 
             L 470 170 
             L 550 220 
             L 530 270 
             L 600 320 
             L 570 370 
             L 650 420 
             L 630 470 
             L 700 520 
             L 670 570 
             L 750 620 
             L 730 670 
             L 800 720 
             L 770 770 
             L 850 820"
          stroke="#ffffff"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isFlashing ? 1 : 0}
          className="transition-opacity duration-300 filter drop-shadow-2xl"
        />

        {/* 追加の稲妻パス4 */}
        <path
          d="M 100 10 
             L 150 110 
             L 120 160 
             L 200 210 
             L 180 260 
             L 250 310 
             L 220 360 
             L 300 410 
             L 280 460 
             L 350 510 
             L 320 560 
             L 400 610 
             L 380 660 
             L 450 710 
             L 420 760 
             L 500 810"
          stroke="#00ff00"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isFlashing ? 0.8 : 0}
          className="transition-opacity duration-300 filter drop-shadow-lg"
        />

        {/* 追加の稲妻パス5 */}
        <path
          d="M 850 40 
             L 900 140 
             L 870 190 
             L 950 240 
             L 930 290 
             L 1000 340 
             L 970 390 
             L 1050 440 
             L 1030 490 
             L 1100 540 
             L 1070 590 
             L 1150 640 
             L 1130 690 
             L 1200 740 
             L 1170 790 
             L 1250 840"
          stroke="#0088ff"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isFlashing ? 0.7 : 0}
          className="transition-opacity duration-300"
        />
      </svg>
    </div>
  );
};

export default LightningEffect;
