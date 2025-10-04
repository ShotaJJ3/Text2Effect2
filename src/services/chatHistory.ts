import { SentimentResult } from './sentimentAnalysis';

// チャット履歴の型定義
export interface ChatHistory {
  id: string;
  text: string;
  sentiment: string;
  confidence: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
  effect_type: string;
  effect_description: string;
  created_at: string;
  session_name?: string;
}

export interface Session {
  id: string;
  name: string;
  created_at: string;
  chat_count: number;
}

// APIのベースURL（バックエンドが利用できない場合はローカルストレージを使用）
const API_BASE_URL = 'http://localhost:5000/api';

// ローカルストレージのキー
const LOCAL_STORAGE_KEYS = {
  CHAT_HISTORY: 'text2effect_chat_history',
  SESSIONS: 'text2effect_sessions',
};

// ローカルストレージ用のヘルパー関数
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// ローカルストレージからデータを取得
const getFromLocalStorage = (key: string, defaultValue: any = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('ローカルストレージ読み込みエラー:', error);
    return defaultValue;
  }
};

// ローカルストレージにデータを保存
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('ローカルストレージ保存エラー:', error);
    return false;
  }
};

// チャット履歴を保存
export const saveChatHistory = async (
  text: string,
  sentimentResult: SentimentResult,
  effectType: string,
  effectDescription: string,
  sessionId?: string
): Promise<{ success: boolean; chat_id?: string; error?: string }> => {
  try {
    // まずバックエンドAPIを試行
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        effect_type: effectType,
        effect_description: effectDescription,
        session_id: sessionId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, chat_id: data.chat_id };
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    console.warn('バックエンドAPI利用不可、ローカルストレージを使用:', error);

    // ローカルストレージに保存
    try {
      const chatId = generateId();
      const newChat: ChatHistory = {
        id: chatId,
        text,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        effect_type: effectType,
        effect_description: effectDescription,
        created_at: new Date().toISOString(),
        session_name: sessionId ? getSessionName(sessionId) : undefined,
      };

      const existingChats = getFromLocalStorage(
        LOCAL_STORAGE_KEYS.CHAT_HISTORY
      );
      const updatedChats = [newChat, ...existingChats];

      if (saveToLocalStorage(LOCAL_STORAGE_KEYS.CHAT_HISTORY, updatedChats)) {
        return { success: true, chat_id: chatId };
      } else {
        return {
          success: false,
          error: 'ローカルストレージへの保存に失敗しました',
        };
      }
    } catch (localError) {
      console.error('ローカルストレージ保存エラー:', localError);
      return { success: false, error: 'データの保存に失敗しました' };
    }
  }
};

// セッション名を取得するヘルパー関数
const getSessionName = (sessionId: string): string => {
  const sessions = getFromLocalStorage(LOCAL_STORAGE_KEYS.SESSIONS);
  const session = sessions.find((s: Session) => s.id === sessionId);
  return session ? session.name : 'Unknown Session';
};

// チャット履歴を取得
export const getChatHistory = async (
  sessionId?: string,
  limit: number = 50
): Promise<{ success: boolean; chats?: ChatHistory[]; error?: string }> => {
  try {
    // まずバックエンドAPIを試行
    const url = new URL(`${API_BASE_URL}/chats`);
    if (sessionId) {
      url.searchParams.append('session_id', sessionId);
    }
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString());

    if (response.ok) {
      const data = await response.json();
      return { success: true, chats: data.chats };
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    console.warn('バックエンドAPI利用不可、ローカルストレージを使用:', error);

    // ローカルストレージから取得
    try {
      const allChats = getFromLocalStorage(LOCAL_STORAGE_KEYS.CHAT_HISTORY);

      let filteredChats = allChats;
      if (sessionId) {
        // セッションIDでフィルタリング（ローカルストレージでは簡易実装）
        filteredChats = allChats.filter(
          (chat: ChatHistory) => chat.session_name === getSessionName(sessionId)
        );
      }

      const limitedChats = filteredChats.slice(0, limit);
      return { success: true, chats: limitedChats };
    } catch (localError) {
      console.error('ローカルストレージ読み込みエラー:', localError);
      return { success: false, error: 'データの取得に失敗しました' };
    }
  }
};

