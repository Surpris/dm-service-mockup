# RDM Frontend

研究データマネジメント（RDM）システムのフロントエンドアプリケーションです。
React Flow を活用したインタラクティブなナレッジグラフ可視化を提供します。

## 🛠️ 技術スタック

- **Framework**: React + TypeScript + Vite
- **UI Component**: Material-UI (MUI)
- **Visualization**: React Flow (@xyflow/react)
- **API Client**: GraphQL Code Generator + Apollo Client
- **Testing**: Playwright (E2E)

## 🚀 機能

- **プロジェクト一覧**: MUI DataGrid を使用したページネーション・ソート・フィルタリング対応のテーブルビュー。
- **ナレッジグラフ**:
  - プロジェクト、データセット、貢献者の関係性を可視化。
  - **自動レイアウト**: dagre/elkjs を用いたノードの自動配置。
  - **リレーション作成**: ノード間のハンドルをドラッグ＆ドロップして、独自の「ユーザー定義リレーション」を作成可能。
  - **フィルタリング**: 表示するノードタイプや属性を動的に切り替え。

## 🏃 開発環境の起動

前提: バックエンドが `http://localhost:3000` で起動していること。

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

`http://localhost:5173` にアクセスしてください。

## 🧪 テストの実行

Playwright による E2E テストを実行します。

```bash
# E2Eテストの実行 (Headless)
npx playwright test

# UIモードでの実行
npx playwright test --ui
```

詳細は `e2e/README.md` (もしあれば) または `package.json` を参照してください。
