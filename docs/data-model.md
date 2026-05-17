# データモデル設計

## 概要

本システムのデータモデルは、研究プロジェクト、データセット、貢献者を中心としたシステム定義モデルと、任意のエンティティ間関係を表現するユーザー定義リレーションから構成される。

論理モデルの初期定義は `docs/logical_model.yaml`、物理モデルは `backend/prisma/schema.prisma` にある。現時点では Prisma schema の方が実装状態に近い。

## エンティティ一覧

| Entity | 役割 |
| --- | --- |
| `Project` | 研究プロジェクト |
| `DMPMetadata` | DMP の作成日、最終更新日 |
| `Contributor` | 研究者、スタッフなどの貢献者 |
| `ProjectContributor` | Project と Contributor の役割付き中間テーブル |
| `Dataset` | プロジェクトで生成、収集、管理されるデータセット |
| `UserDefinedRelationship` | ユーザーが任意に定義するエンティティ間リレーション |

## 共通 ID 方針

すべての主要エンティティの主キーは `String` の UUID である。作成時には Prisma Client Extension により UUID v7 が自動生成される。

Prisma schema には `@default(uuid())` が残っているが、アプリケーション経由の作成では UUID v7 が優先される。

## 論理削除

論理削除は `deletedAt: DateTime?` によって表現する。主要モデルでは `deletedAt = null` のデータを有効データとして扱う。

現行の共通 Prisma Extension 対象:

- `Project`
- `Contributor`
- `Dataset`
- `UserDefinedRelationship`

`ProjectContributor` は `deletedAt` を持つが、共通 Extension の対象には含まれていない。実装では query 側で `deletedAt: null` を明示する箇所がある。

## Project

| Field | 型 | 説明 |
| --- | --- | --- |
| `id` | String | UUID |
| `projectNumber` | String | 研究課題番号。一意 |
| `description` | String? | 説明 |
| `createdAt` | DateTime | 作成日時 |
| `updatedAt` | DateTime | 更新日時 |
| `deletedAt` | DateTime? | 論理削除日時 |

関係:

- `metadata`: DMPMetadata と 1:1
- `datasets`: Dataset と 1:N
- `contributors`: ProjectContributor と 1:N

## DMPMetadata

| Field | 型 | 説明 |
| --- | --- | --- |
| `id` | String | UUID |
| `createdDate` | DateTime | DMP 作成日 |
| `lastUpdatedDate` | DateTime | DMP 最終更新日 |
| `projectId` | String | Project への一意参照 |

`DMPMetadata` は現行 schema では `deletedAt` を持たない。

## Contributor

| Field | 型 | 説明 |
| --- | --- | --- |
| `id` | String | UUID |
| `contributorId` | String | 計画書内通し番号。一意 |
| `name` | String | 氏名 |
| `deletedAt` | DateTime? | 論理削除日時 |

関係:

- `projects`: ProjectContributor と 1:N
- `managedData`: Dataset の `managedBy`
- `collectedData`: Dataset の `collectedBy`

## ProjectContributor

Project と Contributor を役割付きで接続する中間テーブルである。

| Field | 型 | 説明 |
| --- | --- | --- |
| `id` | String | UUID |
| `projectId` | String | Project 参照 |
| `contributorId` | String | Contributor 参照 |
| `role` | ProjectRole | プロジェクト内の役割 |
| `deletedAt` | DateTime? | 論理削除日時 |

`ProjectRole`:

- `PRINCIPAL_INVESTIGATOR`
- `CO_INVESTIGATOR`
- `DATA_COLLECTOR`
- `DATA_MANAGER`

## Dataset

| Field | 型 | 説明 |
| --- | --- | --- |
| `id` | String | UUID |
| `datasetNo` | Int | 表示用番号 |
| `title` | String | データセット名 |
| `accessPolicy` | AccessPolicy | 公開方針 |
| `projectId` | String | Project 参照 |
| `collectedById` | String | 取得者、収集者 |
| `collectedAt` | DateTime? | 取得日 |
| `managedById` | String? | 管理者 |
| `managedFrom` | DateTime? | 管理開始日 |
| `managedTo` | DateTime? | 管理終了日 |
| `deletedAt` | DateTime? | 論理削除日時 |

`AccessPolicy`:

- `PUBLIC`
- `SHARED`
- `CLOSED`

## UserDefinedRelationship

ユーザー定義リレーションは、Project/Dataset/Contributor の任意の 2 エンティティ間に関係を追加するためのモデルである。

| Field | 型 | 説明 |
| --- | --- | --- |
| `id` | String | UUID |
| `relationshipType` | String | 関係種別 |
| `sourceId` | String | 始点エンティティ ID |
| `sourceType` | EntityType | 始点エンティティ種別 |
| `targetId` | String | 終点エンティティ ID |
| `targetType` | EntityType | 終点エンティティ種別 |
| `properties` | Json? | 任意属性 |
| `createdAt` | DateTime | 作成日時 |
| `createdBy` | String | 作成者 |
| `deletedAt` | DateTime? | 論理削除日時 |

`EntityType`:

- `PROJECT`
- `DATASET`
- `CONTRIBUTOR`

参照整合性は DB の外部キーではなく、Service の `validateEntityExistence` で検証される。

## システム定義リレーション

Graph API では次の関係をシステム定義リレーションとして扱う。

| Source | Target | Graph edge type |
| --- | --- | --- |
| Project | Dataset | `HAS_DATASET` |
| Dataset | Contributor | `COLLECTED_BY` |
| Dataset | Contributor | `MANAGED_BY` |
| Project | Contributor | `PROJECT_MEMBER` |

## 論理モデルとの差分

`docs/logical_model.yaml` と比較すると、現行実装では次の拡張が入っている。

- `ProjectContributor` が明示的な中間テーブルとして存在する
- `UserDefinedRelationship` が追加されている
- UUID 主キーが全モデルに導入されている
- 論理削除用の `deletedAt` が導入されている
- `Dataset` の collected/managed 関係が Contributor への外部キーとして実装されている

## 今後の設計課題

- `datasetNo` の一意性範囲を決める。現状は DB 上一意ではない
- `ProjectContributor` の重複制約を検討する
- `UserDefinedRelationship` の `properties` schema を運用上どこまで自由にするか決める
- DMPMetadata の削除方針を決める
- Graph 上のシステム定義 edge type を enum 化するか検討する
