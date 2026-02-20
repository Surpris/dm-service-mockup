# フロントエンド機能拡張仕様書 (CRUD & Detail Views)

## 1. 目的

本ドキュメントは、現在不足している `Project`, `Dataset`, `Contributor`, `DMPMetadata` の管理機能（作成、編集、削除、詳細表示）に関するフロントエンド実装仕様を定義するものです。
既存の一覧表示機能に加え、これらの機能を実装することで、ユーザーによるデータの完全なライフサイクル管理を可能にします。

## 2. 共通仕様 (Common UI/UX)

- **UIフレームワーク**: Material-UI (MUI) v5 を使用し、既存のデザインシステムと整合させる。
- **インタラクション**:
  - **作成・編集**: モーダルダイアログ (`Dialog`) を使用して入力を行う。
  - **削除**: 誤操作防止のため、必ず確認ダイアログを表示する。
- **フィードバック**:
  - **成功**: `Snackbar` (Alert severity="success") を画面下部に表示する。
  - **エラー**: `Snackbar` (Alert severity="error") またはダイアログ内の `Alert` でエラー内容を通知する。
  - **Loading**: 処理中はボタンを `disabled` 状態にし、`CircularProgress` 等で進行中であることを示す。
- **データ更新**: Apollo Client のキャッシュ更新機能 (`refetchQueries` または `update` 関数) を利用し、Mutation 完了後に一覧や詳細画面が即座に最新化されるようにする。

## 3. Project 管理機能

### 3.1. Project Creation (新規作成)

- **場所**: Project List 画面 (`/projects`)
- **トリガー**: 画面右上の "Create Project" ボタン (Fab または Button)。
- **UI**: 入力ダイアログ。
- **入力項目**:
  - `projectNumber` (Required, String): 研究課題番号。一意である必要がある。
  - `description` (Optional, Multiline String): プロジェクトの概要。
- **GraphQL**: `createProject` Mutation を使用。

### 3.2. Project Update (編集)

- **場所**: Project Detail 画面 (`/projects/:id`)
- **トリガー**: "Edit" ボタン。
- **UI**: 入力ダイアログ (現在の値を初期値としてセット)。
- **入力項目**: Creation と同様。
- **GraphQL**: `updateProject` Mutation を使用。

### 3.3. Project Deletion (削除)

- **場所**: Project Detail 画面
- **トリガー**: "Delete" ボタン (赤色/Danger style)。
- **確認**: "Are you sure you want to delete this project? This action cannot be undone."
- **GraphQL**: `removeProject` Mutation を使用。
- **遷移**: 削除成功後、Project List 画面へ遷移する。

### 3.4. DMP Metadata Management

- **場所**: Project Detail 画面内の "DMP Metadata" セクション。
- **仕様**:
  - Metadata が存在しない場合: "Create DMP Metadata" ボタンを表示。
    - クリックで `createDMPMetadata` Mutation を実行 (`projectId` を引数)。
    - 作成後、メタデータ情報を表示する形式に切り替わる。
  - Metadata が存在する場合: Created/Updated 日時を表示し、"Delete Metadata" ボタンを配置。
    - Delete ボタンで `removeDMPMetadata` Mutation を実行。

## 4. Dataset 管理機能

### 4.1. Dataset List Navigation

- **変更点**: `DatasetList` (`/datasets`) の各行をクリックした際、後述の Dataset Detail 画面へ遷移するようにする。

### 4.2. Dataset Detail View (新規画面)

- **URL**: `/datasets/:id`
- **構成**:
  - **Header**: タイトル (`title`)、Dataset No (`datasetNo`)、Access Policy バッジ。
  - **Basic Info**:
    - Collected At, Collected By (Contributor へのリンク)
    - Managed By (Contributor へのリンク), Managed Period (From - To)
    - Belonging Project (Project へのリンク)
  - **Actions**: Edit ボタン, Delete ボタン。

### 4.3. Dataset Creation

