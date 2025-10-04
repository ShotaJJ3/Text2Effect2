import os
from dotenv import load_dotenv
import boto3
from flask import Flask, request, jsonify

# .envファイルから環境変数を読み込む
load_dotenv()

# 環境変数からAWSの認証情報を取得
aws_access_key = os.getenv("MY_ACCESS_KEY")
aws_secret_key = os.getenv("MY_SECRET_KEY")

# AWS Comprehendサービスクライアントを作成
comprehend = boto3.client(
    'comprehend',
    region_name='ap-northeast-1',
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key
)

# Flaskアプリケーションを初期化
app = Flask(__name__)

# '/analyze' というURLでPOSTリクエストを受け付けるAPIを定義
@app.route('/analyze', methods=['POST'])
def analyze_sentiment_api():
    """
    POSTリクエストで送られてきたJSON内のテキストを感情分析し、
    結果をJSONで返す。
    """
    try:
        # リクエストのJSONボディを取得
        data = request.get_json()

# JSONから'text'キーの値を取得
        text_to_analyze = data.get('text')

        # テキストが送られてきていない場合はエラーを返す
        if not text_to_analyze:
            return jsonify({"error": "textキーがありません。"}), 400

        # AWS Comprehendで感情分析を実行
        response = comprehend.detect_sentiment(
            Text=text_to_analyze,
            LanguageCode='ja'
        )

        # 返却するJSONデータを作成
        result = {
            'inputText': text_to_analyze,
            'sentiment': response['Sentiment'],
            'scores': {
                'positive': response['SentimentScore']['Positive'],
                'negative': response['SentimentScore']['Negative'],
                'neutral': response['SentimentScore']['Neutral'],
                'mixed': response['SentimentScore']['Mixed']
            }
        }

# JSON形式で結果を返す
        return jsonify(result)

    except Exception as e:
        # サーバー内部でエラーが発生した場合
        return jsonify({"error": str(e)}), 500

# このスクリプトが直接実行された場合にサーバーを起動
if __name__ == '__main__':
    app.run(debug=True, port=5000)
