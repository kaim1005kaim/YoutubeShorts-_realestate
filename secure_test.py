#!/usr/bin/env python3
"""
セキュアなDeepSeekテスト - APIキー管理のベストプラクティス
"""
import os
import requests
import json
from pathlib import Path

def load_api_key():
    """安全にAPIキーを読み込み"""
    
    # 1. 環境変数から取得
    api_key = os.getenv('DEEPSEEK_API_KEY')
    if api_key:
        print("✅ 環境変数からAPIキーを読み込みました")
        return api_key
    
    # 2. .env ファイルから取得
    env_file = Path('.env')
    if env_file.exists():
        try:
            with open(env_file, 'r') as f:
                for line in f:
                    if line.startswith('DEEPSEEK_API_KEY='):
                        api_key = line.split('=', 1)[1].strip().strip('"\'')
                        print("✅ .envファイルからAPIキーを読み込みました")
                        return api_key
        except Exception as e:
            print(f"⚠️ .envファイル読み込みエラー: {e}")
    
    # 3. 対話的入力
    print("🔐 APIキーが見つかりません")
    print("以下の方法でAPIキーを設定できます:")
    print("1. 環境変数: export DEEPSEEK_API_KEY='your-key'")
    print("2. .envファイル: echo 'DEEPSEEK_API_KEY=\"your-key\"' > .env")
    print("3. 以下に直接入力:")
    
    api_key = input("\nDeepSeek APIキーを入力してください: ").strip()
    if not api_key:
        raise ValueError("APIキーが入力されていません")
    
    return api_key

def test_api_connection(api_key):
    """API接続テスト"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": "Hello, API test."}],
        "max_tokens": 50
    }
    
    try:
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API接続成功!")
            print(f"応答: {result['choices'][0]['message']['content']}")
            return True
        else:
            print(f"❌ API接続失敗: {response.status_code}")
            print(f"エラー: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 接続エラー: {e}")
        return False

def main():
    print("🔐 セキュアDeepSeek APIテスト")
    print("=" * 40)
    
    try:
        # APIキーを安全に取得
        api_key = load_api_key()
        
        # 接続テスト
        if test_api_connection(api_key):
            print("\n🎉 セットアップ完了!")
            print("WebアプリでこのAPIキーを使用してください")
        else:
            print("\n❌ API接続に失敗しました")
            print("APIキーを確認してください")
            
    except Exception as e:
        print(f"\n❌ エラー: {e}")

if __name__ == "__main__":
    main()