- **場所**: Project Detail 画面の "Datasets" セクションにある "Add Dataset" ボタン。
  - _Rationale_: Dataset は必ず Project に紐づく必要があるため、Project コンテキストからの作成を基本とする。
- **UI**: 入力ダイアログ。
- **入力項目**:
  - `title` (Required, String)
  - `datasetNo` (Required, Number)
  - `accessPolicy` (Required, Select Box: CLOSED, PUBLIC, SHARED)
  - `collectedById` (Required, Autocomplete/Select: Contributor list から選択)
  - `managedById` (Optional, Autocomplete/Select: Contributor list から選択)
  - `collectedAt` (Optional, DatePicker)
  - `managedFrom` (Optional, DatePicker)
  - `managedTo` (Optional, DatePicker)
  - `projectId`: 自動的に現在の Project ID を設定。
- **GraphQL**: `createDataset` Mutation を使用。

### 4.4. Dataset Update

- **場所**: Dataset Detail 画面の "Edit" ボタン。
- **UI**: 入力ダイアログ。
- **GraphQL**: `updateDataset` Mutation を使用。

### 4.5. Dataset Deletion

- **場所**: Dataset Detail 画面の "Delete" ボタン。
- **GraphQL**: `removeDataset` Mutation を使用。
- **遷移**: 削除成功後、前の画面 (Project Detail) または Dataset List へ遷移。

## 5. Contributor 管理機能

### 5.1. Contributor List Navigation

- **変更点**: `ContributorList` (`/contributors`) の各行をクリックした際、後述の Contributor Detail 画面へ遷移するようにする。

### 5.2. Contributor Detail View (新規画面)

- **URL**: `/contributors/:id`
- **構成**:
  - **Header**: 名前 (`name`)、Contributor ID (`contributorId`)。
  - **Related Info**:
    - Collected Datasets (リスト表示)
    - Managed Datasets (リスト表示)
    - Participated Projects (リスト表示 - ProjectContributor 経由)
  - **Actions**: Edit ボタン, Delete ボタン。

### 5.3. Contributor Creation

- **場所**: Contributor List 画面 (`/contributors`) の "Create Contributor" ボタン。
- **UI**: 入力ダイアログ。
- **入力項目**:
  - `contributorId` (Required, String): ユニークなID。
  - `name` (Required, String): 名前。
- **GraphQL**: `createContributor` Mutation を使用。

### 5.4. Contributor Update

- **場所**: Contributor Detail 画面の "Edit" ボタン。
- **UI**: 入力ダイアログ。
- **GraphQL**: `updateContributor` Mutation を使用。

### 5.5. Contributor Deletion

- **場所**: Contributor Detail 画面の "Delete" ボタン。
- **GraphQL**: `removeContributor` Mutation を使用。
- **遷移**: 削除成功後、Contributor List へ遷移。

## 6. 制限事項・未実装機能 (Out of Scope)

以下の機能は、現在のバックエンド API (GraphQL Schema) に対応する Mutation が存在しないため、今回のフロントエンド実装範囲外とします。

- **Project への Contributor 追加/削除**:
  - `Project` と `Contributor` を多対多で結びつける `ProjectContributor` エンティティを作成・削除するための API (`addProjectContributor` 等) が提供されていません。
  - そのため、Project Detail 画面でのメンバー管理機能は実装できません（表示のみとなります）。

## 7. 実装順序 (推奨)

1. **Providers & Hooks**: 共通のUIコンポーネント (Dialog, Snackbar) や Hooks の整備。
2. **Pages**: Detail ページ (Dataset, Contributor) のルーティングとスケルトン作成。
3. **Project CRUD**: Project の Create/Update/Delete/Metadata 実装。
4. **Contributor CRUD**: Contributor の Create/Update/Delete 実装。
5. **Dataset CRUD**: Dataset の Create/Update/Delete 実装 (Contributor 選択が必要なため、Contributor 実装後を推奨)。
