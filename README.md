# Text2Effect - AWS 感情分析エフェクトアプリ

AWS Comprehend を使用してテキストの感情を分析し、結果に応じてリアルタイムエフェクトを表示する React アプリケーションです。

## 機能

### 感情分析

- AWS Comprehend を使用した日本語テキストの感情分析
- ポジティブ、ネガティブ、ニュートラル、混合の 4 つの感情を検出
- 各感情の信頼度スコアを表示

### エフェクト表示

感情分析の結果に応じて以下のエフェクトが表示されます：

- **ポジティブ** → 楽しいエフェクト（キャラクター、ハッピーコンフェッティ）
- **ネガティブ** → 悲しいエフェクト（雨、雪）
- **混合** → 怒りのエフェクト（雷、火山噴火）
- **ニュートラル** → 普通のエフェクト（静かな粒子）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. AWS 認証情報の設定

プロジェクトルートに`.env`ファイルを作成し、以下の内容を追加：

```env
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
VITE_AWS_REGION=ap-northeast-1
```

### 3. AWS IAM ユーザーの設定

AWS Comprehend を使用するための IAM ユーザーを作成し、以下のポリシーを付与：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "comprehend:DetectSentiment",
        "comprehend:DetectDominantLanguage"
      ],
      "Resource": "*"
    }
  ]
}
```

### 4. アプリケーションの起動

```bash
npm run dev
```

## 使用方法

1. テキスト入力欄に感情を分析したい日本語テキストを入力
2. 「感情を分析」ボタンをクリック
3. AWS Comprehend がテキストの感情を分析
4. 分析結果に応じて自動的にエフェクトが表示される

## 使用技術

- **フロントエンド**: React + TypeScript + Tailwind CSS
- **感情分析**: AWS Comprehend
- **アニメーション**: CSS Animations + React Hooks
- **ビルドツール**: Vite

## ファイル構成

```
src/
├── components/           # Reactコンポーネント
│   ├── SentimentInput.tsx    # 感情分析入力UI
│   ├── LightningEffect.tsx   # 雷エフェクト
│   ├── RainEffect.tsx        # 雨エフェクト
│   ├── SakuraEffect.tsx      # 桜エフェクト
│   ├── GoodMarkEffect.tsx    # キャラクターエフェクト
│   ├── NormalMoodEffect.tsx  # 普通気持ちエフェクト
│   └── ...
├── services/            # 外部サービス連携
│   └── sentimentAnalysis.ts  # AWS Comprehend API
└── App.tsx             # メインアプリケーション
```

## AWS 料金について

AWS Comprehend の料金は以下の通りです（2024 年時点）：

- **感情分析**: 1,000 文字あたり $0.0001（約 0.015 円）
- **無料利用枠**: 月間 50,000 文字まで無料

詳細は[AWS Comprehend 料金](https://aws.amazon.com/comprehend/pricing/)を確認してください。

## トラブルシューティング

### よくある問題

1. **「感情分析に失敗しました」エラー**

   - AWS 認証情報が正しく設定されているか確認
   - IAM ユーザーに Comprehend の権限があるか確認

2. **ネットワークエラー**

   - インターネット接続を確認
   - AWS リージョン設定を確認

3. **テキストが分析されない**
   - 日本語テキストであることを確認
   - テキストが空でないことを確認

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。
