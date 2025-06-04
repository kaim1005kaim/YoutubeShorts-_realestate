// 不動産YouTubeショート生成ツール - JavaScript

class PropertyScriptGenerator {
    constructor() {
        this.apiKey = localStorage.getItem('deepseek_api_key') || '';
        this.totalGenerated = 0;
        this.totalCost = 0;
        this.results = [];
        
        // 初期化
        this.initializeApp();
    }
    
    initializeApp() {
        // 保存されたAPIキーがあれば表示
        if (this.apiKey) {
            document.getElementById('apiKey').value = this.apiKey;
        }
        
        // 統計表示を初期化
        this.updateStats();
    }
    
    saveApiKey() {
        const apiKey = document.getElementById('apiKey').value.trim();
        if (!apiKey) {
            alert('APIキーを入力してください');
            return;
        }
        
        this.apiKey = apiKey;
        localStorage.setItem('deepseek_api_key', apiKey);
        
        // 成功メッセージ
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ 保存完了';
        btn.className = btn.className.replace('bg-secondary', 'bg-accent');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.className = btn.className.replace('bg-accent', 'bg-secondary');
        }, 2000);
    }
    
    async generateScript(propertyData) {
        if (!this.apiKey) {
            throw new Error('APIキーが設定されていません');
        }
        
        const propertyInfo = `
物件名: ${propertyData.物件名 || ''}
家賃: ${propertyData.家賃 || ''}
最寄り駅: ${propertyData.最寄り駅 || ''}
間取り: ${propertyData.間取り || ''}
築年数: ${propertyData.築年数 || ''}
特徴: ${propertyData.特徴 || ''}
`;
        
        const prompt = `
以下の物件情報から、YouTubeショート用の30秒スクリプトを作成してください。

物件情報：
${propertyInfo}

要求事項：
1. フック（5秒）：視聴者が「えっ！」と思う導入
2. 物件紹介（20秒）：魅力的なポイントを3つ
3. CTA（5秒）：問い合わせを促す

スタイル：親しみやすく、150-200文字程度

出力形式：
[フック] 
[物件紹介]
[CTA]
`;
        
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたは不動産会社のYouTubeショート動画の専門スクリプトライターです。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const result = await response.json();
        const script = result.choices[0].message.content;
        const usage = result.usage || {};
        
        // コスト計算
        const inputCost = (usage.prompt_tokens || 0) * 0.14 / 1000000;
        const outputCost = (usage.completion_tokens || 0) * 0.28 / 1000000;
        const totalCost = inputCost + outputCost;
        
        return {
            script,
            usage,
            cost: totalCost,
            propertyData
        };
    }
    
    async generateSingleScript() {
        // フォームデータ取得
        const propertyData = {
            物件名: document.getElementById('propertyName').value,
            家賃: document.getElementById('rent').value,
            最寄り駅: document.getElementById('station').value,
            間取り: document.getElementById('layout').value,
            築年数: document.getElementById('age').value,
            特徴: document.getElementById('features').value
        };
        
        // バリデーション
        if (!propertyData.物件名 || !propertyData.家賃) {
            alert('物件名と家賃は必須項目です');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const result = await this.generateScript(propertyData);
            this.displayResult(result);
            this.updateStats();
        } catch (error) {
            alert(`エラー: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }
    
    async generateBatchScripts() {
        const fileInput = document.getElementById('csvFile');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('CSVファイルを選択してください');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const csvText = await this.readFile(file);
            const properties = this.parseCSV(csvText);
            
            if (properties.length === 0) {
                throw new Error('有効な物件データが見つかりません');
            }
            
            const batchResults = [];
            
            for (let i = 0; i < properties.length; i++) {
                try {
                    const result = await this.generateScript(properties[i]);
                    result.propertyIndex = i + 1;
                    batchResults.push(result);
                    this.displayResult(result, true);
                    
                    // API制限を考慮して待機
                    if (i < properties.length - 1) {
                        await this.sleep(1000);
                    }
                } catch (error) {
                    console.error(`物件 ${i + 1} でエラー:`, error);
                    batchResults.push({
                        error: error.message,
                        propertyData: properties[i],
                        propertyIndex: i + 1
                    });
                }
            }
            
            this.displayBatchSummary(batchResults);
            this.updateStats();
            
        } catch (error) {
            alert(`エラー: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }
    
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        if (lines.length < 2) {
            throw new Error('CSVファイルが無効です');
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        const properties = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',').map(v => v.trim());
            const property = {};
            
            // ヘッダーとデータをマッピング
            headers.forEach((header, index) => {
                property[header] = values[index] || '';
            });
            
            properties.push(property);
        }
        
        return properties;
    }
    
    displayResult(result, isBatch = false) {
        const resultsContainer = document.getElementById('results');
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'bg-white rounded-lg shadow-md p-6 mb-6';
        
        if (result.error) {
            resultDiv.innerHTML = `
                <div class="border-l-4 border-red-500 pl-4">
                    <h3 class="text-lg font-semibold text-red-700 mb-2">
                        ❌ エラー ${isBatch ? `(物件 ${result.propertyIndex})` : ''}
                    </h3>
                    <p class="text-red-600">${result.error}</p>
                    <div class="mt-2 text-sm text-gray-600">
                        物件名: ${result.propertyData?.物件名 || 'Unknown'}
                    </div>
                </div>
            `;
        } else {
            const script = result.script;
            const cost = result.cost;
            const usage = result.usage;
            
            // 統計更新
            this.totalGenerated++;
            this.totalCost += cost;
            this.results.push(result);
            
            resultDiv.innerHTML = `
                <div class="border-l-4 border-accent pl-4">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">
                            🎬 ${result.propertyData.物件名 || '物件'} ${isBatch ? `(${result.propertyIndex}件目)` : ''}
                        </h3>
                        <div class="text-right text-sm text-gray-500">
                            <div>コスト: $${cost.toFixed(6)}</div>
                            <div>トークン: ${usage.prompt_tokens || 0} + ${usage.completion_tokens || 0}</div>
                        </div>
                    </div>
                    
                    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold text-gray-700 mb-2">📝 生成されたスクリプト</h4>
                        <pre class="whitespace-pre-wrap text-sm text-gray-800">${script}</pre>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div><strong>家賃:</strong> ${result.propertyData.家賃}</div>
                        <div><strong>最寄り駅:</strong> ${result.propertyData.最寄り駅}</div>
                        <div><strong>間取り:</strong> ${result.propertyData.間取り}</div>
                    </div>
                    
                    <div class="flex gap-2">
                        <button onclick="copyScript('${this.escapeHtml(script)}')" 
                                class="px-4 py-2 bg-secondary text-white rounded hover:bg-blue-600 transition duration-200">
                            📋 コピー
                        </button>
                        <button onclick="downloadScript('${this.escapeHtml(script)}', '${result.propertyData.物件名 || 'property'}')" 
                                class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200">
                            💾 ダウンロード
                        </button>
                    </div>
                </div>
            `;
        }
        
        resultsContainer.appendChild(resultDiv);
        
        // スクロールして結果を表示
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    displayBatchSummary(results) {
        const successful = results.filter(r => !r.error).length;
        const failed = results.filter(r => r.error).length;
        const totalCost = results.reduce((sum, r) => sum + (r.cost || 0), 0);
        
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200';
        summaryDiv.innerHTML = `
            <h3 class="text-xl font-semibold text-blue-800 mb-4">📊 バッチ処理完了</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                    <div class="text-2xl font-bold text-green-600">${successful}</div>
                    <div class="text-sm text-gray-600">成功</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-red-600">${failed}</div>
                    <div class="text-sm text-gray-600">失敗</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-blue-600">${results.length}</div>
                    <div class="text-sm text-gray-600">総数</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-purple-600">$${totalCost.toFixed(6)}</div>
                    <div class="text-sm text-gray-600">総コスト</div>
                </div>
            </div>
            <div class="mt-4 flex gap-2">
                <button onclick="downloadAllScripts()" 
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
                    📥 全スクリプトダウンロード
                </button>
                <button onclick="exportResults()" 
                        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200">
                    📊 結果をJSON出力
                </button>
            </div>
        `;
        
        document.getElementById('results').appendChild(summaryDiv);
    }
    
    updateStats() {
        document.getElementById('totalGenerated').textContent = this.totalGenerated;
        document.getElementById('totalCost').textContent = `$${this.totalCost.toFixed(6)}`;
        document.getElementById('avgCost').textContent = this.totalGenerated > 0 
            ? `$${(this.totalCost / this.totalGenerated).toFixed(6)}` 
            : '$0.00';
        
        if (this.totalGenerated > 0) {
            document.getElementById('stats').classList.remove('hidden');
        }
    }
    
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file, 'UTF-8');
        });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    escapeHtml(text) {
        return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
    }
    
    downloadTemplate() {
        const template = '物件名,家賃,最寄り駅,間取り,築年数,特徴\n' +
                        'サンシャインマンション301号室,7.5万円,渋谷駅徒歩8分,1LDK（35㎡）,築5年,ペット可、オートロック、宅配ボックス\n' +
                        'グランドパレス202号室,6.8万円,新宿駅徒歩12分,1K（25㎡）,築3年,駅近、コンビニ徒歩1分、Wi-Fi完備';
        
        const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'property_template.csv';
        link.click();
    }
}

