# アーキテクチャ概要

## 目的

このドキュメントは、研究データマネジメント(RDM)システムモックアップの全体構造を説明する。詳細な機能要件は `docs/specifications.md`、データモデル詳細は `docs/data-model.md`、GraphQL API は `docs/graphql-api.md` を参照する。

## システム概要

本プロジェクトは、研究プロジェクト、データセット、貢献者の関係を管理し、システム定義リレーションとユーザー定義リレーションを統合してナレッジグラフとして可視化する Web アプリケーションである。

リポジトリはモノレポ構成で、主要なサブシステムは次の通り。

| パス | 役割 |
| --- | --- |
| `backend/` | NestJS + GraphQL + Prisma による API サーバー |
| `frontend/` | React + Vite + MUI + @xyflow/react による SPA |
| `docs/` | 仕様書、論理モデル、計画、レポート、設計ドキュメント |
| `docker-compose.yml` | 開発用 PostgreSQL の起動定義 |

## 技術スタック

| レイヤー | 技術 |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| UI | MUI, MUI X DataGrid |
| Graph visualization | @xyflow/react, dagre, elkjs |
| API client | Apollo Client |
| Backend | NestJS 11, TypeScript |
| API | GraphQL, Apollo Server |
| ORM | Prisma 5.22.0 |
| Database | PostgreSQL 16 |
| Test | Jest, Vitest, Playwright |

## 実行時構成

```text
Browser
  |
  | GraphQL over HTTP
  v
Frontend SPA (localhost:5173)
  |
  | Apollo Client
  v
Backend API (localhost:3000/graphql)
  |
  | Prisma Client Extension
  v
PostgreSQL (localhost:5432)
```

開発時は `docker-compose.yml` で PostgreSQL を起動し、バックエンドとフロントエンドを別プロセスで起動する。

## 主要な境界

### Frontend と Backend

フロントエンドは `frontend/src/graphql/queries.ts` に定義された GraphQL query/mutation を Apollo Client 経由で実行する。現在は GraphQL Code Generator による自動生成ではなく、一部の型を `frontend/src/features/graph/utils/mapper.ts` などでローカル定義している。

### Backend と Database

バックエンドは Prisma を通じて PostgreSQL にアクセスする。直接 `PrismaClient` を使わず、`PrismaService` が提供する拡張済み Prisma Client を使う方針である。拡張では UUID v7 の自動付与と論理削除を扱う。

### Graph 表示

Graph API は複数テーブルから Project, Dataset, Contributor, ProjectContributor, UserDefinedRelationship を読み出し、React Flow が扱いやすい `nodes` と `edges` に変換して返す。フロントエンドでは `useGraphData` が API を呼び、`mapGraphDataToReactFlow` が React Flow 用の `Node[]` と `Edge[]` に変換する。

## 現在の実装状況

`README.md` と実装ファイルから、Phase 1 から Phase 3 は概ね完了し、Phase 4 の統合テストとガバナンス機能が進行中である。

実装済みの主な機能:

- Project, Dataset, Contributor, DMPMetadata の CRUD
- ProjectContributor によるプロジェクト参加者の管理
- UserDefinedRelationship による任意リレーションの登録
- GraphQL の `graph(filter: String): GraphData`
- React Flow によるナレッジグラフ表示
- ノード種別フィルタ、ノード詳細 Drawer、リレーション作成 Dialog
- UUID v7 自動生成と論理削除
- Backend Jest テスト、Backend E2E、Frontend Vitest、Frontend Playwright E2E

## 注意点

- Prisma schema の `@default(uuid())` はフォールバックであり、実際には Prisma Client Extension が UUID v7 を生成する。
- `graph(filter: String)` の引数は存在するが、現行 `GraphService` では未使用である。
- GraphQL の `properties` と `data` は文字列として公開され、JSON は呼び出し側で parse/stringify している。
- README には Clean Architecture のバッジがあるが、実装上は NestJS の module/service/resolver 構成であり、厳密な Clean Architecture レイヤー分離までは確認できない。
