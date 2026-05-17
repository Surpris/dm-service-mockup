# テスト戦略

## 概要

本プロジェクトはバックエンド、フロントエンド、E2E のテストを持つ。過去の `docs/reports/implementation-tests.md`、`docs/reports/implementation-issue-38-report.md`、`docs/reports/implementation-issue-42-report.md` から、テスト拡充は Phase 4 の主要テーマである。

## テスト種別

| 領域 | 技術 | 主な場所 |
| --- | --- | --- |
| Backend unit | Jest, ts-jest | `backend/src/**/*.spec.ts` |
| Backend E2E | Jest, supertest | `backend/test/*.e2e-spec.ts` |
| Frontend unit/integration | Vitest, Testing Library | `frontend/src/**/*.test.tsx` |
| Frontend E2E | Playwright | `frontend/e2e/*.spec.ts` |

## Backend unit tests

対象:

- Prisma Extension
- Core Service
- GraphQL Resolver
- GraphService
- UserDefinedRelationshipService
- ProjectContributorResolver

重要な確認観点:

- UUID v7 が create/createMany 時に付与される
- delete/deleteMany が物理削除ではなく論理削除になる
- find 系が削除済みデータを除外する
- Service が Prisma Client に正しい引数を渡す
- Resolver が DTO を Service に正しく委譲する
- GraphService が system/user relation を GraphData に変換する

実行コマンド:

```bash
cd backend
npm run test
npm run test:ci
```

## Backend E2E tests

対象:

- `backend/test/app.e2e-spec.ts`
- `backend/test/projects.e2e-spec.ts`
- `backend/test/scenario.e2e-spec.ts`
- `backend/test/error-handling.e2e-spec.ts`

重要な確認観点:

- GraphQL API 経由の CRUD
- UUID 形式
- 論理削除後に API から取得できないこと
- DB には `deletedAt` 付きで残ること
- エラー処理の基本挙動

実行コマンド:

```bash
cd backend
npm run test:e2e
npm run test:e2e:ci
```

## Frontend unit/integration tests

対象:

- `frontend/src/App.test.tsx`
- `frontend/src/pages/ProjectList.test.tsx`
- `frontend/src/pages/DatasetList.test.tsx`
- `frontend/src/pages/ContributorList.test.tsx`
- Graph utils の spec

重要な確認観点:

- ページが query 結果を表示できる
- ローディング、エラー、空状態
- Graph mapper が backend data を React Flow 形式へ変換する
- layout utility がノード配置を返す

実行コマンド:

```bash
cd frontend
npm run test
npm run type-check
```

## Frontend E2E tests

対象:

- `frontend/e2e/graph-scenarios.spec.ts`
- `frontend/e2e/project-view.spec.ts`
- `frontend/e2e/pages/*`

重要な確認観点:

- アプリケーション起動と基本遷移
- プロジェクト一覧から詳細への閲覧フロー
- グラフページ表示
- ノード種別フィルタ
- ドラッグアンドドロップによるリレーション作成

実行コマンド:

```bash
cd frontend
npm run test:e2e
```

## CI 向け確認コマンド

変更内容に応じて次を実行する。

Backend 変更:

```bash
cd backend
npm run lint
npm run type-check
npm run test:ci
npm run test:e2e:ci
```

Frontend 変更:

```bash
cd frontend
npm run lint
npm run test
npm run test:e2e
```

## 既知の注意点

- Backend Jest は `NODE_OPTIONS='--localstorage-file=/tmp/jest-localstorage --no-warnings'` を使う。
- uuid 系ライブラリの ESM 互換問題が過去にあり、Jest 設定で transform 対象を調整している。
- Playwright E2E はバックエンド、フロントエンド、DB、seed data の状態に依存する。
- Issue 38 の時点では POM が未整備だったが、現在は `frontend/e2e/pages/` が存在するため、今後の E2E 追加は Page Object を優先する。

## 今後追加したいテスト

- `graph(filter: String)` の仕様確定後のフィルタテスト
- UserDefinedRelationship の不正 source/target に対する E2E
- ProjectContributor の論理削除と重複防止
- Promotion prototype の自動テスト
- Graph 作成 mutation 失敗時のフロントエンド表示
- Project/Dataset/Contributor 一覧の pagination/filter/sort 導入時テスト
