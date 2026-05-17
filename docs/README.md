# ドキュメント一覧

このディレクトリには、RDM システムモックアップの仕様、設計、実装計画、実装レポートを配置する。

## 現行ドキュメント

| ドキュメント | 内容 |
| --- | --- |
| `specifications.md` | 開発仕様、機能要件、フェーズ計画 |
| `logical_model.yaml` | DMP 由来の初期論理モデル |
| `architecture.md` | システム全体構成、主要境界、実装状況 |
| `backend-design.md` | NestJS/GraphQL/Prisma バックエンド設計 |
| `frontend-design.md` | React/MUI/@xyflow/react フロントエンド設計 |
| `data-model.md` | Prisma を基準にしたデータモデル設計 |
| `graphql-api.md` | GraphQL query/mutation と API 契約 |
| `testing-strategy.md` | Backend/Frontend/E2E のテスト戦略 |
| `development-guide.md` | 開発時の起動、変更、確認手順 |

## 履歴系ドキュメント

| ディレクトリ | 内容 |
| --- | --- |
| `plans/` | 実装計画。完了済みの計画は `plans/finished/` に配置される |
| `reports/` | 実装レポート、テスト計画、評価レポート |

`plans/` と `reports/` は文量が多いため、現状把握では見出し、結論、対象ファイル、完了条件を優先して読む。

## 更新方針

実装変更により設計判断や API 契約が変わった場合は、コードと同じ作業単位で該当ドキュメントを更新する。特に DB schema、GraphQL schema、Graph 表示仕様、テスト方針に変更があった場合は、関連ドキュメントの更新漏れに注意する。
