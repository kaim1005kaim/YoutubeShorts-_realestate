# 不動産YouTubeショート生成ツール

AIを活用して不動産物件の魅力的なYouTubeショート動画スクリプトを自動生成するWebアプリケーションです。

## 🚀 機能

- **単一物件スクリプト生成**: 物件情報を入力して個別にスクリプト生成
- **CSV一括処理**: 複数物件のスクリプトを一括生成
- **リアルタイム統計**: 生成数、コスト、平均コストの表示
- **結果エクスポート**: スクリプトのダウンロード、JSON出力
- **CSVテンプレート**: サンプルCSVファイルのダウンロード

## 🛠️ 技術スタック

- **フロントエンド**: HTML5, JavaScript (ES6+), Tailwind CSS
- **API**: DeepSeek Chat API
- **デプロイ**: Netlify対応

## 📋 セットアップ

### 1. リポジトリクローン
```bash
git clone https://github.com/kaim1005kaim/YoutubeShorts-_realestate.git
cd YoutubeShorts-_realestate
```

### 2. DeepSeek APIキー取得
1. [DeepSeek Platform](https://platform.deepseek.com/)でアカウント作成
2. APIキーを生成
3. WebアプリでAPIキーを入力

### 3. ローカル開発
```bash
# シンプルなHTTPサーバーで起動
python3 -m http.server 8000 --directory web

# または Node.js環境の場合
npx serve web
```

ブラウザで `http://localhost:8000` にアクセス

## 📁 ディレクトリ構成

```
YoutubeShorts-_realestate/
├── web/
│   ├── index.html      # メインHTML
│   ├── script.js       # JavaScript機能
│   └── style.css       # カスタムCSS (オプション)
├── examples/
│   └── sample.csv      # サンプルCSVファイル
├── docs/
│   └── api-guide.md    # API使用ガイド
└── README.md
```

## 🎯 使用方法

### API キー設定
1. DeepSeek Platform でAPIキーを取得
2. Webアプリの「API設定」にキーを入力
3. 「保存」ボタンでローカルストレージに保存

### 単一物件の処理
1. 物件情報フォームに入力
   - 物件名（必須）
   - 家賃（必須）
   - 最寄り駅
   - 間取り
   - 築年数
   - 特徴
2. 「スクリプト生成」ボタンをクリック
3. 生成されたスクリプトをコピー・ダウンロード

### CSV一括処理
1. CSVテンプレートをダウンロード
2. 物件データを入力
3. CSVファイルをアップロード
4. 「一括生成」で全物件のスクリプトを生成

## 💰 コスト目安

- 1スクリプト生成: 約$0.0001 (0.01円)
- 100物件一括処理: 約$0.01 (1円)
- 1,000物件処理: 約$0.1 (10円)

## 🚀 Netlifyデプロイ

### 自動デプロイ設定
```bash
# Git初期化・コミット
git init
git add .
git commit -m "Initial commit: Real Estate YouTube Shorts Generator"
git branch -M main
git remote add origin https://github.com/kaim1005kaim/YoutubeShorts-_realestate.git
git push -u origin main
```

### Netlify設定
1. [Netlify](https://netlify.com)にログイン
2. 「Import from Git」でリポジトリ接続
3. ビルド設定:
   - Build command: (空白)
   - Publish directory: `web`
4. 「Deploy」実行

### 環境変数 (オプション)
Netlifyダッシュボードで設定可能:
- `DEEPSEEK_API_URL`: API URL（デフォルト設定済み）

## 📊 スクリプト生成例

### 入力
```
物件名: サンシャインマンション301号室
家賃: 7.5万円
最寄り駅: 渋谷駅徒歩8分
間取り: 1LDK（35㎡）
築年数: 築5年
特徴: ペット可、オートロック、宅配ボックス
```

### 出力
```
[フック]
「渋谷で7.5万円！？築浅ペット可1LDKが今なら空いてます！」

[物件紹介]
サンシャインマンション301号室は渋谷駅徒歩8分の好立地！築5年のキレイな1LDKで、南向きバルコニーで日当たりバツグン♪ペットもOKなのにオートロックと宅配ボックスでセキュリティも安心。35㎡の広々空間で快適生活が送れます！

[CTA]
「このお得な物件、気になったら今すぐDMかコメントでお問い合わせを！」
```

## 🔧 開発・カスタマイズ

### 新機能追加
1. `script.js`のPropertyScriptGeneratorクラスを拡張
2. `index.html`にUI要素を追加
3. Tailwind CSSでスタイリング

### API設定変更
`script.js`の以下の部分を編集:
```javascript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    // API設定
});
```

## 🐛 トラブルシューティング

### よくある問題

**「Insufficient Balance」エラー**
- DeepSeek Platformで残高を確認
- APIキーが正しく設定されているか確認

**CSV読み込みエラー**
- CSVの文字エンコーディングをUTF-8に設定
- テンプレート通りの形式で入力

**CORS エラー**
- HTTPSでアクセス（Netlifyデプロイ後）
- ローカル開発時はシンプルHTTPサーバーを使用

## 📈 今後の拡張予定

- [ ] 音声生成機能統合
- [ ] 動画作成フロー自動化
- [ ] YouTube API連携
- [ ] 物件画像認識・分析
- [ ] A/Bテスト機能
- [ ] 成約率トラッキング

## 🤝 コントリビューション

1. Forkしてブランチ作成
2. 機能追加・バグ修正
3. テスト実行
4. Pull Request作成

## 📄 ライセンス

MIT License

## 📞 サポート

問題や質問があれば、GitHubのIssuesで報告してください。

---

**🎬 不動産YouTubeショート生成で成約率アップを実現！**