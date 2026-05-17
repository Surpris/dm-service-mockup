# GraphQL API 設計

## 概要

バックエンド API は GraphQL で提供される。NestJS code-first により `backend/src/schema.gql` が生成され、フロントエンドは Apollo Client で query/mutation を実行する。

開発時の endpoint:

```text
http://localhost:3000/graphql
```

## 主要 Query

| Query | 戻り値 | 役割 |
| --- | --- | --- |
| `projects` | `[Project!]!` | Project 一覧 |
| `project(id: ID!)` | `Project` | Project 詳細 |
| `datasets` | `[Dataset!]!` | Dataset 一覧 |
| `dataset(id: ID!)` | `Dataset` | Dataset 詳細 |
| `contributors` | `[Contributor!]!` | Contributor 一覧 |
| `contributor(id: ID!)` | `Contributor` | Contributor 詳細 |
| `allDmpMetadata` | `[DMPMetadata!]!` | DMPMetadata 一覧 |
| `dmpMetadata(id: String!)` | `DMPMetadata!` | DMPMetadata 詳細 |
| `dmpMetadataByProject(projectId: String!)` | `DMPMetadata!` | Project 単位の DMPMetadata |
| `userDefinedRelationships` | `[UserDefinedRelationship!]!` | ユーザー定義リレーション一覧 |
| `userDefinedRelationship(id: String!)` | `UserDefinedRelationship!` | ユーザー定義リレーション詳細 |
| `graph(filter: String)` | `GraphData!` | グラフ表示用データ |

## 主要 Mutation

| Mutation | 役割 |
| --- | --- |
| `createProject` | Project 作成 |
| `updateProject` | Project 更新 |
| `removeProject` | Project 論理削除 |
| `createDataset` | Dataset 作成 |
| `updateDataset` | Dataset 更新 |
| `removeDataset` | Dataset 論理削除 |
| `createContributor` | Contributor 作成 |
| `updateContributor` | Contributor 更新 |
| `removeContributor` | Contributor 論理削除 |
| `createDMPMetadata` | DMPMetadata 作成 |
| `updateDMPMetadata` | DMPMetadata 更新 |
| `removeDMPMetadata` | DMPMetadata 削除 |
| `createUserDefinedRelationship` | ユーザー定義リレーション作成 |
| `updateUserDefinedRelationship` | ユーザー定義リレーション更新 |
| `removeUserDefinedRelationship` | ユーザー定義リレーション論理削除 |

## GraphData

Graph API は React Flow に近い構造を返す。

```graphql
type GraphData {
  nodes: [GraphNode!]!
  edges: [GraphEdge!]!
}

type GraphNode {
  id: ID!
  label: String!
  type: NodeType!
  data: String
}

type GraphEdge {
  id: ID!
  source: String!
  target: String!
  type: String!
  label: String
  data: String
}
```

`GraphNode.data` と `GraphEdge.data` は JSON 文字列として扱われる。フロントエンドでは `JSON.parse` し、parse に失敗した場合は空オブジェクトとして扱う。

## UserDefinedRelationship

作成 input:

```graphql
input CreateUserDefinedRelationshipInput {
  relationshipType: String!
  sourceId: String!
  sourceType: EntityType!
  targetId: String!
  targetType: EntityType!
  properties: String
  createdBy: String!
}
```

GraphQL schema 上の `properties` は `String` だが、Prisma schema では `Json?` である。現行フロントエンドは JSON.stringify した文字列を渡している。

## Field Resolver

Project と Dataset では関連フィールドを Resolver で解決する。

| Type | Field | 解決方法 |
| --- | --- | --- |
| `Project` | `datasets` | `projectId` に一致する Dataset を取得 |
| `Project` | `contributors` | `projectId` に一致する ProjectContributor を取得 |
| `Dataset` | `project` | `projectId` の Project を取得 |
| `Dataset` | `collectedBy` | `collectedById` の Contributor を取得 |
| `Dataset` | `managedBy` | `managedById` があれば Contributor を取得 |

## フロントエンド利用

`frontend/src/graphql/queries.ts` が現在の主要利用箇所である。

主な画面との対応:

| Query | 利用画面 |
| --- | --- |
| `GET_PROJECTS` | ProjectList |
| `GET_PROJECT` | ProjectDetail |
| `GET_DATASETS` | DatasetList |
| `GET_CONTRIBUTORS` | ContributorList |
| `GET_GRAPH` | GraphContainer |
| `CREATE_USER_DEFINED_RELATIONSHIP` | GraphContainer |

## エラー設計の現状

NestJS の例外が GraphQL エラーとして返る。`NotFoundException` は一部 Service で使われているが、全 mutation/query で同じ粒度の存在確認がされているわけではない。

今後、次の観点を明文化するとよい。

- NotFound、入力不正、業務制約違反、DB 制約違反の分類
- GraphQL error extensions の形式
- フロントエンドで表示すべきユーザー向けメッセージ
- mutation の idempotency や二重送信対策

## 今後の設計課題

- `graph(filter: String)` の filter 形式を決める
- JSON scalar の導入を検討する
- GraphQL schema から TypeScript 型を生成し、フロントエンドの手書き型を減らす
- pagination/filter/sort を一覧 API に導入する
- 認証導入後に `createdBy` とアクセス制御を設計する
