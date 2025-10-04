import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import LightningEffect from './components/LightningEffect';
import RainEffect from './components/RainEffect';
import SakuraEffect from './components/SakuraEffect';
import GoodMarkEffect from './components/GoodMarkEffect';
import NormalMoodEffect from './components/NormalMoodEffect';
import RandomEmotionEffect from './components/RandomEmotionEffect';
import HappyEffect2 from './components/HappyEffect2';
import JoyfulEffect2 from './components/JoyfulEffect2';
import SadEffect2 from './components/SadEffect2';
import AngryEffect2 from './components/AngryEffect2';
import NormalEffect2 from './components/NormalEffect2';
import BabyEffect from './components/BabyEffect';

function App() {
  const [count, setCount] = useState(0);
  const [isLightningActive, setIsLightningActive] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [isSakuraActive, setIsSakuraActive] = useState(false);
  const [isGoodMarkActive, setIsGoodMarkActive] = useState(false);
  const [isNormalMoodActive, setIsNormalMoodActive] = useState(false);
  const [isRandomEmotionActive, setIsRandomEmotionActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<
    'happy' | 'joyful' | 'sad' | 'angry' | 'normal'
  >('normal');
  const [isHappyEffect2Active, setIsHappyEffect2Active] = useState(false);
  const [isJoyfulEffect2Active, setIsJoyfulEffect2Active] = useState(false);
  const [isSadEffect2Active, setIsSadEffect2Active] = useState(false);
  const [isAngryEffect2Active, setIsAngryEffect2Active] = useState(false);
  const [isNormalEffect2Active, setIsNormalEffect2Active] = useState(false);
  const [isBabyEffectActive, setIsBabyEffectActive] = useState(false);
  const [flashCount, setFlashCount] = useState(0);
  const [rainIntensity, setRainIntensity] = useState<
    'light' | 'medium' | 'heavy'
  >('medium');
  const [sakuraIntensity, setSakuraIntensity] = useState<
    'light' | 'medium' | 'heavy'
  >('medium');
  const [goodMarkFrequency, setGoodMarkFrequency] = useState<
    'slow' | 'medium' | 'fast'
  >('medium');
  const [normalMoodIntensity, setNormalMoodIntensity] = useState<
    'subtle' | 'moderate' | 'strong'
  >('moderate');

  const handleFlash = () => {
    setFlashCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 transition-colors duration-300">
      <div className="flex space-x-8 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="logo hover:animate-spin"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="logo react hover:animate-spin"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-8 text-white transition-colors duration-300">
        Vite + React + Tailwind
      </h1>
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 mb-4 mr-4"
        >
          count is {count}
        </button>

        {/* 感情別エフェクト選択 */}
        <div className="mb-6">
          <p className="text-gray-200 text-sm mb-3">感情を選択してください:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => {
                const shouldActivate = !isGoodMarkActive;
                if (shouldActivate) {
                  // ランダムにどちらかを選択
                  const useMainEffect = Math.random() > 0.5;
                  setIsGoodMarkActive(useMainEffect);
                  setIsHappyEffect2Active(!useMainEffect);
                  setIsRandomEmotionActive(true);
                  setCurrentEmotion('happy');
                } else {
                  setIsGoodMarkActive(false);
                  setIsHappyEffect2Active(false);
                  setIsRandomEmotionActive(false);
                }
                // 他のエフェクトを停止
                setIsSakuraActive(false);
                setIsJoyfulEffect2Active(false);
                setIsRainActive(false);
                setIsSadEffect2Active(false);
                setIsLightningActive(false);
                setIsAngryEffect2Active(false);
                setIsNormalMoodActive(false);
                setIsNormalEffect2Active(false);
                setIsBabyEffectActive(false);
              }}
              className={`${
                isGoodMarkActive || isHappyEffect2Active
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white font-semibold py-2 px-3 rounded transition-colors duration-200 text-sm`}
            >
              😄 楽しい
            </button>

            <button
              onClick={() => {
                const shouldActivate = !isSakuraActive;
                if (shouldActivate) {
                  // ランダムにどちらかを選択
                  const useMainEffect = Math.random() > 0.5;
                  setIsSakuraActive(useMainEffect);
                  setIsJoyfulEffect2Active(!useMainEffect);
                  setIsRandomEmotionActive(true);
                  setCurrentEmotion('joyful');
                } else {
                  setIsSakuraActive(false);
                  setIsJoyfulEffect2Active(false);
                  setIsRandomEmotionActive(false);
                }
                // 他のエフェクトを停止
                setIsGoodMarkActive(false);
                setIsHappyEffect2Active(false);
                setIsRainActive(false);
                setIsSadEffect2Active(false);
                setIsLightningActive(false);
                setIsAngryEffect2Active(false);
                setIsNormalMoodActive(false);
                setIsNormalEffect2Active(false);
                setIsBabyEffectActive(false);
              }}
              className={`${
                isSakuraActive || isJoyfulEffect2Active
                  ? 'bg-pink-500 hover:bg-pink-600'
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white font-semibold py-2 px-3 rounded transition-colors duration-200 text-sm`}
            >
              😊 うれしい
            </button>

            <button
              onClick={() => {
                const shouldActivate = !isRainActive;
                if (shouldActivate) {
                  // ランダムにどちらかを選択
                  const useMainEffect = Math.random() > 0.5;
                  setIsRainActive(useMainEffect);
                  setIsSadEffect2Active(!useMainEffect);
                  setIsRandomEmotionActive(true);
                  setCurrentEmotion('sad');
                } else {
                  setIsRainActive(false);
                  setIsSadEffect2Active(false);
                  setIsRandomEmotionActive(false);
                }
                // 他のエフェクトを停止
                setIsGoodMarkActive(false);
                setIsHappyEffect2Active(false);
                setIsSakuraActive(false);
                setIsJoyfulEffect2Active(false);
                setIsLightningActive(false);
                setIsAngryEffect2Active(false);
                setIsNormalMoodActive(false);
                setIsNormalEffect2Active(false);
                setIsBabyEffectActive(false);
              }}
              className={`${
                isRainActive || isSadEffect2Active
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white font-semibold py-2 px-3 rounded transition-colors duration-200 text-sm`}
            >
              😢 悲しい
            </button>

            <button
              onClick={() => {
                const shouldActivate = !isLightningActive;
                if (shouldActivate) {
                  // ランダムにどちらかを選択
                  const useMainEffect = Math.random() > 0.5;
                  setIsLightningActive(useMainEffect);
                  setIsAngryEffect2Active(!useMainEffect);
                  setIsRandomEmotionActive(true);
                  setCurrentEmotion('angry');
                } else {
                  setIsLightningActive(false);
                  setIsAngryEffect2Active(false);
                  setIsRandomEmotionActive(false);
                }
                // 他のエフェクトを停止
                setIsGoodMarkActive(false);
                setIsHappyEffect2Active(false);
                setIsSakuraActive(false);
                setIsJoyfulEffect2Active(false);
                setIsRainActive(false);
                setIsSadEffect2Active(false);
                setIsNormalMoodActive(false);
                setIsNormalEffect2Active(false);
                setIsBabyEffectActive(false);
              }}
              className={`${
                isLightningActive || isAngryEffect2Active
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white font-semibold py-2 px-3 rounded transition-colors duration-200 text-sm`}
            >
              😠 怒り
            </button>

            <button
              onClick={() => {
                const shouldActivate = !isNormalMoodActive;
                if (shouldActivate) {
                  // ランダムにどちらかを選択
                  const useMainEffect = Math.random() > 0.5;
                  setIsNormalMoodActive(useMainEffect);
                  setIsNormalEffect2Active(!useMainEffect);
                  setIsRandomEmotionActive(true);
                  setCurrentEmotion('normal');
                } else {
                  setIsNormalMoodActive(false);
                  setIsNormalEffect2Active(false);
                  setIsRandomEmotionActive(false);
                }
                // 他のエフェクトを停止
                setIsGoodMarkActive(false);
                setIsHappyEffect2Active(false);
                setIsSakuraActive(false);
                setIsJoyfulEffect2Active(false);
                setIsRainActive(false);
                setIsSadEffect2Active(false);
                setIsLightningActive(false);
                setIsAngryEffect2Active(false);
                setIsBabyEffectActive(false);
              }}
              className={`${
                isNormalMoodActive || isNormalEffect2Active
                  ? 'bg-gray-500 hover:bg-gray-600'
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white font-semibold py-2 px-3 rounded transition-colors duration-200 text-sm`}
            >
              😐 普通
            </button>
          </div>
        </div>

        {/* 個別制御ボタン（従来の機能） */}
        <div className="mb-4">
          <p className="text-gray-200 text-sm mb-2">個別制御:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsLightningActive(!isLightningActive)}
              className={`${
                isLightningActive
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white font-semibold py-1 px-3 rounded transition-colors duration-200 text-sm`}
            >
              {isLightningActive ? '雷停止' : '雷開始'}
            </button>

            <button
              onClick={() => setIsRainActive(!isRainActive)}
              className={`${
                isRainActive
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white font-semibold py-1 px-3 rounded transition-colors duration-200 text-sm`}
            >
              {isRainActive ? '雨停止' : '雨開始'}
            </button>

            <button
              onClick={() => setIsSakuraActive(!isSakuraActive)}
              className={`${
                isSakuraActive
                  ? 'bg-pink-500 hover:bg-pink-600'
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white font-semibold py-1 px-3 rounded transition-colors duration-200 text-sm`}
            >
              {isSakuraActive ? '桜停止' : '桜開始'}
            </button>

            <button
              onClick={() => setIsGoodMarkActive(!isGoodMarkActive)}
              className={`${
                isGoodMarkActive
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white font-semibold py-1 px-3 rounded transition-colors duration-200 text-sm`}
            >
              {isGoodMarkActive ? 'キャラ停止' : 'キャラ開始'}
            </button>

            <button
              onClick={() => setIsNormalMoodActive(!isNormalMoodActive)}
              className={`${
                isNormalMoodActive
                  ? 'bg-gray-500 hover:bg-gray-600'
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white font-semibold py-1 px-3 rounded transition-colors duration-200 text-sm`}
            >
              {isNormalMoodActive ? '普通停止' : '普通開始'}
            </button>

            <button
              onClick={() => setIsBabyEffectActive(!isBabyEffectActive)}
              className={`${
                isBabyEffectActive
                  ? 'bg-pink-300 hover:bg-pink-400'
                  : 'bg-gray-500 hover:bg-gray-600'
              } text-white font-semibold py-1 px-3 rounded transition-colors duration-200 text-sm`}
            >
              {isBabyEffectActive ? '赤ちゃん停止' : '赤ちゃん開始'}
            </button>
          </div>
        </div>

        {/* 雨の強度選択 */}
        {isRainActive && (
          <div className="mb-4">
            <p className="text-gray-200 text-sm mb-2">雨の強度:</p>
            <div className="flex gap-2">
              {(['light', 'medium', 'heavy'] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setRainIntensity(intensity)}
                  className={`${
                    rainIntensity === intensity
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-200'
                  } px-3 py-1 rounded text-sm transition-colors duration-200`}
                >
                  {intensity === 'light'
                    ? '小雨'
                    : intensity === 'medium'
                    ? '普通'
                    : '大雨'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 桜の強度選択 */}
        {isSakuraActive && (
          <div className="mb-4">
            <p className="text-gray-200 text-sm mb-2">桜の強度:</p>
            <div className="flex gap-2">
              {(['light', 'medium', 'heavy'] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setSakuraIntensity(intensity)}
                  className={`${
                    sakuraIntensity === intensity
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-600 text-gray-200'
                  } px-3 py-1 rounded text-sm transition-colors duration-200`}
                >
                  {intensity === 'light'
                    ? '少なめ'
                    : intensity === 'medium'
                    ? '普通'
                    : '多め'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* キャラクターの頻度選択 */}
        {isGoodMarkActive && (
          <div className="mb-4">
            <p className="text-gray-200 text-sm mb-2">キャラクターの頻度:</p>
            <div className="flex gap-2">
              {(['slow', 'medium', 'fast'] as const).map((frequency) => (
                <button
                  key={frequency}
                  onClick={() => setGoodMarkFrequency(frequency)}
                  className={`${
                    goodMarkFrequency === frequency
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-600 text-gray-200'
                  } px-3 py-1 rounded text-sm transition-colors duration-200`}
                >
                  {frequency === 'slow'
                    ? 'ゆっくり'
                    : frequency === 'medium'
                    ? '普通'
                    : '速い'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 普通気持ちの強度選択 */}
        {isNormalMoodActive && (
          <div className="mb-4">
            <p className="text-gray-200 text-sm mb-2">普通気持ちの強度:</p>
            <div className="flex gap-2">
              {(['subtle', 'moderate', 'strong'] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setNormalMoodIntensity(intensity)}
                  className={`${
                    normalMoodIntensity === intensity
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  } px-3 py-1 rounded text-sm transition-colors duration-200`}
                >
                  {intensity === 'subtle'
                    ? '控えめ'
                    : intensity === 'moderate'
                    ? '普通'
                    : 'しっかり'}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLightningActive && (
          <p className="text-yellow-600 font-semibold mb-2">
            雷の回数: {flashCount}
          </p>
        )}

        <p className="text-gray-200">
          Edit{' '}
          <code className="bg-gray-200 px-2 py-1 rounded">src/App.tsx</code> and
          save to test HMR
        </p>
      </div>
      <p className="text-sm mt-8 text-gray-300 transition-colors duration-300">
        Click on the Vite and React logos to learn more
      </p>

      {/* 雷エフェクト */}
      <LightningEffect isActive={isLightningActive} onFlash={handleFlash} />

      {/* 雨エフェクト */}
      <RainEffect isActive={isRainActive} intensity={rainIntensity} />

      {/* 桜エフェクト */}
      <SakuraEffect isActive={isSakuraActive} intensity={sakuraIntensity} />

      {/* キャラクターエフェクト */}
      <GoodMarkEffect
        isActive={isGoodMarkActive}
        frequency={goodMarkFrequency}
      />

      {/* 普通気持ちエフェクト */}
      <NormalMoodEffect
        isActive={isNormalMoodActive}
        intensity={normalMoodIntensity}
      />

      {/* ランダム感情エフェクト */}
      <RandomEmotionEffect
        isActive={isRandomEmotionActive}
        emotion={currentEmotion}
        intensity={normalMoodIntensity}
      />

      {/* 追加エフェクト2 */}
      <HappyEffect2
        isActive={isHappyEffect2Active}
        intensity={sakuraIntensity}
      />
      <JoyfulEffect2
        isActive={isJoyfulEffect2Active}
        intensity={sakuraIntensity}
      />
      <SadEffect2 isActive={isSadEffect2Active} intensity={rainIntensity} />
      <AngryEffect2 isActive={isAngryEffect2Active} intensity={rainIntensity} />
      <NormalEffect2
        isActive={isNormalEffect2Active}
        intensity={normalMoodIntensity}
      />

      {/* 赤ちゃんエフェクト */}
      <BabyEffect isActive={isBabyEffectActive} intensity={sakuraIntensity} />
    </div>
  );
}

export default App;
