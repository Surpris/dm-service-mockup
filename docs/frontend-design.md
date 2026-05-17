# フロントエンド設計

## 概要

フロントエンドは React 19 + TypeScript + Vite の SPA である。UI は MUI、グラフ可視化は `@xyflow/react`、GraphQL 通信は Apollo Client を使用する。

## アプリケーション構成

`frontend/src/App.tsx` がアプリケーションの主要な composition root である。

```text
ApolloProvider
  ThemeProvider
    CssBaseline
    BrowserRouter
      MainLayout
        Routes
```

ルーティング:

| Path | Component | 役割 |
| --- | --- | --- |
| `/` | `Dashboard` | ダッシュボード |
| `/projects` | `ProjectList` | プロジェクト一覧 |
| `/projects/:id` | `ProjectDetail` | プロジェクト詳細 |
| `/datasets` | `DatasetList` | データセット一覧 |
| `/contributors` | `ContributorList` | 貢献者一覧 |
| `/graph` | `GraphPage` | ナレッジグラフ |

## GraphQL 通信

GraphQL query/mutation は `frontend/src/graphql/queries.ts` に定義される。Apollo Client の設定は `frontend/src/graphql/client.ts` にある。

主な query/mutation:

- `GET_PROJECTS`
- `GET_PROJECT`
- `GET_DATASETS`
- `GET_CONTRIBUTORS`
- `GET_GRAPH`
- `CREATE_USER_DEFINED_RELATIONSHIP`

現時点では GraphQL schema から型を自動生成している構成ではなく、Graph 関連では `mapper.ts` にローカル型が定義されている。

## 一覧画面

一覧系ページは Apollo Client でデータを取得し、MUI コンポーネントで表示する。

対象:

- `pages/ProjectList.tsx`
- `pages/DatasetList.tsx`
- `pages/ContributorList.tsx`

`ProjectList` からは `/projects/:id` への遷移導線があり、Issue 40 でプロジェクト詳細閲覧シナリオの対象になっている。

## グラフ画面

グラフ画面の主要構成:

| ファイル | 役割 |
| --- | --- |
| `pages/GraphPage.tsx` | ページ枠 |
| `features/graph/components/GraphContainer.tsx` | データ取得、状態管理、Dialog/Drawer 制御 |
| `features/graph/components/GraphView.tsx` | React Flow 本体 |
| `features/graph/components/GraphFilterSidebar.tsx` | ノード種別フィルタ |
| `features/graph/components/CreateRelationshipDialog.tsx` | リレーション作成 |
| `features/graph/components/NodeDetailsDrawer.tsx` | ノード詳細 |
| `features/graph/hooks/useGraphData.ts` | GraphQL 取得 hook |
| `features/graph/utils/mapper.ts` | Backend GraphData から React Flow への変換 |
| `features/graph/utils/layout.ts` | 自動レイアウト |
| `features/graph/nodes/*` | Project/Dataset/Contributor の custom node |

## Graph データフロー

```text
GraphPage
  -> GraphContainer
    -> useGraphData
      -> GET_GRAPH
        -> backend graph query
      -> mapGraphDataToReactFlow
    -> node type filter
    -> getLayoutedElements
    -> GraphView
```

`useGraphData` は `fetchPolicy: 'network-only'` を指定し、リレーション追加後に最新データを取得しやすくしている。

## リレーション作成フロー

1. ユーザーが React Flow 上でノード間を接続する
2. `GraphContainer.onConnect` が `pendingConnection` を保存し、Dialog を開く
3. Dialog で `relationshipType` と `description` を入力する
4. `CREATE_USER_DEFINED_RELATIONSHIP` mutation を実行する
5. `refetch()` で GraphData を再取得する

作成時の `sourceType` / `targetType` は React Flow node type を uppercase にして GraphQL enum に変換する。`createdBy` は現時点では `'user'` の固定値である。

## フィルタリング

現行のフィルタリングはフロントエンド側で Project/Dataset/Contributor の表示有無を切り替える方式である。GraphQL の `graph(filter: String)` はまだ使われていない。

## 状態管理

アプリケーション全体の状態管理ライブラリは導入していない。主な状態は各コンポーネントの `useState`、React Flow の `useNodesState` / `useEdgesState`、Apollo Client の query state に閉じている。

## 今後の設計課題

- GraphQL 型生成を導入し、`frontend/src/types/graphql.ts` と実際の query 型を同期する
- Graph filter を API 側と連動させる
- mutation 失敗時の UI エラー表示を `alert` から画面内フィードバックへ移行する
- `createdBy` を認証ユーザー由来にする
- `GraphPage` の固定幅 `70vw` / `70vh` が運用画面として十分か再確認する
