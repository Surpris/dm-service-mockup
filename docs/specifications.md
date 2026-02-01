# 研究データマネジメント（RDM）システム 開発仕様・計画書

## 1. プロジェクト概要

本プロジェクトは、研究プロジェクト、データセット、貢献者（研究者等）の関係性を管理・可視化するWebアプリケーションを開発することを目的とします。
従来のリレーショナルな管理に加え、**「ユーザー定義リレーションシップ」**と**「知識グラフ（Knowledge Graph）表示」**を導入することで、研究データの文脈（Context）を柔軟に記録・発見できる基盤を構築します。

## 2. 技術スタック・アーキテクチャ

| レイヤー          | 技術選定                              | 役割・備考                                         |
| ----------------- | ------------------------------------- | -------------------------------------------------- |
| **Frontend**      | **React** + **TypeScript** + **Vite** | SPA基盤                                            |
| **UI Framework**  | **Material-UI (MUI)**                 | ベースUIコンポーネント                             |
| **Visualization** | **React Flow** (+ dagre/elkjs)        | 知識グラフの描画・操作・自動レイアウト             |
| **Backend**       | **Nest.js** (TypeScript)              | APIサーバー、ビジネスロジック                      |
| **API Protocol**  | **GraphQL** (Code-first)              | フロントエンドとの型安全な通信                     |
| **ORM**           | **Prisma**                            | DB操作、マイグレーション、論理削除制御             |
| **Database**      | **PostgreSQL**                        | データ永続化 (JSONB活用)                           |
| **ID Strategy**   | **UUID v7**                           | 全エンティティで統一。時系列ソート可能なUUIDを採用 |

---

## 3. データモデル仕様 (Logical & Physical)

全てのエンティティの主キー（PK）を `String` (UUID v7) に統一し、システム定義（System）とユーザー定義（User-Defined）の「二階建て構造」を採用します。

### 3.1. Prisma Schema (Draft)

```prisma
// schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"] // UUID v7生成用（必要に応じて）
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- 1. System Defined Entities (厳密な管理) ---

model Project {
  id            String   @id @default(uuid()) // UUID v7
  projectNumber String   @unique // 研究課題番号
  description   String?

  // Relations
  metadata      DMPMetadata?
  datasets      Dataset[]
  contributors  ProjectContributor[]

  // Common
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime? // 論理削除用
}

model DMPMetadata {
  id              String   @id @default(uuid())
  createdDate     DateTime
  lastUpdatedDate DateTime

  projectId       String   @unique
  project         Project  @relation(fields: [projectId], references: [id])
}

model Contributor {
  id            String   @id @default(uuid())
  contributorId String   @unique // 計画書内通し番号
  name          String

  // Relations
  projects      ProjectContributor[]
  managedData   Dataset[] @relation("ManagedBy")
  collectedData Dataset[] @relation("CollectedBy")

  deletedAt     DateTime?
}

// 中間テーブル（役割を持つため明示的に定義）
model ProjectContributor {
  id            String      @id @default(uuid())
  projectId     String
  project       Project     @relation(fields: [projectId], references: [id])
  contributorId String
  contributor   Contributor @relation(fields: [contributorId], references: [id])
  role          ProjectRole // Enum: PI, Co-Investigator, etc.
}

model Dataset {
  id            String   @id @default(uuid())
  datasetNo     Int      // 表示用番号
  title         String
  accessPolicy  AccessPolicy // Enum: Public, Shared, Closed

  // System Relations
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id])

  collectedById String
  collectedBy   Contributor @relation("CollectedBy", fields: [collectedById], references: [id])
  collectedAt   DateTime?

  managedById   String?
  managedBy     Contributor? @relation("ManagedBy", fields: [managedById], references: [id])
  managedFrom   DateTime?
  managedTo     DateTime?

  deletedAt     DateTime?
}

// --- 2. User Defined Relationships (柔軟な管理) ---

model UserDefinedRelationship {
  id               String   @id @default(uuid())
  relationshipType String   // ex: "DERIVED_FROM", "FUNDED_BY"

  // 全てUUID(String)なので統一的に扱える
  sourceId         String
  sourceType       EntityType // Enum: Project, Dataset, Contributor

  targetId         String
  targetType       EntityType

  properties       Json?    // 属性情報

  createdAt        DateTime @default(now())
  createdBy        String   // User ID
  deletedAt        DateTime?

  @@index([sourceId, sourceType])
  @@index([targetId, targetType])
}

enum ProjectRole {
  PRINCIPAL_INVESTIGATOR
  CO_INVESTIGATOR
  DATA_COLLECTOR
  DATA_MANAGER
}

enum AccessPolicy {
  PUBLIC
  SHARED
  CLOSED
}

enum EntityType {
  PROJECT
  DATASET
  CONTRIBUTOR
}

```

