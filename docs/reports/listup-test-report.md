# テスト実装計画レポート

**作成日:** 2026-02-01
**対象:** Backend (Nest.js + Prisma + GraphQL)

## 概要

仕様駆動開発 (SDD)、W字モデル、およびテスト駆動開発 (TDD) のアプローチに基づき、現在完了している実装フェーズ（Core Entities & Infrastructure）に対して不足しているテスト項目を調査・リストアップしました。

現状の実装状況:

- [x] Nest.js + Prisma + PostgreSQL 環境構築
- [x] UUID v7 生成 & 論理削除 Middleware (Prisma Extension)
- [x] Core Entities (Project, Dataset, Contributor) の GraphQL Schema & CRUD

`.agent/rules/testing.md` の要件（Unit, Integration, E2E coverage > 80%）を満たし、今後の機能拡張におけるリグレッションを防ぐため、以下のテストを実装する必要があります。

## 1. 優先度: 高 (Must Implement)

基盤機能およびコアビジネスロジックの信頼性を保証するための必須テスト群です。

### 1.1. Unit Tests: Prisma Extension (Infrastructure Layer)

`backend/src/prisma/prisma.extension.ts` に実装された「UUID v7 自動生成」と「論理削除」が、Prisma Client の拡張として正しく機能することを検証します。

- **UUID v7 Generation**
  - `create`: `id` フィールドが未指定の場合、有効な UUID v7 が生成されて保存されること。
  - `createMany`: 配列内のすべてのデータに対して個別の UUID v7 が生成されること。
- **Logical Delete (Soft Delete)**
  - `delete`: 物理削除されず、`deletedAt` フィールドが現在時刻で更新されること。
  - `deleteMany`: 対象レコード群の `deletedAt` が一括更新されること。
  - `findUnique`: `deletedAt` が設定されているレコードを指定した場合、`null` が返されること。
  - `findMany`: デフォルトで `deletedAt: null` のフィルタが適用され、削除済みレコードが除外されること。

### 1.2. Unit Tests: Core Services (Business Logic Layer)

`Project`, `Dataset`, `Contributor` 各モジュールの Service クラス (`*.service.ts`) を検証します。PrismaService をモック化し、ビジネスロジックが意図通りにデータアクセス層を操作しているか確認します。

- **Common CRUD Logic (各 Entity 共通)**
  - `create`: 入力 DTO が Prisma の `create` メソッドに正しくマッピングされているか。
  - `findAll`: 削除済み除外フィルタが機能しているか（Extension との連携確認）。
  - `findOne`: 存在しない ID を指定した際のエラーハンドリングまたは `null` 返却。
  - `update`: 更新処理が正しく伝播しているか。
  - `remove`: 物理削除ではなく、論理削除（`deletedAt` 更新）フローが呼び出されているか。

### 1.3. Unit Tests: GraphQL Resolvers (Interface Layer)

Resolver (`*.resolver.ts`) が GraphQL 入力を正しく受け取り、Service を呼び出しているかを検証します。

- **GraphQL Mapping**
  - Query (`projects`, `project`): Service の結果を正しく GraphQL レスポンスとして返却するか。
  - Mutation (`createProject`, `updateProject`): GraphQL Arguments が DTO として正しく Service に渡っているか。
  - Mutation (`removeProject`): ID 引数が Service に渡っているか。

## 2. 優先度: 中 (Should Implement)

システム全体としての整合性確認および、DB との実際のやり取りを含めた動作保証を行います。

### 2.1. Integration / E2E Tests (API Layer)

`backend/test` 配下に、実際のテスト用データベース（Docker コンテナ等）を利用したテストケースを実装します。

- **User Scenarios (Happy Path)**
  - **Create -> Read Chain**: Entity を作成し、返却された ID を用いて即座に Query を実行し、データが取得できること。また ID が UUID v7 形式であること。
  - **Update**: フィールド更新が永続化されること。
  - **Delete -> Read**: 削除後に Query を実行するとデータが取得できない（404 または null）こと。
- **Persistence & Logical Delete Check**
  - API 経由で削除を実行した後、テストコード内から直接 Prisma Client (Admin権限相当) で DB を参照し、**「レコード自体は存在し、`deletedAt` カラムに値が入っている」** ことを確認する。これは論理削除の実装不備（物理削除してしまっている等）を検知するために重要です。

## 今後のアクションプラン

1. **Prisma Extension の Unit Test 実装**:
    全てのデータ操作の根幹となるため、まずはここの挙動をテストコードで確定させます。
2. **Core Services & Resolvers の Unit Test 実装**:
    各モジュールに対して機械的にテストを追加し、カバレッジを高めます。
3. **E2E テスト環境の整備と実装**:
    CI/CD パイプラインを見据え、Docker 環境でのテスト実行フローを確立します。
