# Implementation Plan - Issue 40: プロジェクト詳細閲覧機能とE2Eテストの実装

## 1. 概要

Issue 38 の評価により判明した、「プロジェクト詳細閲覧シナリオ」のブロッカー（機能未実装）を解消するための計画です。
フロントエンドにプロジェクト詳細ページを追加し、一覧からの遷移を実現した上で、対応するE2Eテストを実装します。
また、E2Eテストの保守性を高めるため、Page Object Model (POM) パターンを導入します。

## 2. 実装範囲 (Scope)

### A. フロントエンド機能実装 (Feature Implementation)

1. **GraphQL Query 追加**:
   - 単一プロジェクトの詳細情報を取得する `GET_PROJECT` クエリを定義します。
   - 関連する `datasets` および `contributors` (ProjectContributor経由) も同時に取得します。

2. **詳細ページコンポーネント (`ProjectDetail.tsx`)**:
   - 指定されたIDのプロジェクト情報を表示するページを作成します。
   - 基本情報（番号、説明、作成日等）に加え、関連するデータセット一覧と貢献者一覧を表示します。
   - ローディング状態とエラー状態を適切にハンドリングします。

3. **ルーティング設定 (`App.tsx`)**:
   - `/projects/:id` ルートを追加し、`ProjectDetail` コンポーネントをマッピングします。

4. **一覧からの遷移 (`ProjectList.tsx`)**:
   - DataGrid の行クリック、または「View Details」ボタン等のアクションにより、詳細ページへ遷移する導線を実装します。

### B. E2E テスト実装 (Test Implementation)

1. **シナリオテスト (`project-view.spec.ts`)**:
   - Issue 38 で計画されていた「プロジェクト閲覧フロー」を実装します。
   - 一覧ページ表示 -> 任意のプロジェクト選択 -> 詳細ページ表示 -> データ確認。

### C. リファクタリング (Refactoring)

1. **Page Object Model (POM) 導入**:
   - 既存の `graph-scenarios.spec.ts` および新規作成する `project-view.spec.ts` で使用するページ操作ロジックを、専用のクラス (`e2e/pages/*.ts`) に切り出します。

## 3. 技術的詳細 (Technical Details)

### GraphQL Query 案

```graphql
query GetProject($id: ID!) {
  project(id: $id) {
    id
    projectNumber
    description
    createdAt
    updatedAt
    datasets {
      id
      title
      datasetNo
      accessPolicy
    }
    contributors {
      role
      contributor {
        id
        name
      }
    }
  }
}
```

### ディレクトリ構成 (E2E)

```text
frontend/e2e/
├── pages/
│   ├── base-page.ts        # 共通操作
│   ├── project-list-page.ts
│   ├── project-detail-page.ts
│   └── graph-page.ts
├── scenarios/              # (Optional: もしspecファイルを分けるなら)
│   ├── graph-scenarios.spec.ts
│   └── project-view.spec.ts
└── ...
```

## 4. 実装ステップ

### Step 1: Frontend - GraphQL & Type Generation

- `frontend/src/graphql/queries.ts` に `GET_PROJECT` を追加。
- `npm run codegen` (もし設定されていれば) または手動で型定義を確認。

### Step 2: Frontend - Detail Page Implementation

- `frontend/src/pages/ProjectDetail.tsx` を作成。
- `useQuery` を用いてデータ取得と表示ロジックを実装。

### Step 3: Frontend - Routing & Navigation

- `frontend/src/App.tsx` にルート追加。
- `frontend/src/pages/ProjectList.tsx` に遷移イベント実装（`useNavigate` 利用）。

### Step 4: E2E - Refactoring (POM)

- `frontend/e2e/pages/` ディレクトリ作成。
- `GraphPage` クラスを作成し、`graph-scenarios.spec.ts` のロジックを移行。

### Step 5: E2E - Scenario Implementation

- `frontend/e2e/project-view.spec.ts` を作成。
- `ProjectListPage`, `ProjectDetailPage` クラスを利用してテストシナリオを記述。

## 5. 完了条件 (Acceptance Criteria)

1. ブラウザ上で、プロジェクト一覧の行をクリックすると、該当プロジェクトの詳細ページに遷移できること。
2. 詳細ページにおいて、プロジェクトの基本情報、関連データセット、貢献者が正しく表示されていること。
3. `npm run test:e2e` (または `npx playwright test`) を実行し、既存の Graph テストと新規の Project View テストの両方がパスすること。
4. E2Eテストコードが Page Object Model に基づいて構造化されていること。
