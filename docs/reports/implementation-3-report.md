# Implementation Report 3: Core Entities GraphQL API

## 概要

Project, Dataset, Contributor の Core Entities に関する GraphQL API (CRUD) 実装を行いました。

## 実装内容

- **GraphQL Module**: NestJS v11 + Express 5 + Apollo Driver の設定。
- **Core Modules**:
  - `ProjectModule`, `DatasetModule`, `ContributorModule` を作成。
  - 各モジュールに Entity (GraphQL ObjectType), DTO (InputType), Service, Resolver を実装。
- **Prisma Integration**:
  - `PrismaService` の拡張クライアント (`_extendedClient`) を利用するパターンを確立。

## 発生した課題と対策

### 1. 依存パッケージの不足

- **現象**: アプリケーション起動時に `@as-integrations/express5 package is missing` エラーが発生。
- **原因**: NestJS v11 と Apollo Server の統合において、Express 5 アダプタが必要だったため。
- **対策**: `npm install @as-integrations/express5` を実行し解決。

### 2. Prisma Service の型定義エラー

- **現象**: Service クラスで `this.prisma.project` にアクセスしようとすると `Property 'project' does not exist` エラーが発生。
- **原因**: `PrismaService` が `ExtendedPrismaClient` をラップしており、直接のプロパティとしてモデルを持っていなかったため。
- **対策**: `this.prisma.client.project` のように `.client` アクセサを経由してアクセスするように修正。

### 3. リレーションシップの未実装

- **現象**: `logical_model.yaml` に定義されているリレーション (例: `Project.datasets`) が GraphQL スキーマに含まれていない。
- **原因**: 今回のスコープを「Core Entities の CRUD」に限定していたため、Code-first アプローチにおけるリレーション解決 (`@ResolveField`) が未実装。
- **対策**: 仕様書 (`docs/specifications.md`) の Phase 1 タスクに「System Relationships の実装」を追加し、別タスクとして管理することとした。

## 今後の展望

- `DMPMetadata` エンティティの実装。
- エンティティ間のリレーションシップ (Resolver 実装) の追加。
- シーディングスクリプトの作成による開発効率向上。
