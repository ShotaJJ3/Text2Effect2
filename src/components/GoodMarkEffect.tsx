import React, { useEffect, useState } from 'react';

interface GoodMarkEffectProps {
  isActive: boolean;
  frequency?: 'slow' | 'medium' | 'fast';
}

interface Character {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  emoji: string;
  life: number;
}

interface GoodMark {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  life: number;
  maxLife: number;
}

const GoodMarkEffect: React.FC<GoodMarkEffectProps> = ({
  isActive,
  frequency = 'medium',
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [goodMarks, setGoodMarks] = useState<GoodMark[]>([]);

  const characterEmojis = [
    '🤖',
    '👾',
    '👽',
    '🤡',
    '🎭',
    '🦄',
    '🐙',
    '🦑',
    '🦋',
    '🌈',
  ];
  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
  ];

  useEffect(() => {
    if (!isActive) {
      setCharacters([]);
      setGoodMarks([]);
      return;
    }

    const spawnInterval =
      frequency === 'slow' ? 3000 : frequency === 'medium' ? 2000 : 1000;

    // キャラクターを生成
    const spawnCharacter = () => {
      if (characters.length < 10) {
        // 最大10体まで
        const newCharacter: Character = {
          id: Date.now() + Math.random(),
          x: Math.random() > 0.5 ? -100 : window.innerWidth + 100,
          y: Math.random() * window.innerHeight,
          speedX: (Math.random() - 0.5) * 3,
          speedY: (Math.random() - 0.5) * 2,
          size: 40 + Math.random() * 40,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          emoji:
            characterEmojis[Math.floor(Math.random() * characterEmojis.length)],
          life: 500, // 約8秒間生存
        };
        setCharacters((prev) => [...prev, newCharacter]);
      }
    };

    const spawnIntervalId = setInterval(spawnCharacter, spawnInterval);

    // アニメーション
    const animate = () => {
      setCharacters((prev) =>
        prev
          .map((char) => ({
            ...char,
            x: char.x + char.speedX,
            y: char.y + char.speedY,
            rotation: char.rotation + char.rotationSpeed,
            life: char.life - 1,
          }))
          .filter(
            (char) =>
              char.life > 0 && char.x > -200 && char.x < window.innerWidth + 200
          )
      );

      setGoodMarks((prev) =>
        prev
          .map((mark) => ({
            ...mark,
            scale: mark.scale + 0.02,
            rotation: mark.rotation + 2,
            life: mark.life - 1,
          }))
          .filter((mark) => mark.life > 0)
      );
    };

    const animationId = setInterval(animate, 16);

    return () => {
      clearInterval(spawnIntervalId);
      clearInterval(animationId);
    };
  }, [isActive, frequency, characters.length]);

  // キャラクターがグッドマークを出す
  const spawnGoodMark = (character: Character) => {
    const newGoodMark: GoodMark = {
      id: Date.now() + Math.random(),
      x: character.x,
      y: character.y,
      scale: 0.5,
      rotation: 0,
      life: 120, // 約2秒間表示
      maxLife: 120,
    };
    setGoodMarks((prev) => [...prev, newGoodMark]);
  };

  // キャラクタークリック時の処理
  const handleCharacterClick = (characterId: number) => {
    const character = characters.find((c) => c.id === characterId);
    if (character) {
      spawnGoodMark(character);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* キャラクター */}
      {characters.map((character) => (
        <div
          key={character.id}
          className="absolute cursor-pointer transition-transform duration-200 hover:scale-110"
          style={{
            left: character.x,
            top: character.y,
            transform: `rotate(${character.rotation}deg) scale(${
              Math.sin(character.life * 0.1) * 0.1 + 1
            })`,
            fontSize: character.size,
            pointerEvents: 'auto',
          }}
          onClick={() => handleCharacterClick(character.id)}
        >
          <div
            className="text-center filter drop-shadow-lg"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animation: 'bounce 1s infinite',
            }}
          >
            {character.emoji}
          </div>
          {/* クリック可能であることを示すエフェクト */}
          <div
            className="absolute inset-0 border-2 border-yellow-400 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{
              width: character.size + 20,
              height: character.size + 20,
              left: -10,
              top: -10,
            }}
          />
        </div>
      ))}

      {/* グッドマーク */}
      {goodMarks.map((mark) => (
        <div
          key={mark.id}
          className="absolute pointer-events-none"
          style={{
            left: mark.x - 50,
            top: mark.y - 50,
            transform: `scale(${mark.scale}) rotate(${mark.rotation}deg)`,
            opacity: mark.life / mark.maxLife,
          }}
        >
          <div className="text-6xl font-bold text-green-500 filter drop-shadow-xl animate-spin">
            ✓
          </div>
          <div className="absolute text-4xl font-bold text-yellow-400 -top-2 -right-2 animate-pulse">
            !
          </div>
        </div>
      ))}

      {/* 背景エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10" />

      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default GoodMarkEffect;
