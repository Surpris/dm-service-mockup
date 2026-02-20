# Implementation Plan - Issue 38: フロントエンド シナリオテストの実装

## 1. 概要

本ドキュメントは、フロントエンドアプリケーションにおける主要なユーザー操作フロー（シナリオ）を検証するためのテスト自動化計画です。
単体テストやコンポーネントテスト（Vitest + React Testing Library）ではカバーしきれない、ページ遷移や実際のブラウザ描画、バックエンドとの連携を含めたE2E（End-to-End）テストを実装します。

## 2. 技術選定

**ツール:** [Playwright](https://playwright.dev/)

**選定理由:**

- **信頼性:** 待機処理（Auto-waiting）が強力で、Flaky（不安定）なテストになりにくい。
- **速度:** 並列実行が可能で高速。
- **デバッグ:** VS Code 拡張機能や Trace Viewer が充実しており、失敗原因の特定が容易。
- **ブラウザ対応:** Chromium, Firefox, WebKit をサポート。
- **Viteとの親和性:** モダンなフロントエンドスタックと相性が良い。

## 3. テスト対象シナリオ

仕様書 (`docs/specifications.md`) の「Phase 4: 統合テスト」に基づき、以下のシナリオを優先して実装します。

### Scenario 1: アプリケーション起動と基本表示 (Smoke Test)

- トップページ（Dashboard）が正常にレンダリングされること。
- グローバルナビゲーションが表示され、各ページ（Project List, Dataset List, Graph）へ遷移できること。

### Scenario 2: プロジェクト閲覧フロー

1. プロジェクト一覧ページを表示する。
2. 特定のプロジェクトをクリックして詳細（または関連データ）を表示する。
3. 期待されるデータセットや貢献者が表示されていることを確認する。

### Scenario 3: グラフ操作とリレーションシップ管理 (Critical)

**最も重要なシナリオです。**

1. グラフページ (`/graph`) へ遷移する。
2. グラフが描画されていることを確認する（Canvas要素、ノードの存在）。
3. フィルタリングUIを操作し、表示内容が変化することを確認する。
4. **[Action]** 2つのノード（例: Project と Dataset）を特定し、ユーザー定義リレーションシップを作成する操作を行う。
5. **[Verification]** グラフ上に新しいエッジ（リレーション）が描画されることを確認する。

## 4. ディレクトリ構成案

`frontend` ディレクトリ配下に `e2e` フォルダを作成し、テストコードを管理します。

```text
frontend/
├── e2e/
│   ├── config/             # テスト環境設定
│   ├── fixtures/           # テストデータ定義
│   ├── pages/              # Page Object Models (POM) - 各ページの操作を抽象化
│   │   ├── dashboard.ts
│   │   ├── graph-page.ts
│   │   └── ...
│   └── scenarios/          # 実際のテストシナリオ
│       ├── navigation.spec.ts
│       ├── project-view.spec.ts
│       └── graph-operations.spec.ts
├── playwright.config.ts    # Playwright 設定ファイル
└── ...
```

## 5. 実装ステップ

### Step 1: Playwright の導入と環境構築

- `npm init playwright@latest` を実行し、必要な依存関係をインストールする。
- `playwright.config.ts` をプロジェクトに合わせて調整する（Base URL: `http://localhost:5173` 等）。
- CI環境（GitHub Actions等）での実行設定を行う。

### Step 2: テスト容易性の向上 (Testability)

- テスト対象の主要な要素（ボタン、入力フォーム、グラフコンテナなど）に `data-testid` 属性を付与し、セレクタを安定させる。
  - 特に Canvas 内の要素（React Flow のノードなど）は選択が難しいため、適切な aria-label や testid の付与を検討する。

### Step 3: シナリオの実装

1. **Navigation & Smoke Test:** 基本的な起動確認。
2. **Graph Operations:** グラフ描画とリレーション作成フローの実装。

### Step 4: 実行と検証

- ローカル環境でバックエンド・フロントエンドを起動した状態でテストを実行し、安定してパスすることを確認する。
- レポート出力を確認する。

## 6. 前提条件と制約

- テスト実行時は、ローカル環境で Backend (`http://localhost:3000`) および Frontend (`http://localhost:5173`) が起動していること。
- データベースにはテスト用の初期データ（Seed）が投入されていることが望ましい（`npm run seed` 等の活用）。

## 7. 今後の拡張 (Future Work)

- バックエンドのデータ状態をリセットする仕組みの導入（テスト間の独立性確保）。
- ビジュアルリグレッションテスト（スナップショットテスト）の導入検討。
