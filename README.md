# AI活用レベル診断LP

企業向けの「御社のAI活用レベル診断」LPです。HTML/CSS/JavaScriptのみで動作し、VercelのStatic Siteとして公開できます。

## ファイル構成

```text
.
├── index.html       # LP本体
├── style.css        # デザイン、レスポンシブ対応
├── script.js        # 診断ロジック、レーダーチャート、Googleフォーム送信
├── vercel.json      # Vercel公開設定
├── .gitignore       # GitHubに含めないファイル
├── .vercelignore    # Vercelにアップロードしないファイル
└── README.md        # 公開手順
```

`outputs/` と `work/` は作業・確認用のフォルダです。GitHub/Vercelには含めません。

## 動作概要

- 16問の診断フォームに回答すると、総合スコア、8項目スコア、診断タイプ、現在の課題を表示します。
- 診断フォーム送信時点で、診断結果をGoogleフォームに送信します。
- 無料相談フォームを送信すると、連絡先と診断結果をGoogleフォームに送信します。
- レーダーチャートはChart.jsを利用します。CDNが読み込めない場合は、canvasの簡易描画にフォールバックします。

## ローカル確認

```bash
python3 -m http.server 4173
```

ブラウザで以下を開きます。

```text
http://localhost:4173/
```

JavaScriptの構文チェック:

```bash
node --check script.js
```

## GitHubにアップロードする手順

1. GitHubで新しいリポジトリを作成します。
   - 例: `ai-diagnosis-lp`
   - Public / Private はどちらでも構いません。
2. このフォルダ直下のファイルをGitHubにアップロードします。
   - `index.html`
   - `style.css`
   - `script.js`
   - `vercel.json`
   - `.gitignore`
   - `.vercelignore`
   - `README.md`
3. `outputs/` と `work/` はアップロードしません。

コマンドでアップロードする場合:

```bash
git init
git add index.html style.css script.js vercel.json .gitignore .vercelignore README.md
git commit -m "Add AI diagnosis landing page"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/ai-diagnosis-lp.git
git push -u origin main
```

`YOUR_NAME` とリポジトリ名は、実際のGitHubアカウントに合わせて変更してください。

## Vercelで公開する手順

1. [Vercel](https://vercel.com/) にログインします。
2. `Add New...` → `Project` をクリックします。
3. GitHub連携を行い、作成したリポジトリを選択します。
4. Framework Preset は `Other` または自動検出のままで問題ありません。
5. Build Command は空欄で構いません。
6. Output Directory も空欄で構いません。
7. `Deploy` をクリックします。

デプロイ後、以下のようなURLが発行されます。

```text
https://your-project-name.vercel.app/
```

## 公開後に確認すること

- ファーストビューが表示される
- 16問の診断に回答できる
- 診断結果、8項目スコア、レーダーチャートが表示される
- 診断フォーム送信時にGoogleフォームへ回答が入る
- 無料相談フォーム送信時に連絡先つきでGoogleフォームへ回答が入る
- Googleフォームの回答がスプレッドシートに保存される

## Googleフォーム連携を変更する場合

`script.js` の `googleFormConfig` を編集します。

```js
const googleFormConfig = {
  actionUrl: "GoogleフォームのformResponse URL",
  entries: {
    company: "entry.xxxxx",
    name: "entry.xxxxx"
  }
};
```

Googleフォームの項目を変更した場合は、`entry.xxxxx` のIDも変わることがあります。
