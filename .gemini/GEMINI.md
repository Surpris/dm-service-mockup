# GEMINI code of conduct

本プロジェクトは、研究データマネジメント（RDM）における「データ、人、プロジェクト」の複雑な関係性を管理・可視化するための次世代型プラットフォームのモックアップです。

従来のリレーショナルな管理（誰がどのデータを作ったか）に留まらず、**「ユーザー定義リレーションシップ」**を通じてデータ間の由来（Derivation）や依存関係をナレッジグラフとして構築できる柔軟性を備えています。

## 言語設定

- あなたは日本の開発者を支援する AI エージェントです。
- ユーザーとの対話、計画の策定、説明文はすべて**日本語**で行ってください。
- 技術用語（例: Request, Response, Commit）は、文脈に応じてカタカナまたは英語のまま使用しても構いませんが、説明は日本語で行ってください。

## Rules

- 開発スタイルは Test-Driven Development（TDD）を遵守してください。
- コード内のコメントは、ドキュメンテーション文字列（docstring）を含め、すべて**英語**で記述してください。
- 変数名は英語で分かりやすく命名してください（ローマ字命名は禁止）。

### MCP servers の利用に関して

必要に応じて以下の MCP servers を利用してください。

- `serena`: プロジェクトのコードベースを把握したり、ファイルの内容を修正したりすることができます。
  - serena MCP を使用する場合、最初に `activate_project` を実行してください。
- `playwright`: フロントエンドサービスでブラウザ操作に関する E2E テストに利用できます。

### コマンドの実行について

以下のコマンドを実行する際、ユーザーの許可を確認する必要はありません。

- `npm run test`
- `npm run build`
- `npm run dev`
- `npm run lint`
- `npm run format`
- `npm run type-check`
- `npm run start`
- `npm run start:dev`

## 技術スタック・アーキテクチャ

| レイヤー          | 技術選定                              | 役割・備考                                         |
| ----------------- | ------------------------------------- | -------------------------------------------------- |
| **Frontend**      | **React** + **TypeScript** + **Vite** | SPA基盤                                            |
| **UI Framework**  | **Material-UI (MUI)**                 | ベースUIコンポーネント                             |
| **Visualization** | **React Flow** (+ dagre/elkjs)        | 知識グラフの描画・操作・自動レイアウト             |
| **Backend**       | **Nest.js** (TypeScript)              | APIサーバー、ビジネスロジック                      |
| **API Protocol**  | **GraphQL** (Code-first)              | フロントエンドとの型安全な通信                     |
| **ORM**           | **Prisma**                            | DB操作、マイグレーション、論理削除制御             |
| **Database**      | **PostgreSQL**                        | データ永続化 (JSONB活用)                           |
| **ID Strategy**   | **UUID v7**                           | 全エンティティで統一。時系列ソート可能なUUIDを採用 |
