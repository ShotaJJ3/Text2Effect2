import {
  ComprehendClient,
  DetectSentimentCommand,
} from '@aws-sdk/client-comprehend';

// AWS設定
const comprehendClient = new ComprehendClient({
  region: 'ap-northeast-1', // 東京リージョン
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

// 感情分析の結果型
export interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  confidence: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
}

// 感情分析を実行する関数
export const analyzeSentiment = async (
  text: string
): Promise<SentimentResult | null> => {
  try {
    if (!text.trim()) {
      throw new Error('テキストが空です');
    }

    const command = new DetectSentimentCommand({
      Text: text,
      LanguageCode: 'ja', // 日本語
    });

    const response = await comprehendClient.send(command);

    return {
      sentiment: response.Sentiment as
        | 'POSITIVE'
        | 'NEGATIVE'
        | 'NEUTRAL'
        | 'MIXED',
      confidence: {
        positive: response.SentimentScore?.Positive || 0,
        negative: response.SentimentScore?.Negative || 0,
        neutral: response.SentimentScore?.Neutral || 0,
        mixed: response.SentimentScore?.Mixed || 0,
      },
    };
  } catch (error) {
    console.error('感情分析エラー:', error);
    return null;
  }
};

// 感情を日本語に変換
export const getSentimentInJapanese = (sentiment: string): string => {
  switch (sentiment) {
    case 'POSITIVE':
      return 'ポジティブ';
    case 'NEGATIVE':
      return 'ネガティブ';
    case 'NEUTRAL':
      return 'ニュートラル';
    case 'MIXED':
      return '混合';
    default:
      return '不明';
  }
};

// 感情に応じたエフェクトのマッピング
export const getEffectForSentiment = (
  sentiment: string
): {
  emotion: 'happy' | 'joyful' | 'sad' | 'angry' | 'normal';
  description: string;
} => {
  switch (sentiment) {
    case 'POSITIVE':
      return {
        emotion: 'happy',
        description: '楽しいエフェクト（キャラクター）',
      };
    case 'NEGATIVE':
      return {
        emotion: 'sad',
        description: '悲しいエフェクト（雨）',
      };
    case 'MIXED':
      return {
        emotion: 'angry',
        description: '怒りのエフェクト（雷・火山）',
      };
    case 'NEUTRAL':
    default:
      return {
        emotion: 'normal',
        description: '普通のエフェクト',
      };
  }
};
