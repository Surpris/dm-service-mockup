# Implementation Plan - Issue 13: Prototype for UserDefinedRelationship Promotion

## 1. 概要

`UserDefinedRelationship` として柔軟に定義されたデータ間の関係性を、システム定義の正規リレーション（System Relation）に「昇格（Promote）」させるための運用スクリプトのプロトタイプを作成する。

本プロトタイプでは、具体的なユースケースとして以下のシナリオを想定する。

**シナリオ**:
ユーザーが `UserDefinedRelationship` を使用してプロジェクトと研究者の関係（メンバーシップ）を定義してしまったデータを、正規の `ProjectContributor` エンティティへ移行する。

- **Source**: `UserDefinedRelationship` (Type: "MEMBER", Source: PROJECT, Target: CONTRIBUTOR)
- **Destination**: `ProjectContributor` (Role: デフォルトまたはプロパティから推定)

## 2. 実装方針

### 2.1. スクリプトの配置

- `backend/src/scripts/promote-relationship-prototype.ts` として作成する。
- スタンドアロンで実行可能な TypeScript スクリプトとする（`ts-node` 等で実行）。

### 2.2. 処理フロー

1. **初期化**: Prisma Client をインスタンス化する。
2. **抽出 (Extract)**:
    - `UserDefinedRelationship` テーブルから以下の条件でレコードを抽出する。
      - `relationshipType`: "MEMBER"
      - `sourceType`: "PROJECT"
      - `targetType`: "CONTRIBUTOR"
      - `deletedAt`: NULL
3. **変換 (Transform)**:
    - 抽出したレコードの `properties` JSON フィールドを解析し、役割（Role）を決定する。
    - マッピング例:
      - property `role` が "PI" -> `ProjectRole.PRINCIPAL_INVESTIGATOR`
      - それ以外/不明 -> `ProjectRole.CO_INVESTIGATOR` (デフォルト)
4. **ロード (Load) & クリーンアップ**:
    - トランザクション (`$transaction`) を使用して以下をアトミックに実行する。
      - `ProjectContributor` テーブルへのレコード作成（重複チェックを含む）。
      - 元の `UserDefinedRelationship` レコードの論理削除 (`deletedAt` 更新)。
5. **結果出力**:
    - 移行成功件数、スキップ件数（重複など）、エラー件数をコンソールに出力する。

## 3. 検証計画

### 3.1. テストデータ準備

スクリプト内で、実行前に以下のテストデータを一時的に作成する（または別のシードスクリプトを用意する）。

- Project: 1件
- Contributor: 1件
- UserDefinedRelationship: 上記を結ぶ "MEMBER" タイプのレコード1件

### 3.2. 実行と確認

コマンド:

```bash
npx ts-node backend/src/scripts/promote-relationship-prototype.ts
```

確認項目:

1. スクリプトがエラーなく終了すること。
2. `ProjectContributor` に新しいレコードが作成されていること。
3. 対象の `UserDefinedRelationship` レコードに `deletedAt` が設定されていること。
4. 再度スクリプトを実行しても、二重登録されないこと。

## 4. タスクリスト

- [x] `backend/src/scripts/` ディレクトリの作成
- [x] `backend/src/scripts/promote-relationship-prototype.ts` の実装
- [x] 動作確認（手動テスト）
