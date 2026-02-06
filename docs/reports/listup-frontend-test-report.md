# フロントエンド テスト実装計画書

## 1. 現状のステータス分析

現在、`frontend` ディレクトリにはテスト環境が整備され、主要なコンポーネントのテストコードが実装されています。
アプリケーションは以下の技術スタックで構成されています。

- **Framework**: React + Vite
- **Data Fetching**: Apollo Client (GraphQL)
- **UI Library**: Material UI (MUI)
- **Routing**: React Router
- **Current Coverage**: 100% (of planned tests)

## 2. 推奨されるテスト技術スタック

Viteプロジェクトとの親和性、および現代的なReactテストの標準として以下を推奨します。

| カテゴリ | 推奨ライブラリ | 理由 |
| --- | --- | --- |
| **Test Runner** | **Vitest** | Viteの設定を共有でき、高速に動作するため。 |
| **Environment** | **jsdom** | ブラウザ環境（DOM）のシミュレーションに標準的。 |
| **Utilities** | **@testing-library/react** | ユーザー視点でのDOM検証を行うデファクトスタンダード。 |
| **User Simulation** | **@testing-library/user-event** | クリックや入力などのユーザー操作を信頼性高くシミュレートするため。 |
| **GraphQL Mock** | **@apollo/client/testing** | `MockedProvider` を使用して、バックエンドなしでGraphQLのレスポンスを制御するため。 |

## 3. 必要なテストリスト（優先度順）

### Priority 1: テスト基盤の整備 (Critical)

テストコードを書き始めるための環境構築です。

- [x] **依存パッケージのインストール** (`vitest`, `jsdom`, `@testing-library/*` 等)
- [x] **Vitest 設定ファイルの作成** (`vite.config.ts` への追記 または `vitest.config.ts`)
- [x] **テストセットアップファイルの作成** (`src/setupTests.ts` での `jest-dom` ロード等)
- [x] **CI用のスクリプト追加** (`npm run test`, `npm run test:ui`)

### Priority 2: ページコンポーネントの結合テスト (High)

各画面がデータを正しく表示できるかを検証します。各ページコンポーネントはAPI通信(`useQuery`)を含むため、`MockedProvider`を用いた結合レベルのテストを行います。

#### 対象: `ProjectList.tsx`

- [x] **Loading状態**: クエリ実行中にスピナー（`CircularProgress`）が表示されること。
- [x] **Success状態**: Mockデータを受け取り、リスト（`DataGrid`）に行が表示されること。
  - 特に日付フォーマット (`valueFormatter`) が正しく機能しているか検証。
- [x] **Error状態**: GraphQLエラー発生時にエラーメッセージ（`Alert`）が表示されること。

#### 対象: `DatasetList.tsx`

- [x] **Success状態**: リストが表示されること。
  - **関連データの表示**: `project.projectNumber` の取得・表示（`valueGetter`）が正しく動くか検証（Projectがnullの場合のハンドリング含む）。

#### 対象: `ContributorList.tsx`

- [x] **Success状態**: リストが表示されること。

### Priority 3: ルーティングとレイアウトのテスト (Medium)

アプリケーション全体としてのナビゲーションを検証します。

#### 対象: `App.tsx` / `MainLayout.tsx`

- [x] **レイアウト描画**: ヘッダーやナビゲーションメニューが表示されること。
- [x] **ページ遷移**: ナビゲーションリンクをクリックした際、URLが変わり、正しいコンポーネントがマウントされること。

### Priority 4: ユーティリティ/フックの単体テスト (Low)

現在はロジックのほとんどがコンポーネント内にありますが、今後ロジックをカスタムフック（例: `useProjects`）などに切り出した場合は、その単体テストを追加します。

## 4. 今後のアクションプラン

1. テスト環境のセットアップ (P1) を実施。
2. 代表的なコンポーネント（`ProjectList`）に対して、Loading/Success/Error の3パターンでテストを作成し、雛形とする。
3. 他のページ（`DatasetList`, `ContributorList`）へ展開。
