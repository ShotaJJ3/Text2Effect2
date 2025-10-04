# Text2Effect Backend API

Flask と SQLite を使用したチャット履歴保存・管理 API です。

## 機能

- チャット履歴の保存・取得・削除
- セッション管理（複数のチャットをグループ化）
- 感情分析結果とエフェクト情報の保存
- 過去のエフェクト再現

## セットアップ

### 1. 依存関係のインストール

```bash
cd backend
pip install -r requirements.txt
```

### 2. アプリケーションの起動

```bash
python app.py
```

API サーバーが `http://localhost:5000` で起動します。

## API エンドポイント

### チャット履歴

#### POST /api/chat

チャット履歴を保存

```json
{
  "text": "今日はとても良い天気です！",
  "sentiment": "POSITIVE",
  "confidence": {
    "positive": 0.95,
    "negative": 0.03,
    "neutral": 0.01,
    "mixed": 0.01
  },
  "effect_type": "happy",
  "effect_description": "楽しいエフェクト（キャラクター）",
  "session_id": "optional-session-id"
}
```

#### GET /api/chats

チャット履歴を取得

- `session_id` (optional): 特定のセッションのチャット履歴
- `limit` (optional): 取得件数（デフォルト: 50）

#### DELETE /api/chats/{chat_id}

チャット履歴を削除

### セッション管理

#### GET /api/sessions

セッション一覧を取得

#### POST /api/sessions

新しいセッションを作成

```json
{
  "name": "セッション名"
}
```

#### DELETE /api/sessions/{session_id}

セッションを削除

## データベース構造

### chat_history テーブル

- `id`: チャット ID（UUID）
- `text`: 入力テキスト
- `sentiment`: 感情分析結果
- `confidence`: 信頼度スコア（JSON）
- `effect_type`: エフェクトタイプ
- `effect_description`: エフェクト説明
- `created_at`: 作成日時

### sessions テーブル

- `id`: セッション ID（UUID）
- `name`: セッション名
- `created_at`: 作成日時

### session_chats テーブル

- `session_id`: セッション ID
- `chat_id`: チャット ID

## 使用例

### チャット履歴の保存

```javascript
fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: '今日はとても良い天気です！',
    sentiment: 'POSITIVE',
    confidence: {
      positive: 0.95,
      negative: 0.03,
      neutral: 0.01,
      mixed: 0.01,
    },
    effect_type: 'happy',
    effect_description: '楽しいエフェクト（キャラクター）',
  }),
});
```

### チャット履歴の取得

```javascript
fetch('http://localhost:5000/api/chats')
  .then((response) => response.json())
  .then((data) => console.log(data.chats));
```

## 開発

### データベースのリセット

データベースファイル（`chat_history.db`）を削除すると、次回起動時に自動的に再作成されます。

### ログ出力

Flask のデバッグモードが有効になっているため、詳細なログが出力されます。

## トラブルシューティング

### よくある問題

1. **ポート 5000 が使用中**

   - 他のアプリケーションがポート 5000 を使用している可能性があります
   - `app.py`の最後の行でポート番号を変更してください

2. **データベースエラー**

   - データベースファイルの権限を確認してください
   - ファイルが破損している場合は削除して再起動してください

3. **CORS エラー**
   - フロントエンドからのリクエストがブロックされる場合
   - `flask-cors`が正しくインストールされているか確認してください
