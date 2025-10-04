import { useState } from 'react';
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
import SentimentInput from './components/SentimentInput';
import { SentimentResult } from './services/sentimentAnalysis';
import JoyBubbleEffect from './components/JoyBubbleEffect';
import ChatHistoryComponent from './components/ChatHistory';
import { saveChatHistory } from './services/chatHistory';

function App() {
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
  const [isJoyBubbleActive, setIsJoyBubbleActive] = useState(false);
  const [sentimentResult, setSentimentResult] =
    useState<SentimentResult | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
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

  const handleSentimentAnalyzed = async (
    result: SentimentResult,
    effectInfo: { emotion: string; description: string }
  ) => {
    setSentimentResult(result);

    // チャット履歴を保存
    try {
      const text =
        (document.querySelector('#text-input') as HTMLTextAreaElement)?.value ||
        '';
      await saveChatHistory(
        text,
        result,
        effectInfo.emotion,
        effectInfo.description,
        currentSessionId
      );
    } catch (error) {
      console.error('チャット履歴保存エラー:', error);
    }

    // すべてのエフェクトを停止
    setIsGoodMarkActive(false);
    setIsHappyEffect2Active(false);
    setIsSakuraActive(false);
    setIsJoyfulEffect2Active(false);
    setIsRainActive(false);
    setIsSadEffect2Active(false);
    setIsLightningActive(false);
    setIsAngryEffect2Active(false);
    setIsNormalMoodActive(false);
    setIsNormalEffect2Active(false);
    setIsBabyEffectActive(false);
    setIsJoyBubbleActive(false);

    // 感情に応じてエフェクトを起動
    switch (effectInfo.emotion) {
      case 'happy':
        // ランダムにどちらかを選択
        const useHappyMain = Math.random() > 0.5;
        setIsGoodMarkActive(useHappyMain);
        setIsHappyEffect2Active(!useHappyMain);
        break;
      case 'joyful':
        const useJoyfulMain = Math.random() > 0.5;
        setIsSakuraActive(useJoyfulMain);
        setIsJoyfulEffect2Active(!useJoyfulMain);
        break;
      case 'sad':
        const useSadMain = Math.random() > 0.5;
        setIsRainActive(useSadMain);
        setIsSadEffect2Active(!useSadMain);
        break;
      case 'angry':
        const useAngryMain = Math.random() > 0.5;
        setIsLightningActive(useAngryMain);
        setIsAngryEffect2Active(!useAngryMain);
        break;
      case 'normal':
        const useNormalMain = Math.random() > 0.5;
        setIsNormalMoodActive(useNormalMain);
        setIsNormalEffect2Active(!useNormalMain);
        break;
    }
  };

  // チャット履歴からのエフェクト再現
  const handleEffectReproduced = (emotion: string, description: string) => {
    // すべてのエフェクトを停止
    setIsGoodMarkActive(false);
    setIsHappyEffect2Active(false);
    setIsSakuraActive(false);
    setIsJoyfulEffect2Active(false);
    setIsRainActive(false);
    setIsSadEffect2Active(false);
    setIsLightningActive(false);
    setIsAngryEffect2Active(false);
    setIsNormalMoodActive(false);
    setIsNormalEffect2Active(false);
    setIsBabyEffectActive(false);
    setIsJoyBubbleActive(false);

    // 感情に応じてエフェクトを起動
    switch (emotion) {
      case 'happy':
        const useHappyMain = Math.random() > 0.5;
        setIsGoodMarkActive(useHappyMain);
        setIsHappyEffect2Active(!useHappyMain);
        break;
      case 'joyful':
        const useJoyfulMain = Math.random() > 0.5;
        setIsSakuraActive(useJoyfulMain);
        setIsJoyfulEffect2Active(!useJoyfulMain);
        break;
      case 'sad':
        const useSadMain = Math.random() > 0.5;
        setIsRainActive(useSadMain);
        setIsSadEffect2Active(!useSadMain);
        break;
      case 'angry':
        const useAngryMain = Math.random() > 0.5;
        setIsLightningActive(useAngryMain);
        setIsAngryEffect2Active(!useAngryMain);
        break;
      case 'normal':
        const useNormalMain = Math.random() > 0.5;
        setIsNormalMoodActive(useNormalMain);
        setIsNormalEffect2Active(!useNormalMain);
        break;
    }
  };

  return (
    <div className="min-h-screen w-full h-screen bg-gray-900 transition-colors duration-300 overflow-hidden">
      <div className="w-full max-w-none h-full px-4 py-8 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
          Text2Effect - 感情分析エフェクト
        </h1>

        {/* 感情分析入力コンポーネント */}
        <div className="w-full mb-6">
          <SentimentInput onSentimentAnalyzed={handleSentimentAnalyzed} />
        </div>

        {/* チャット履歴コンポーネント */}
        <div className="w-full">
          <ChatHistoryComponent onEffectReproduced={handleEffectReproduced} />
        </div>
      </div>

      {/* 雷エフェクト */}
      <LightningEffect isActive={isLightningActive} onFlash={() => {}} />

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
      <JoyBubbleEffect
        isActive={isJoyBubbleActive}
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
