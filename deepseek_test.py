#!/usr/bin/env python3
import requests
import json
import os

def test_deepseek_api():
    # 環境変数からAPIキーを取得
    api_key = os.getenv('DEEPSEEK_API_KEY')
    
    if not api_key:
        api_key = input("DeepSeek APIキーを入力してください: ").strip()
        if not api_key:
            print("❌ APIキーが入力されていません")
            return False
    
    base_url = "https://api.deepseek.com/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    print("=== DeepSeek API テスト ===")
    
    # 1. 基本接続テスト
    print("\n1. 基本接続テスト...")
    test_data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "user", "content": "Hello, this is an API test."}
        ],
        "max_tokens": 50
    }
    
    try:
        response = requests.post(base_url, headers=headers, json=test_data, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ 接続成功!")
            print(f"Response: {result['choices'][0]['message']['content']}")
            
            if 'usage' in result:
                usage = result['usage']
                print(f"Tokens - Input: {usage.get('prompt_tokens', 0)}, Output: {usage.get('completion_tokens', 0)}")
        else:
            print(f"❌ 失敗: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ エラー: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🔐 セキュアなAPIテスト")
    print("APIキーは環境変数 DEEPSEEK_API_KEY から読み込まれます")
    print("または実行時に入力してください\n")
    
    test_deepseek_api()
    print("\n🎉 テスト完了!")
