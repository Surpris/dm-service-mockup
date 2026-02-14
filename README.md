# 研究データマネジメント (RDM) システム モックアップ

![Status](https://img.shields.io/badge/Status-Phase%201%20Completed-success?style=for-the-badge) ![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-blue?style=for-the-badge) ![GraphQL](https://img.shields.io/badge/API-GraphQL-E10098?style=for-the-badge)

---

## 🌟 プロジェクト概要

本プロジェクトは、研究データマネジメント（RDM）における「データ、人、プロジェクト」の複雑な関係性を管理・可視化するための次世代型プラットフォームのモックアップです。

従来のリレーショナルな管理（誰がどのデータを作ったか）に留まらず、**「ユーザー定義リレーションシップ」**を通じてデータ間の由来（Derivation）や依存関係をナレッジグラフとして構築できる柔軟性を備えています。

## 🏗️ システム構造

本プロジェクトはモノレポ構成となっており、以下の主要コンポーネントで構成されています。

- **`backend/`**: NestJS + GraphQL (Apollo) + Prisma による高機能APIサーバー
- **`docs/`**: 詳細な開発仕様書・論理データモデル定義

## 🚀 現在の進捗状況 (Phase 1 完了)

現在、バックエンドの基盤構築およびコア機能の実装が完了しています。

- [x] **高度なID戦略**: 全エンティティでの UUID v7 (時系列ソート可能) の採用
- [x] **透過的論理削除**: データベースレベルでの Soft Delete 機構の実装
- [x] **コアCRUD**: Project, Dataset, Contributor, DMPMetadata の実装
- [x] **システムリレーション**: エンティティ間の厳密な関係性定義
- [x] **シーディング基盤**: 開発用初期データの自動投入スクリプト

## 🛠️ クイックスタート

### 1. データベースの起動

```bash
docker-compose up -d
```

### 2. バックエンドのセットアップ

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

バックエンドが起動すると、`http://localhost:3000/graphql` で Apollo Sandbox を利用可能です。

## 📅 ロードマップ

1. **Phase 1 (完了)**: バックエンド基盤とコアCRUDの実装
2. **Phase 2 (完了)**: ユーザー定義リレーションの実装とグラフデータの統合抽出API
3. **Phase 3（完了）**: @xyflow/react (React Flow) を用いたフロントエンドでのグラフ可視化
4. **Phase 4（進行中）**: 統合テストとデータのガバナンス（関係性の昇格機能等）

---

詳細な技術仕様については [docs/specifications.md](./docs/specifications.md) を参照してください。
