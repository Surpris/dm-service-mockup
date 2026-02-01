# 前期実装レポート: UUID v7対応と論理削除 (Phase 1)

## 1. 概要

Phase 1の要件である「UUID v7の生成」および「論理削除（Logical Deletion）」の実装を行いました。
これにより、時系列順序性を持つIDによるパフォーマンス向上と、誤操作時の復元可能性を担保するデータ管理基盤が構築されました。

## 2. 実装詳細

### 2.1. UUID v7対応

- **採用技術:** `uuid` ライブラリ (v11.0.5)
- **実装方法:** Prisma Client Extension (`$extends`)
- **動作:**
  - `Project`, `Dataset`, `Contributor` 等のすべてのモデルについて、レコード作成時 (`create`, `createMany`) に `id` が指定されていない場合、アプリケーション側で `uuid.v7()` を生成して付与します。
  - Prisma Schemaの `@default(uuid())` はフォールバックとして残していますが、実質的にはアプリケーション側で生成されたUUID v7が優先されます。

### 2.2. 論理削除 (Soft Delete)

- **採用技術:** Prisma Client Extension (`$extends`)
- **対象モデル:** `Project`, `Contributor`, `Dataset`, `UserDefinedRelationship`
- **実装動作:**
  - **削除操作 (`delete`, `deleteMany`):** 実際の `DELETE` クエリを発行せず、`update` クエリに置換して `deletedAt: new Date()` を設定します。
  - **読込操作 (`findUnique`, `findFirst`, `findMany`):** `where`句に自動的に `{ deletedAt: null }` を追加し、論理削除されたレコードを除外します。
    - **Note:** `findUnique` については一意制約の都合上、クエリ発行後に結果を確認し、`deletedAt` が存在する場合は `null` を返すロジックとしています。

### 2.3. ファイル構成

- `backend/src/prisma/prisma.extension.ts`: 拡張ロジックの定義
- `backend/src/prisma/prisma.service.ts`: 拡張されたPrisma Clientを提供するService
- `backend/src/debug/test-uuid-soft-delete.ts`: 検証用スクリプト

## 3. 発生した技術的課題と解決策

### 3.1. Prisma v7系における環境不安定

#### 課題

当初、最新の `Prisma v7.3.0` を使用して開発を進めていましたが、自動生成されたクライアントの初期化時に `PrismaClientInitializationError` が頻発しました。
具体的には、`pnpm` や `docker` 環境下ではなくローカルの `npm` 環境において、`engineType` の設定（`library` vs `binary`）や `prisma.config.ts` の読み込みに関する挙動が安定せず、`datasources` オプションを渡しても認識されない等の問題が発生しました。

#### 対策

開発の安定性と確実性を優先し、LTS（Long Term Support）的に安定している **Prisma v5.22.0** へダウングレードを行いました。
これにより、Schema定義の `datasource` ブロックの挙動が期待通りとなり、拡張機能も正常に動作することを確認しました。

### 3.2. スキーマ定義の修正

Prisma v5への移行に伴い、`schema.prisma` の `datasource db` ブロックにおいて、環境変数読み込みのための `url = env("DATABASE_URL")` の記述が必須であるため、これを明示的に追加しました（v7の一部構成では省略可能あるいは別ファイル管理となっていた部分の修正）。

## 4. 検証結果

検証スクリプト (`src/debug/test-uuid-soft-delete.ts`) を用いて以下の正常性を確認しました。

- [x] レコード作成時にUUID v7形式のIDが付与されること。
- [x] `delete()` メソッドを呼ぶと、レコードは消えず `deletedAt` が更新されること。
- [x] `findUnique()` および `findMany()` で削除済みレコードが取得されないこと。
- [x] ベースのクライアント（拡張なし）からは物理データとして `deletedAt` 入りのレコードが確認できること。

以上
