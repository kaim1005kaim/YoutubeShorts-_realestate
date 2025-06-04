#!/usr/bin/env python3
import requests
import json

def test_openrouter_deepseek():
    """OpenRouter経由でDeepSeekを利用"""
    print("=== OpenRouter経由 DeepSeek テスト ===")
    
    # OpenRouterのAPIキーを取得する必要があります
    # https://openrouter.ai でアカウント作成してAPIキーを取得
    openrouter_api_key = input("OpenRouter APIキーを入力してください (https://openrouter.ai で取得): ").strip()
    
    if not openrouter_api_key:
        print("❌ APIキーが入力されていません")
        return False
    
    base_url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Real Estate Script Generator"
    }
    
    # 1. 基本接続テスト
    print("\n1. 基本接続テスト...")
    test_data = {
        "model": "deepseek/deepseek-chat",
        "messages": [
            {"role": "user", "content": "Hello, this is an API test via OpenRouter."}
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
            return True
        else:
            print(f"❌ 失敗: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ エラー: {e}")
        return False

def test_free_alternatives():
    """無料で利用可能な代替案をテスト"""
    print("=== 無料代替案テスト ===")
    
    # Claude (あなたが既に契約済み)
    print("\n✅ Claude Pro - 契約済み")
    print("- 高品質なスクリプト生成可能")
    print("- API制限内で十分利用可能")
    
    # Gemini (あなたが既に契約済み)  
    print("\n✅ Gemini Pro - 契約済み")
    print("- 多言語対応")
    print("- クリエイティブコンテンツに強い")
    
    # ローカルDeepSeek
    print("\n🔄 ローカル DeepSeek-R1-0528-Qwen3-8B")
    print("- あなたのMac Studio (M3 Ultra + 96GB) で実行可能")
    print("- 完全無料、無制限利用")
    print("- プライバシー保護")

def create_claude_script_generator():
    """Claudeを使った代替スクリプト生成システム"""
    print("\n=== Claude代替システム ===")
    
    property_info = """
物件名: サンシャインマンション301号室
家賃: 7.5万円
最寄り駅: 渋谷駅徒歩8分
間取り: 1LDK（35㎡）
築年数: 築5年
特徴: ペット可、オートロック、宅配ボックス、南向きバルコニー
"""
    
    claude_prompt = f"""
以下の物件情報から、YouTubeショート用の30秒スクリプトを作成してください。

物件情報：
{property_info}

要求事項：
1. フック（5秒）：視聴者が驚く導入
2. 物件紹介（20秒）：魅力的なポイントを3つ  
3. CTA（5秒）：問い合わせを促す

スタイル：親しみやすく、150-200文字程度

このプロンプトをClaude（あなた）に送信すれば、高品質なスクリプトが生成されます！
"""
    
    print("📝 Claudeに送信するプロンプト:")
    print("=" * 50)
    print(claude_prompt)
    print("=" * 50)

if __name__ == "__main__":
    print("🚫 DeepSeek直接API: 残高不足のため利用不可")
    print("\n💡 代替案を確認します...")
    
    # 無料代替案の表示
    test_free_alternatives()
    
    # OpenRouter経由のテスト
    choice = input("\nOpenRouter経由でDeepSeekを試しますか？ (y/n): ")
    if choice.lower() == 'y':
        test_openrouter_deepseek()
    
    # Claude代替システムの提案
    claude_choice = input("\nClaude代替システムのプロンプトを表示しますか？ (y/n): ")
    if claude_choice.lower() == 'y':
        create_claude_script_generator()
    
    print("\n🎯 推奨アプローチ:")
    print("1. 今すぐ: Claude Pro でスクリプト生成開始")
    print("2. 中期: ローカル DeepSeek-R1-Qwen3-8B 導入")
    print("3. 長期: OpenRouter経由で複数AI併用")
