# RDM backend service

[![Nest Logo](https://nestjs.com/img/logo-small.svg)](http://nestjs.com/)

データ管理計画（DMP）および研究プロジェクトのメタデータを管理するための、モダンでスケーラブルなバックエンドAPIサービス。

![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)

---

## 🚀 概要

このプロジェクトは、NestJS、GraphQL、および Prisma を活用した、研究データ管理システムのモックアップバックエンドです。
高度な ID 戦略（UUID v7）や透過的な論理削除など、エンタープライズレベルのベストプラクティスを導入しています。

## 🛠️ 技術スタック

- **Core**: [NestJS](https://github.com/nestjs/nest) (v11)
- **API**: GraphQL (Apollo Server 5)
- **Database**: PostgreSQL (v16+)
- **ORM**: [Prisma](https://www.prisma.io/) (v5.22.0)
  - _安定性のため v5.22.0 に固定されています。_
- **Auth/ID**: UUID v7 (時系列ソート可能なUUID)

## ✨ 主要機能と実装詳細

### 🆔 UUID v7 ID 戦略

全エンティティのプライマリキーには **UUID v7** を採用しています。

- **実装方法**: `src/prisma/prisma.extension.ts` にて Prisma Client Extension として実装。
- **自動生成**: `create` または `createMany` 時に ID が指定されていない場合、自動的に UUID v7 が付与されます。

### 🗑️ 透過的論理削除 (Soft Delete)

データ削除時、物理的な削除ではなく `deletedAt` カラムを更新する論理削除を採用しています。

- **仕組み**: Prisma Client Extension が `delete` 系の操作を `update` ( `deletedAt` 設定) に変換します。
- **自動フィルタリング**: `findUnique`, `findFirst`, `findMany` などのクエリ時に、`deletedAt` が NULL でないレコードは自動的に除外されます。

### 🕸️ グラフAPI (Graph Module)

システム定義およびユーザー定義のリレーションシップを統合し、ナレッジグラフとして提供する専用APIを実装しています。

- **Query**: `graph(filter: String): GraphData`
- **Output**: フロントエンドの React Flow が解釈しやすいノード・エッジ形式のデータ構造。
- **Integration**: `UserDefinedRelationship` と標準リレーション（Project-Dataset間など）を動的に結合して返却します。

### 📊 データモデル (Core Entities)

- **Project**: 研究プロジェクト
- **Contributor**: プロジェクト貢献者（PI, データ管理者など）
- **Dataset**: プロジェクトに関連付けられたデータセット
- **DMPMetadata**: DMP固有の詳細メタデータ
- **UserDefinedRelationship**: エンティティ間の柔軟なユーザー定義リレーション

---

## 🏃 起動方法

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境構築とデータベース起動

Docker Compose を使用して開発用データベースを起動します。

```bash
docker-compose up -d
```

### 3. マイグレーションとシーディング

データベースのセットアップと、開発用ダミーデータの投入を行います。

```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. アプリケーションの起動

```bash
# 開発モード (watch)
$ npm run start:dev

# デバッグモード
$ npm run start:debug

# 本番ビルド
$ npm run build
$ npm run start:prod
```

---

## 🧪 テスト

品質管理のため、Jest を使用した網羅的なテストを実施しています。

```bash
# ユニットテスト
$ npm run test

# E2Eテスト
$ npm run test:e2e

# カバレッジレポート
$ npm run test:cov
```

---

## 🔍 検証用スクリプト

UUID v7 および論理削除の動作を確認するためのデバッグスクリプトが用意されています。

```bash
npx ts-node src/debug/test-uuid-soft-delete.ts
```

---

## 📄 ライセンス

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
