import { useState, useEffect } from 'react';
import {
  ChatHistory,
  Session,
  getChatHistory,
  getSessions,
  createSession,
  deleteChatHistory,
  deleteSession,
  reproduceEffect,
} from '../services/chatHistory';

interface ChatHistoryProps {
  onEffectReproduced: (emotion: string, description: string) => void;
}

export default function ChatHistoryComponent({
  onEffectReproduced,
}: ChatHistoryProps) {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // チャット履歴を読み込む
  const loadChatHistory = async (sessionId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getChatHistory(sessionId);
      if (result.success && result.chats) {
        setChats(result.chats);
      } else {
        setError(result.error || 'チャット履歴の取得に失敗しました');
      }
    } catch (err) {
      setError('チャット履歴の取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // セッション一覧を読み込む
  const loadSessions = async () => {
    try {
      const result = await getSessions();
      if (result.success && result.sessions) {
        setSessions(result.sessions);
      }
    } catch (err) {
      console.error('セッション取得エラー:', err);
    }
  };

  // コンポーネントマウント時にデータを読み込む
  useEffect(() => {
    loadChatHistory();
    loadSessions();
  }, []);

  // セッション選択時の処理
  const handleSessionSelect = (sessionId: string | null) => {
    setSelectedSession(sessionId);
    loadChatHistory(sessionId);
  };

  // 新しいセッションを作成
  const handleCreateSession = async () => {
    if (!newSessionName.trim()) {
      setError('セッション名を入力してください');
      return;
    }

    try {
      const result = await createSession(newSessionName);
      if (result.success) {
        setNewSessionName('');
        loadSessions();
        setError(null);
      } else {
        setError(result.error || 'セッションの作成に失敗しました');
      }
    } catch (err) {
      setError('セッション作成中にエラーが発生しました');
    }
  };

  // チャット履歴を削除
  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('このチャット履歴を削除しますか？')) {
      return;
    }

    try {
      const result = await deleteChatHistory(chatId);
      if (result.success) {
        loadChatHistory(selectedSession);
      } else {
        setError(result.error || '削除に失敗しました');
      }
    } catch (err) {
      setError('削除中にエラーが発生しました');
    }
  };

  // セッションを削除
  const handleDeleteSession = async (sessionId: string) => {
    if (
      !confirm(
        'このセッションを削除しますか？（関連するチャット履歴も削除されます）'
      )
    ) {
      return;
    }

    try {
      const result = await deleteSession(sessionId);
      if (result.success) {
        loadSessions();
        if (selectedSession === sessionId) {
          setSelectedSession(null);
          loadChatHistory();
        }
      } else {
        setError(result.error || '削除に失敗しました');
      }
    } catch (err) {
      setError('削除中にエラーが発生しました');
    }
  };

  // エフェクトを再現
  const handleReproduceEffect = (chat: ChatHistory) => {
    reproduceEffect(chat, onEffectReproduced);
  };

  // 感情の色を取得
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'text-green-400';
      case 'NEGATIVE':
        return 'text-red-400';
      case 'MIXED':
        return 'text-yellow-400';
      case 'NEUTRAL':
      default:
        return 'text-gray-400';
    }
  };

  // 感情の日本語名を取得
  const getSentimentInJapanese = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'ポジティブ';
      case 'NEGATIVE':
        return 'ネガティブ';
      case 'MIXED':
        return '混合';
      case 'NEUTRAL':
        return 'ニュートラル';
      default:
        return '不明';
    }
  };

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg mb-6 w-full">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
        チャット履歴
      </h2>

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-600/50 rounded-md">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* セッション管理 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          セッション管理
        </h3>

        {/* 新しいセッション作成 */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            placeholder="セッション名を入力"
            className="flex-1 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateSession}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors duration-200"
          >
            作成
          </button>
        </div>

        {/* セッション一覧 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => handleSessionSelect(null)}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200 ${
              selectedSession === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-gray-200'
            }`}
          >
            すべてのチャット
          </button>

          {sessions.map((session) => (
            <div key={session.id} className="flex gap-1">
              <button
                onClick={() => handleSessionSelect(session.id)}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200 ${
                  selectedSession === session.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-200'
                }`}
              >
                {session.name} ({session.chat_count})
              </button>
              <button
                onClick={() => handleDeleteSession(session.id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs transition-colors duration-200"
                title="セッションを削除"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* チャット履歴一覧 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">チャット履歴</h3>
          <button
            onClick={() => loadChatHistory(selectedSession)}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors duration-200"
          >
            更新
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-400">読み込み中...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-400">チャット履歴がありません</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto w-full">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="bg-gray-700 p-4 rounded-md border border-gray-600 w-full"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-white text-sm mb-2">{chat.text}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className={`font-semibold ${getSentimentColor(
                          chat.sentiment
                        )}`}
                      >
                        {getSentimentInJapanese(chat.sentiment)}
                      </span>
                      <span className="text-gray-400">
                        {new Date(chat.created_at).toLocaleString('ja-JP')}
                      </span>
                      {chat.session_name && (
                        <span className="text-blue-400">
                          セッション: {chat.session_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReproduceEffect(chat)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs transition-colors duration-200"
                      title="エフェクトを再現"
                    >
                      再現
                    </button>
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs transition-colors duration-200"
                      title="削除"
                    >
                      削除
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-300">
                  エフェクト: {chat.effect_description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
