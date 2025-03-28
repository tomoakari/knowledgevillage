# Knowledge Village 🏡

GitHubリポジトリの情報をGemma3を使って質問・回答できるウェブアプリケーションです。

## 機能

- 特定のGitHubリポジトリ（tomoakari/punihoppe）の内容を取得
- ユーザーの質問に対して、取得したリポジトリ情報に基づいてGemma3 AIが回答
- Secret Managerを使用した安全な認証情報の管理
- SvelteKitとTailwind CSSによるモダンなUI

## アーキテクチャ

- **フロントエンド**: SvelteKit, Tailwind CSS
- **バックエンド**: SvelteKit (サーバーサイド機能)
- **AI**: Google Gemma3
- **リポジトリ情報取得**: GitHub API (Octokit)
- **シークレット管理**: Google Cloud Secret Manager
- **デプロイ**: Google Cloud Run

## セットアップと実行

### 必要な環境変数

Secret Managerに以下のシークレットを設定する必要があります：

- `GITHUB_TOKEN`: GitHubの個人アクセストークン
- `GEMMA_API_KEY`: Google Gemma APIキー

### ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルドとデプロイ

```bash
# ビルド
npm run build

# プレビュー
npm run preview
```

## デプロイ

このアプリケーションはGitHubリポジトリに接続されたCloud Buildを使用して、Google Cloud Runに自動デプロイされます。