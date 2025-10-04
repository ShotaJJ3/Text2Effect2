from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # フロントエンドとの通信を許可

# データベースファイルのパス
DATABASE = 'chat_history.db'

def init_db():
    """データベースの初期化"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # チャット履歴テーブル
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            sentiment TEXT NOT NULL,
            confidence TEXT NOT NULL,
            effect_type TEXT NOT NULL,
            effect_description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # セッションテーブル（複数のチャットをグループ化）
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # セッションとチャットの関連テーブル
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS session_chats (
            session_id TEXT NOT NULL,
            chat_id TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions (id),
            FOREIGN KEY (chat_id) REFERENCES chat_history (id),
            PRIMARY KEY (session_id, chat_id)
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """データベース接続を取得"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # 辞書形式で結果を取得
    return conn

@app.route('/api/chat', methods=['POST'])
def save_chat():
    """チャット履歴を保存"""
    try:
        data = request.json
        text = data.get('text')
        sentiment = data.get('sentiment')
        confidence = data.get('confidence')
        effect_type = data.get('effect_type')
        effect_description = data.get('effect_description')
        session_id = data.get('session_id')
        
        if not all([text, sentiment, confidence, effect_type, effect_description]):
            return jsonify({'error': '必須フィールドが不足しています'}), 400
        
        # チャットIDを生成
        chat_id = str(uuid.uuid4())
        
        # データベースに保存
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO chat_history (id, text, sentiment, confidence, effect_type, effect_description)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (chat_id, text, sentiment, json.dumps(confidence), effect_type, effect_description))
        
        # セッションが指定されている場合、関連付けを追加
        if session_id:
            cursor.execute('''
                INSERT INTO session_chats (session_id, chat_id)
                VALUES (?, ?)
            ''', (session_id, chat_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'chat_id': chat_id,
            'message': 'チャット履歴を保存しました'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chats', methods=['GET'])
def get_chats():
    """チャット履歴を取得"""
    try:
        session_id = request.args.get('session_id')
        limit = request.args.get('limit', 50, type=int)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if session_id:
            # 特定のセッションのチャット履歴を取得
            cursor.execute('''
                SELECT ch.*, s.name as session_name
                FROM chat_history ch
                JOIN session_chats sc ON ch.id = sc.chat_id
                JOIN sessions s ON sc.session_id = s.id
                WHERE sc.session_id = ?
                ORDER BY ch.created_at DESC
                LIMIT ?
            ''', (session_id, limit))
        else:
            # すべてのチャット履歴を取得
            cursor.execute('''
                SELECT ch.*, s.name as session_name
                FROM chat_history ch
                LEFT JOIN session_chats sc ON ch.id = sc.chat_id
                LEFT JOIN sessions s ON sc.session_id = s.id
                ORDER BY ch.created_at DESC
                LIMIT ?
            ''', (limit,))
        
        chats = []
        for row in cursor.fetchall():
            chat = {
                'id': row['id'],
                'text': row['text'],
                'sentiment': row['sentiment'],
                'confidence': json.loads(row['confidence']),
                'effect_type': row['effect_type'],
                'effect_description': row['effect_description'],
                'created_at': row['created_at'],
                'session_name': row['session_name']
            }
            chats.append(chat)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'chats': chats
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    """セッション一覧を取得"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT s.*, COUNT(sc.chat_id) as chat_count
            FROM sessions s
            LEFT JOIN session_chats sc ON s.id = sc.session_id
            GROUP BY s.id
            ORDER BY s.created_at DESC
        ''')
        
        sessions = []
        for row in cursor.fetchall():
            session = {
                'id': row['id'],
                'name': row['name'],
                'created_at': row['created_at'],
                'chat_count': row['chat_count']
            }
            sessions.append(session)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'sessions': sessions
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sessions', methods=['POST'])
def create_session():
    """新しいセッションを作成"""
    try:
        data = request.json
        name = data.get('name')
        
        if not name:
            return jsonify({'error': 'セッション名が必要です'}), 400
        
        session_id = str(uuid.uuid4())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO sessions (id, name)
            VALUES (?, ?)
        ''', (session_id, name))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'message': 'セッションを作成しました'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chats/<chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    """チャット履歴を削除"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # セッションとの関連を削除
        cursor.execute('DELETE FROM session_chats WHERE chat_id = ?', (chat_id,))
        
        # チャット履歴を削除
        cursor.execute('DELETE FROM chat_history WHERE id = ?', (chat_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'チャット履歴を削除しました'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sessions/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """セッションを削除"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # セッションとの関連を削除
        cursor.execute('DELETE FROM session_chats WHERE session_id = ?', (session_id,))
        
        # セッションを削除
        cursor.execute('DELETE FROM sessions WHERE id = ?', (session_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'セッションを削除しました'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# フロントエンドの静的ファイルを提供（開発用）
@app.route('/')
def serve_frontend():
    return send_from_directory('../dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../dist', path)

if __name__ == '__main__':
    # データベースを初期化
    init_db()
    
    # 開発サーバーを起動
    app.run(debug=True, host='0.0.0.0', port=5000)
