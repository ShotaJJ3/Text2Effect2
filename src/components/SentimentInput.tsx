import { useState } from 'react';
import {
  analyzeSentiment,
  getSentimentInJapanese,
  getEffectForSentiment,
  SentimentResult,
} from '../services/sentimentAnalysis';

interface SentimentInputProps {
  onSentimentAnalyzed: (
    result: SentimentResult,
    effectInfo: { emotion: string; description: string }
  ) => void;
}

export default function SentimentInput({
  onSentimentAnalyzed,
}: SentimentInputProps) {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<SentimentResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      alert('テキストを入力してください');
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeSentiment(text);

      if (result) {
        setLastResult(result);
        const effectInfo = getEffectForSentiment(result.sentiment);
        onSentimentAnalyzed(result, effectInfo);
      } else {
        alert('感情分析に失敗しました。AWSの設定を確認してください。');
      }
    } catch (error) {
      console.error('分析エラー:', error);
      alert('分析中にエラーが発生しました');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearText = () => {
    setText('');
    setCharCount(0);
    setLastResult(null);
  };

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg mb-6 w-full">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
        感情分析エフェクト
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="text-input"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            感情を分析したいテキストを入力してください（最大500文字）
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCharCount(e.target.value.length);
            }}
            placeholder="例: 今日はとても良い天気で気分がいいです！"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px]"
            rows={3}
            maxLength={500}
            disabled={isAnalyzing}
          />
          <div className="flex justify-between items-center mt-1">
            <span
              className={`text-xs ${
                charCount > 450
                  ? 'text-red-400'
                  : charCount > 400
                  ? 'text-yellow-400'
                  : 'text-gray-400'
              }`}
            >
              {charCount}/500文字
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isAnalyzing || !text.trim()}
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
              isAnalyzing || !text.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAnalyzing ? '分析中...' : '感情を分析'}
          </button>

          <button
            type="button"
            onClick={clearText}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-semibold transition-colors duration-200"
          >
            クリア
          </button>
        </div>
      </form>

      {/* 分析結果の表示 */}
      {lastResult && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-white mb-2">分析結果</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  lastResult.sentiment === 'POSITIVE'
                    ? 'text-green-400'
                    : lastResult.sentiment === 'NEGATIVE'
                    ? 'text-red-400'
                    : lastResult.sentiment === 'NEUTRAL'
                    ? 'text-gray-400'
                    : 'text-yellow-400'
                }`}
              >
                {getSentimentInJapanese(lastResult.sentiment)}
              </div>
              <div className="text-sm text-gray-300">感情</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-green-400">
                {Math.round(lastResult.confidence.positive * 100)}%
              </div>
              <div className="text-sm text-gray-300">ポジティブ</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-red-400">
                {Math.round(lastResult.confidence.negative * 100)}%
              </div>
              <div className="text-sm text-gray-300">ネガティブ</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-gray-400">
                {Math.round(lastResult.confidence.neutral * 100)}%
              </div>
              <div className="text-sm text-gray-300">ニュートラル</div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-gray-600 rounded text-center">
            <span className="text-sm text-gray-200">
              表示エフェクト:{' '}
              {getEffectForSentiment(lastResult.sentiment).description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
