#!/usr/bin/env python3
import requests
import json

def test_deepseek_api():
    # あなたのAPIキー
    api_key = "sk-f1490f9975104ffca126e45b2c415416"
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
    
    # 2. 不動産スクリプト生成テスト
    print("\n2. 不動産スクリプト生成テスト...")
    
    property_info = """
物件名: サンシャインマンション301号室
家賃: 7.5万円
最寄り駅: 渋谷駅徒歩8分
間取り: 1LDK（35㎡）
築年数: 築5年
特徴: ペット可、オートロック、宅配ボックス、南向きバルコニー
"""
    
    script_prompt = f"""
以下の物件情報から、YouTubeショート用の30秒スクリプトを作成してください。

物件情報：
{property_info}

要求事項：
1. フック（5秒）：視聴者が驚く導入
2. 物件紹介（20秒）：魅力的なポイントを3つ
3. CTA（5秒）：問い合わせを促す

スタイル：親しみやすく、150-200文字程度

出力形式：
[フック] 
[物件紹介]
[CTA]
"""
    
    script_data = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system", 
                "content": "あなたは不動産会社のYouTubeショート動画の専門スクリプトライターです。"
            },
            {"role": "user", "content": script_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 800
    }
    
    try:
        response = requests.post(base_url, headers=headers, json=script_data, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            script = result['choices'][0]['message']['content']
            
            print("✅ スクリプト生成成功!")
            print("\n=== 生成されたスクリプト ===")
            print(script)
            print("=" * 30)
            
            if 'usage' in result:
                usage = result['usage']
                print(f"\nTokens used - Input: {usage.get('prompt_tokens', 0)}, Output: {usage.get('completion_tokens', 0)}")
                
                # コスト計算 (大まかな見積もり)
                input_cost = usage.get('prompt_tokens', 0) * 0.14 / 1000000
                output_cost = usage.get('completion_tokens', 0) * 0.28 / 1000000
                total_cost = input_cost + output_cost
                print(f"Estimated cost: ${total_cost:.6f}")
            
            return True
        else:
            print(f"❌ スクリプト生成失敗: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ スクリプト生成エラー: {e}")
        return False

def generate_multiple_scripts():
    """複数物件のスクリプト生成"""
    api_key = "sk-f1490f9975104ffca126e45b2c415416"
    base_url = "https://api.deepseek.com/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # 追加の物件例
    properties = [
        {
            "name": "グランドパレス202号室",
            "info": """
物件名: グランドパレス202号室  
家賃: 6.8万円
最寄り駅: 新宿駅徒歩12分
間取り: 1K（25㎡）
築年数: 築3年
特徴: 駅近、コンビニ徒歩1分、Wi-Fi完備、女性専用
"""
        },
        {
            "name": "パークヒルズ505号室",
            "info": """
物件名: パークヒルズ505号室
家賃: 8.2万円  
最寄り駅: 表参道駅徒歩6分
間取り: 1LDK（40㎡）
築年数: 新築
特徴: デザイナーズ、屋上庭園、24時間セキュリティ
"""
        }
    ]
    
    print("\n=== 複数物件スクリプト生成 ===")
    
    for i, prop in enumerate(properties, 1):
        print(f"\n--- 物件 {i}: {prop['name']} ---")
        
        prompt = f"""
以下の物件からYouTubeショート30秒スクリプトを作成：

{prop['info']}

構成：フック5秒 + 魅力紹介20秒 + CTA5秒
150-200文字、親しみやすいトーン
"""
        
        data = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "不動産YouTubeショートの専門スクリプトライター"},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        try:
            response = requests.post(base_url, headers=headers, json=data, timeout=60)
            
            if response.status_code == 200:
                result = response.json()
                script = result['choices'][0]['message']['content']
                print(f"✅ 生成成功!")
                print(script)
                print("-" * 40)
            else:
                print(f"❌ 生成失敗: {response.status_code}")
                
        except Exception as e:
            print(f"❌ エラー: {e}")

if __name__ == "__main__":
    # 基本テスト実行
    success = test_deepseek_api()
    
    if success:
        # 追加テスト実行の確認
        choice = input("\n複数物件の追加テストを実行しますか？ (y/n): ")
        if choice.lower() == 'y':
            generate_multiple_scripts()
    
    print("\n🎉 テスト完了!")
