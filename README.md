# 研究データマネジメント（RDM）システム (RDM System)

>[!NOTE]
> 本プロジェクトは、研究プロジェクト、データセット、貢献者（研究者等）の関係性を管理・可視化するWebアプリケーション開発のモックアッププロジェクトです。

## プロジェクト概要

本システムは、従来のリレーショナルなデータ管理に加え、**「ユーザー定義リレーションシップ」**と**「知識グラフ（Knowledge Graph）表示」**を導入することで、研究データの文脈（Context）を柔軟に記録・発見できる基盤を構築します。

## 技術スタック

| レイヤー | 技術選定 | 役割 |
| --- | --- | --- |
| **Frontend** | React, TypeScript, Vite | SPA基盤 |
| **UI Framework** | Material-UI (MUI) | ベースUIコンポーネント |
| **Visualization** | React Flow (+ dagre/elkjs) | 知識グラフの描画・操作 |
| **Backend** | Nest.js (TypeScript) | APIサーバー |
| **API Protocol** | GraphQL (Code-first) | フロントエンド通信 |
| **Database** | PostgreSQL + Prisma | データ永続化・操作 |
| **ID Strategy** | UUID v7 | 時系列ソート可能なID |

## 主な機能

1. **データ管理 (CRUD)**
    * システム定義エンティティ（Project, Dataset, Contributor）の管理
    * UUID v7 による一意なID管理
    * 論理削除の実装
    * **User-Defined Relations**: 任意のエンティティ間にユーザーが独自の関係性を定義可能

2. **テーブルビュー (List View)**
    * MUI DataGrid を用いた一覧表示
    * 高度な検索・フィルタリング・ページネーション

3. **ナレッジグラフビュー (Graph View)**
    * React Flow を用いたデータ関係性の可視化
    * ノード（エンティティ）とエッジ（関係性）のインタラクティブな操作
    * フィルタリング機能（エンティティタイプ、リレーションタイプ等）

## データモデル構造

* **System Defined Entities**: 厳密に管理される基本エンティティ（Project, Dataset, Contributor）
* **User Defined Relationships**: 柔軟に追加可能なエンティティ間の関係性

## 開発ロードマップ

* **Phase 1**: 基盤構築とCore CRUD
* **Phase 2**: ユーザー定義リレーションとグラフAPIの実装
* **Phase 3**: ナレッジグラフ可視化（React Flow導入）
* **Phase 4**: 統合テストとガバナンス機能

## ドキュメント

詳細な仕様については [docs/specifications.md](./docs/specifications.md) を参照してください。