---

## 4. 機能要件 (Functional Requirements)

### 4.1. データ管理 (CRUD)

- **Create/Update:** 各エンティティの作成・更新。UUID v7 の自動生成。
- **Delete (Logical):** ユーザー操作による削除は `deletedAt` の更新のみとする。Prisma Middleware または Extension を実装し、通常の `find` クエリからは自動的に除外されるようにする。
- **User-Defined Relations:** 任意の2つのエンティティ（ID指定）に対し、リレーション名と属性（JSON）を指定してリンクを作成する機能。

### 4.2. テーブルビュー (List View)

- **技術:** MUI `DataGrid` (Server-side pagination & filtering)
- **機能:**
- エンティティごとの一覧表示。
- 各カラム（属性）での検索・フィルタリング。
- ページネーション。

### 4.3. ナレッジグラフビュー (Graph View)

- **技術:** React Flow + Custom Nodes/Edges
- **Backend (GraphQL):**
- `graph(filter: GraphFilterInput): GraphData` クエリを提供。
- System Defined Relation（Project-Dataset間など）と User Defined Relation を統合し、統一された `Node[]` と `Edge[]` を返す。

- **Frontend:**
- **可視化:** ノード（エンティティ）とエッジ（関係性）の描画。
- **フィルタリング:**
- エンティティタイプ（例: データセットのみ表示）
- リレーションタイプ（例: "DERIVED_FROM" のみ表示）
- 属性値（例: "2024年以降"）

- **操作:** ノードクリックでの詳細情報表示（Drawer/Modal）。

---

## 5. 開発計画 (Development Plan)

開発プロセスは **Wモデル（W-Model）** を意識し、仕様定義とテスト設計を並行して進めます。

### Phase 1: 基盤構築とCore CRUD (2週間)

- **Goal:** システム定義エンティティの登録・閲覧ができる。
- **Tasks:**
- [Backend] Nest.js + Prisma + PostgreSQL 環境構築 (Docker Compose)。
- [Backend] UUID v7 生成ロジックと論理削除 Middleware の実装。
- [Backend] Core Entities (Project, Dataset, Contributor) の GraphQL Schema 定義 & CRUD 実装。
- [Frontend] React + Vite + MUI 環境構築。
- [Frontend] テーブルビューによる一覧・検索画面の実装。

### Phase 2: ユーザー定義リレーションとグラフAPI (2週間)

- **Goal:** ユーザーが自由にリレーションを追加でき、APIがグラフ構造を返却できる。
- **Tasks:**
- [Backend] `UserDefinedRelationship` モデルの実装。
- [Backend] グラフデータ生成ロジックの実装（System/User Relationの統合）。
- [Backend] グラフ検索用クエリ（`getGraphData`）の実装。

### Phase 3: ナレッジグラフ可視化 (2〜3週間)

- **Goal:** React Flow を用いてデータを可視化・操作できる。
- **Tasks:**
- [Frontend] React Flow の導入とカスタムノード（ProjectNode, DatasetNode）の作成。
- [Frontend] 自動レイアウト機能の実装（dagre または elkjs を利用してノードの重なりを防ぐ）。
- [Frontend] グラフ上のフィルタリング UI の実装。

### Phase 4: 統合テストとガバナンス機能 (1〜2週間)

- **Goal:** E2Eでの動作確認と、将来的な運用のための準備。
- **Tasks:**
- [QA] シナリオテスト（データの作成 → 独自リレーション設定 → グラフ確認 → 削除）。
- [Ops] `UserDefinedRelationship` から System Relation への昇格（Promotion）用SQL/スクリプトのプロトタイプ作成。
