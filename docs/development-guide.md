# 開発ガイド

## 前提

このプロジェクトはモノレポ構成で、バックエンド、フロントエンド、PostgreSQL を個別に起動する。

主要ディレクトリ:

| パス | 内容 |
| --- | --- |
| `backend/` | NestJS API |
| `frontend/` | React SPA |
| `docs/` | 仕様、設計、計画、レポート |
| `backend/prisma/` | Prisma schema, migration, seed |

## 初回セットアップ

```bash
docker-compose up -d
```

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
```

```bash
cd frontend
npm install
```

## 開発サーバー起動

Backend:

```bash
cd backend
npm run start:dev
```

GraphQL endpoint:

```text
http://localhost:3000/graphql
```

Frontend:

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## よく触るファイル

Backend:

| 目的 | ファイル |
| --- | --- |
| DB model 変更 | `backend/prisma/schema.prisma` |
| Prisma 共通挙動 | `backend/src/prisma/prisma.extension.ts` |
| GraphQL schema 確認 | `backend/src/schema.gql` |
| Project | `backend/src/project/*` |
| Dataset | `backend/src/dataset/*` |
| Contributor | `backend/src/contributor/*` |
| User relation | `backend/src/user-defined-relationship/*` |
| Graph API | `backend/src/graph/*` |
| Seed | `backend/prisma/seed.ts` |

Frontend:

| 目的 | ファイル |
| --- | --- |
| ルーティング | `frontend/src/App.tsx` |
| GraphQL query | `frontend/src/graphql/queries.ts` |
| Apollo Client | `frontend/src/graphql/client.ts` |
| 一覧画面 | `frontend/src/pages/*List.tsx` |
| Project 詳細 | `frontend/src/pages/ProjectDetail.tsx` |
| Graph 画面 | `frontend/src/pages/GraphPage.tsx` |
| Graph 機能 | `frontend/src/features/graph/*` |

## 変更時の基本手順

### DB model を変える場合

1. `backend/prisma/schema.prisma` を変更する
2. migration を作る
3. 関連 entity/dto/resolver/service を更新する
4. `backend/src/schema.gql` の生成結果を確認する
5. seed とテストを更新する

```bash
cd backend
npx prisma migrate dev
npm run test
```

### GraphQL API を変える場合

1. Backend DTO/entity/resolver/service を更新する
2. `backend/src/schema.gql` の差分を確認する
3. `frontend/src/graphql/queries.ts` を更新する
4. フロントエンドの利用箇所と型を更新する
5. Backend/Frontend のテストを更新する

### Graph 表示を変える場合

1. Backend `GraphService` の node/edge 生成を確認する
2. `GraphNode.data` / `GraphEdge.data` の JSON 文字列仕様を決める
3. Frontend `mapper.ts` を更新する
4. custom node、layout、filter、drawer を必要に応じて更新する
5. mapper/layout の unit test と Playwright E2E を更新する

## 確認コマンド

Backend:

```bash
cd backend
npm run lint
npm run type-check
npm run test
npm run test:e2e
```

Frontend:

```bash
cd frontend
npm run lint
npm run test
npm run test:e2e
```

## ドキュメント更新方針

仕様変更や設計判断が入った場合は、実装と同じ PR/作業単位で該当ドキュメントを更新する。

| 変更内容 | 更新候補 |
| --- | --- |
| 機能要件 | `docs/specifications.md` |
| 全体構成 | `docs/architecture.md` |
| Backend 構造 | `docs/backend-design.md` |
| Frontend 構造 | `docs/frontend-design.md` |
| DB model | `docs/data-model.md` |
| GraphQL schema | `docs/graphql-api.md` |
| テスト方針 | `docs/testing-strategy.md` |

## 注意点

- `docs/plans/` と `docs/reports/` は履歴として有用だが文量が多いため、現状把握では見出し、結論、対象ファイルを優先して読む。
- `backend/src/schema.gql` は生成物なので、直接編集しない。
- 論理削除対象モデルの追加や削除は、Prisma schema だけでなく `prisma.extension.ts` と既存 query の `deletedAt: null` も確認する。
- GraphQL の `properties` は schema 上 String、Prisma 上 Json であり、型のズレに注意する。
