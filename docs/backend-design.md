# バックエンド設計

## 概要

バックエンドは NestJS 11 を用いた GraphQL API サーバーである。GraphQL は code-first 方式で、`GraphQLModule.forRoot` の `autoSchemaFile` により `backend/src/schema.gql` が生成される。

主な責務は次の通り。

- RDM の中核エンティティ CRUD
- システム定義リレーションの取得
- ユーザー定義リレーションの作成、更新、削除
- グラフ表示用データの集約
- UUID v7 と論理削除の共通制御

## モジュール構成

| Module | 主なファイル | 責務 |
| --- | --- | --- |
| `PrismaModule` | `src/prisma/*` | Prisma Client のライフサイクルと拡張 |
| `ProjectModule` | `src/project/*` | Project と ProjectContributor |
| `DatasetModule` | `src/dataset/*` | Dataset と Project/Contributor 参照 |
| `ContributorModule` | `src/contributor/*` | Contributor |
| `DMPMetadataModule` | `src/dmp-metadata/*` | DMPMetadata |
| `UserDefinedRelationshipModule` | `src/user-defined-relationship/*` | 任意リレーション |
| `GraphModule` | `src/graph/*` | GraphData の生成 |

`AppModule` はこれらのモジュールと GraphQLModule を組み合わせる composition root として機能する。

## レイヤーと責務

### Resolver

Resolver は GraphQL の入出力境界であり、DTO を受け取り Service に処理を委譲する。Project と Dataset など一部の Resolver では `@ResolveField` により関連データを解決する。

例:

- `ProjectResolver.datasets` は `ProjectService.findDatasets(project.id)` を呼ぶ
- `ProjectResolver.contributors` は `ProjectService.findContributors(project.id)` を呼ぶ
- `DatasetResolver.project` は `DatasetService.findProject(dataset.projectId)` を呼ぶ
- `DatasetResolver.collectedBy` / `managedBy` は Contributor を解決する

### Service

Service は Prisma Client を使ってデータアクセスと軽い業務ルールを扱う。複雑なドメイン層はまだ分離されていない。

現行実装で明示的な業務ルールがある箇所:

- `ProjectService.update` は更新前に存在確認し、見つからない場合は `NotFoundException` を投げる
- `UserDefinedRelationshipService.create` は source/target の存在確認を行う
- `GraphService.getGraphData` は複数エンティティを統合して GraphData を生成する

### Prisma

`PrismaService` は拡張済み Prisma Client を提供する。通常の実装では `this.prisma.client.<model>` を使う。

## UUID v7

`backend/src/prisma/prisma.extension.ts` の Prisma Client Extension が `create` と `createMany` をフックし、`id` が指定されていない場合に `uuidv7()` で ID を付与する。

対象は `$allModels` であり、ID を持つモデル全体に適用される。Prisma schema の `@default(uuid())` はフォールバックとして残っている。

## 論理削除

論理削除の対象モデルは `softDeleteModels` に定義されている。

- `Project`
- `Contributor`
- `Dataset`
- `UserDefinedRelationship`

`ProjectContributor` は schema 上 `deletedAt` を持つが、現行の `softDeleteModels` には含まれていない。そのため、Service/Resolver 側では `deletedAt: null` を明示している箇所がある。今後 `ProjectContributor` も共通論理削除対象に含めるかは設計判断が必要である。

拡張の挙動:

| 操作 | 挙動 |
| --- | --- |
| `delete` | 対象モデルでは `update` に変換し `deletedAt` を設定 |
| `deleteMany` | 対象モデルでは `updateMany` に変換し `deletedAt` を設定 |
| `findUnique` | 結果取得後、`deletedAt` があれば `null` を返す |
| `findFirst` | `where.deletedAt = null` を追加 |
| `findMany` | `where.deletedAt = null` を追加 |

## GraphService

`GraphService.getGraphData` は以下を並列取得する。

- Project
- Dataset
- Contributor
- ProjectContributor
- UserDefinedRelationship

その後、Project/Dataset/Contributor を `GraphNode` に、次のリレーションを `GraphEdge` に変換する。

| 関係 | Edge type |
| --- | --- |
| Project -> Dataset | `HAS_DATASET` |
| Dataset -> Contributor | `COLLECTED_BY` |
| Dataset -> Contributor | `MANAGED_BY` |
| Project -> Contributor | `PROJECT_MEMBER` |
| UserDefinedRelationship | `relationshipType` の値 |

`filter` 引数は受け取るが現時点では未使用である。

## Promotion prototype

`backend/src/scripts/promote-relationship-prototype.ts` は、`UserDefinedRelationship` を `ProjectContributor` へ昇格する運用スクリプトのプロトタイプである。Issue 13 の計画では、`relationshipType = "MEMBER"`、`sourceType = PROJECT`、`targetType = CONTRIBUTOR` のデータを正規の ProjectContributor に移行し、元リレーションを論理削除する方針が示されている。

## エラー処理の現状

NotFound の扱いは一部 Service に実装されているが、全 CRUD で一貫しているわけではない。GraphQL エラーの形式、入力バリデーション、業務バリデーションの分類は今後の設計課題である。

## 今後の設計課題

- `ProjectContributor` の論理削除方針を統一する
- `graph(filter: String)` の filter 仕様を定義し実装する
- `properties` を String として扱うか、GraphQL JSON scalar を導入するか決める
- Service 層の業務ルールと単純 CRUD の境界を明確にする
- 認証、認可、`createdBy` の本実装方針を決める