// セッション一覧を取得
export const getSessions = async (): Promise<{
  success: boolean;
  sessions?: Session[];
  error?: string;
}> => {
  try {
    // まずバックエンドAPIを試行
    const response = await fetch(`${API_BASE_URL}/sessions`);

    if (response.ok) {
      const data = await response.json();
      return { success: true, sessions: data.sessions };
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    console.warn('バックエンドAPI利用不可、ローカルストレージを使用:', error);

    // ローカルストレージから取得
    try {
      const sessions = getFromLocalStorage(LOCAL_STORAGE_KEYS.SESSIONS);
      return { success: true, sessions };
    } catch (localError) {
      console.error('ローカルストレージ読み込みエラー:', localError);
      return { success: false, error: 'データの取得に失敗しました' };
    }
  }
};

// 新しいセッションを作成
export const createSession = async (
  name: string
): Promise<{
  success: boolean;
  session_id?: string;
  error?: string;
}> => {
  try {
    // まずバックエンドAPIを試行
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, session_id: data.session_id };
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    console.warn('バックエンドAPI利用不可、ローカルストレージを使用:', error);

    // ローカルストレージに保存
    try {
      const sessionId = generateId();
      const newSession: Session = {
        id: sessionId,
        name,
        created_at: new Date().toISOString(),
        chat_count: 0,
      };

      const existingSessions = getFromLocalStorage(LOCAL_STORAGE_KEYS.SESSIONS);
      const updatedSessions = [newSession, ...existingSessions];

      if (saveToLocalStorage(LOCAL_STORAGE_KEYS.SESSIONS, updatedSessions)) {
        return { success: true, session_id: sessionId };
      } else {
        return {
          success: false,
          error: 'ローカルストレージへの保存に失敗しました',
        };
      }
    } catch (localError) {
      console.error('ローカルストレージ保存エラー:', localError);
      return { success: false, error: 'セッションの作成に失敗しました' };
    }
  }
};

// チャット履歴を削除
export const deleteChatHistory = async (
  chatId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // まずバックエンドAPIを試行
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return { success: true };
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    console.warn('バックエンドAPI利用不可、ローカルストレージを使用:', error);

    // ローカルストレージから削除
    try {
      const allChats = getFromLocalStorage(LOCAL_STORAGE_KEYS.CHAT_HISTORY);
      const updatedChats = allChats.filter(
        (chat: ChatHistory) => chat.id !== chatId
      );

      if (saveToLocalStorage(LOCAL_STORAGE_KEYS.CHAT_HISTORY, updatedChats)) {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'ローカルストレージからの削除に失敗しました',
        };
      }
    } catch (localError) {
      console.error('ローカルストレージ削除エラー:', localError);
      return { success: false, error: '削除に失敗しました' };
    }
  }
};

// セッションを削除
export const deleteSession = async (
  sessionId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // まずバックエンドAPIを試行
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return { success: true };
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    console.warn('バックエンドAPI利用不可、ローカルストレージを使用:', error);

    // ローカルストレージから削除
    try {
      const allSessions = getFromLocalStorage(LOCAL_STORAGE_KEYS.SESSIONS);
      const updatedSessions = allSessions.filter(
        (session: Session) => session.id !== sessionId
      );

      if (saveToLocalStorage(LOCAL_STORAGE_KEYS.SESSIONS, updatedSessions)) {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'ローカルストレージからの削除に失敗しました',
        };
      }
    } catch (localError) {
      console.error('ローカルストレージ削除エラー:', localError);
      return { success: false, error: '削除に失敗しました' };
    }
  }
};

// エフェクトを再現するための関数
export const reproduceEffect = (
  chatHistory: ChatHistory,
  onEffectReproduced: (emotion: string, description: string) => void
) => {
  // 感情に応じてエフェクトを再現
  let emotion: string;

  switch (chatHistory.sentiment) {
    case 'POSITIVE':
      emotion = 'happy';
      break;
    case 'NEGATIVE':
      emotion = 'sad';
      break;
    case 'MIXED':
      emotion = 'angry';
      break;
    case 'NEUTRAL':
    default:
      emotion = 'normal';
      break;
  }

  onEffectReproduced(emotion, chatHistory.effect_description);
};
