# テスト実装完了報告書

**作成日:** 2026-02-01
**対象:** Backend Unit Tests (Prisma Extension, Services, Resolvers)

## 概要

`docs/reports/listup-test-report.md` に基づき、優先度「高 (Must Implement)」と定義されたバックエンドのユニットテスト実装を完了しました。
これにより、基盤機能（UUID v7, 論理削除）および主要な業務ロジックの品質が CI レベルで保証される状態となりました。

## 実装範囲

### 1. Prisma Extension (Infrastructure Layer)

`backend/src/prisma/prisma.extension.spec.ts`

- **UUID v7 生成**: `create`, `createMany` 時に ID が自動生成されることを検証。
- **論理削除 (Soft Delete)**: `delete` / `deleteMany` が `update` / `updateMany` に変換され、`deletedAt` が更新されることを検証。
- **読み取りフィルタ**: `findUnique`, `findFirst`, `findMany` において、`deletedAt: null` が自動適用されることを検証。

### 2. Core Services (Business Logic Layer)

- `ProjectService`, `DatasetService`, `ContributorService`
- Prisma Mock を使用し、CRUD 操作が正しく Prisma Client に委譲されていることを検証。
- 特に `remove` 操作が物理削除ではなく、適切な更新処理（論理削除）を呼び出している点を確認。

### 3. GraphQL Resolvers (Interface Layer)

- `ProjectResolver`, `DatasetResolver`, `ContributorResolver`
- GraphQL 入力 (DTO) が Service に正しく渡され、結果が返却されることを検証。

## 発生した課題と対策

実装過程で発生した主な課題と、それに対する技術的なアプローチは以下の通りです。

### 1. Lint エラーへの対応 (TypeScript / ESLint)

厳格な Lint ルール (`@typescript-eslint`) により、テストコード内でいくつかのエラーが発生しました。

- **`unsafe-assignment` / `unsafe-member-access`**:
  - **課題**: Jest の Mock オブジェクトや、Prisma Extension の動的な引数 (`any` 型) を扱う箇所で発生。
  - **対策**:
    - 可能な限り型定義 (`ExtensionConfig` interface 等) を追加して対応。
    - Mock の内部構造や動的なプロパティアクセスなど、型安全性の保証が困難かつテストコードとして許容できる箇所については、局所的に `// eslint-disable-next-line` を適用し、コメントで意図を明示。

- **`unbound-method`**:
  - **課題**: Service のメソッドを `expect(service.create).toHaveBeenCalled...` のように参照した際に発生。
  - **対策**: テスト対象のメソッド呼び出しと検証において、コンテキスト (`this`) が安全であることを確認しつつ実装。

### 2. Prisma Extension の Mock 化

- **課題**: `client.$extends` を使用する Prisma Extension は構造が複雑で、単純な Mock ではミドルウェアの動作を再現しにくい。
- **対策**: `prisma.extension.spec.ts` において、ミドルウェア関数自体を取り出して単体テストを行う構成を採用。`$extends` が返すクライアント全体ではなく、定義された `query` ミドルウェアロジックそのものを検証することで、カバレッジを確保しました。

## 結果

- **テスト実行結果**: 全 **50 ケース** Pass (8 Test Suites)
- **Lint**: エラーなし (`npm run lint` Pass)

これにより、次フェーズ（Entity 間のリレーション実装など）に進むための堅牢な土台が整いました。

## 追記 (2026-02-02): Integration / E2E Tests (API Layer)

`backend/test` 配下における E2E テストの実装を行いました。

### 実装範囲

#### 1. Project Entity E2E Test (`backend/test/projects.e2e-spec.ts`)

- **CRUD Operations**: GraphQL API を介した `create`, `read`, `update`, `delete` の一連のフローを検証。
- **UUID v7 検証**: 生成された ID が UUID 形式であることを確認。
- **論理削除の検証**:
  - API レベル: 削除後に Query を投げると `null` が返ること。
  - DB レベル: 直接 `PrismaClient` で DB を参照し、レコードが存在しつつ `deletedAt` が更新されていること。

### 発生した課題と対策

#### 1. `uuid` ライブラリの ESM import エラー

- **課題**: `uuid` v11 系が ESM only となり、Jest (CommonJS 環境) で `createExtendedPrismaClient` 内の `import { v7 as uuidv7 } from 'uuid'` が `SyntaxError: Unexpected token 'export'` を引き起こした。
- **対策**: `backend/test/jest-e2e.json` に `transformIgnorePatterns` を設定し、`node_modules/uuid` をトランスパイル対象に含めることで解決。

```json
  "transformIgnorePatterns": [
    "/node_modules/(?!uuid)/"
  ]
```

#### 2. Test Teardown 時の Resource Leak 警告

- **課題**: テスト実行後に `A worker process has failed to exit gracefully` という警告が発生。
- **原因**: 既存の `test/app.e2e-spec.ts` において、`beforeEach` で `createNestApplication()` しているものの、アプリケーションの終了処理 (`app.close()`) が行われていなかった。
- **対策**: `test/app.e2e-spec.ts` を以下の通り修正。
  - `beforeEach` -> `beforeAll` に変更（テスト高速化も兼ねる）。
  - `afterAll` を追加し、`await app.close()` を明示的に実行。

### 結果

- **E2E テスト実行結果**: 全 **2 Test Suites** Pass (`app.e2e-spec.ts`, `projects.e2e-spec.ts`)