// グローバル関数
let generator;

window.onload = function() {
    generator = new PropertyScriptGenerator();
};

function saveApiKey() {
    generator.saveApiKey();
}

function generateSingleScript() {
    generator.generateSingleScript();
}

function generateBatchScripts() {
    generator.generateBatchScripts();
}

function downloadTemplate() {
    generator.downloadTemplate();
}

function copyScript(script) {
    navigator.clipboard.writeText(script.replace(/\\n/g, '\n')).then(() => {
        alert('スクリプトをクリップボードにコピーしました！');
    });
}

function downloadScript(script, propertyName) {
    const cleanScript = script.replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"');
    const blob = new Blob([cleanScript], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${propertyName}_script.txt`;
    link.click();
}

function downloadAllScripts() {
    if (generator.results.length === 0) {
        alert('ダウンロードできるスクリプトがありません');
        return;
    }
    
    let allScripts = '';
    generator.results.forEach((result, index) => {
        if (!result.error) {
            allScripts += `=== ${result.propertyData.物件名 || `物件${index + 1}`} ===\n`;
            allScripts += result.script + '\n\n';
        }
    });
    
    const blob = new Blob([allScripts], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `all_scripts_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
}

function exportResults() {
    if (generator.results.length === 0) {
        alert('エクスポートできる結果がありません');
        return;
    }
    
    const exportData = {
        generatedAt: new Date().toISOString(),
        totalGenerated: generator.totalGenerated,
        totalCost: generator.totalCost,
        results: generator.results
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `script_results_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
}

function clearAllResults() {
    if (confirm('すべての生成結果をクリアしますか？この操作は取り消せません。')) {
        generator.results = [];
        generator.totalGenerated = 0;
        generator.totalCost = 0;
        document.getElementById('results').innerHTML = '';
        document.getElementById('stats').classList.add('hidden');
        generator.updateStats();
    }
}