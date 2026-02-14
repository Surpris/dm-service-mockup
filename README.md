# 研究データマネジメント (RDM) システム モックアップ

![Status](https://img.shields.io/badge/Status-Phase%203%20Completed%20%2F%20Phase%204%20In%20Progress-blue?style=for-the-badge) ![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-green?style=for-the-badge) ![GraphQL](https://img.shields.io/badge/API-GraphQL-E10098?style=for-the-badge) ![React](https://img.shields.io/badge/Frontend-React%20%2B%20React%20Flow-61DAFB?style=for-the-badge)

---

## 🌟 プロジェクト概要

本プロジェクトは、研究データマネジメント（RDM）における「データ、人、プロジェクト」の複雑な関係性を管理・可視化するための次世代型プラットフォームのモックアップです。

従来のリレーショナルな管理（誰がどのデータを作ったか）に留まらず、**「ユーザー定義リレーションシップ」**を通じてデータ間の由来（Derivation）や依存関係を **ナレッジグラフ（Knowledge Graph）** として構築・可視化できる柔軟性を備えています。

## 🏗️ システム構造

本プロジェクトはモノレポ構成となっており、以下の主要コンポーネントで構成されています。
各ディレクトリの詳細な技術仕様や手順については、それぞれの README を参照してください。

- **[`backend/`](./backend/README.md)**: NestJS + GraphQL (Apollo) + Prisma + PostgreSQL による高機能APIサーバー
- **[`frontend/`](./frontend/README.md)**: React + TypeScript + Vite + React Flow によるSPA・可視化クライアント
- **`docs/`**: 詳細な開発仕様書・論理データモデル定義・実装レポート

## 🚀 現在の進捗状況 (Phase 3 完了 / Phase 4 進行中)

現在、バックエンドの基盤構築、グラフ可視化フロントエンドの実装が完了し、統合テストフェーズに移行しています。

### Backend Features

- **高度なID戦略**: 全エンティティでの UUID v7 (時系列ソート可能) の採用
- **透過的論理削除**: データベースレベルでの Soft Delete 機構の実装
- **コアCRUD**: Project, Dataset, Contributor, DMPMetadata の実装
- **グラフAPI**: ユーザー定義リレーションを含む統合グラフデータ抽出クエリ (`getGraphData`)
- **シーディング基盤**: 開発用初期データの自動投入スクリプト

### Frontend Features

- **テーブルビュー**: MUI を用いたサーバーサイドページネーション対応一覧画面
- **グラフ可視化**: React Flow + dagre/elkjs によるインタラクティブなナレッジグラフ
- **リレーション管理**: GUI上でのドラッグ＆ドロップによるユーザー定義リレーション作成
- **フィルタリング**: ノードタイプや属性によるグラフの動的フィルタリング

### QA / Testing

- **E2E (Graph)**: Playwright によるグラフ操作・リレーション作成の自動テスト実装済み
- **Unit/Integration**: Backend Service/Resolver のテスト実装進行中

## 🛠️ クイックスタート

以下の手順でシステム全体をローカル環境で起動できます。

### 1. データベースの起動

```bash
docker-compose up -d
```

### 2. バックエンドのセットアップ & 起動

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

バックエンドが起動すると、`http://localhost:3000/graphql` で Apollo Sandbox が利用可能です。

### 3. フロントエンドのセットアップ & 起動

別のターミナルを開いて実行してください。

```bash
cd frontend
npm install
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

## 📅 ロードマップ

1. **Phase 1 (完了)**: バックエンド基盤とコアCRUDの実装
2. **Phase 2 (完了)**: ユーザー定義リレーションの実装とグラフデータの統合抽出API
3. **Phase 3 (完了)**: React Flow を用いたフロントエンドでのグラフ可視化・操作UI
4. **Phase 4 (進行中)**: 統合テスト(E2E)の拡充とデータのガバナンス機能

---

詳細な技術仕様については [docs/specifications.md](./docs/specifications.md) を参照してください。
