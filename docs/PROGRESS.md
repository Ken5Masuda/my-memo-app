# 進捗ログ

## 2026-01-19

### やったこと
- 環境構築完了（Homebrew、Node.js、Claude Code、Next.js、shadcn/ui）

### 学んだこと
- Claude Codeの基本操作
- Next.jsプロジェクト構造
- shadcn/uiの仕組み

### 次回
- ToDoアプリ作成

### 参考チャット
- https://claude.ai/share/601e9fec-ae0a-4304-b5f7-8fe5178e0e4a

---

## 2026-01-20

### やったこと
- ToDoアプリ作成（追加・削除・完了切り替え機能）
- ローカルストレージ保存機能追加
- Supabase接続
- 認証機能追加

### 学んだこと
- useState、useEffect、TypeScript型定義、localStorage、Supabase（テーブル作成、環境変数、CRUD操作、Auth、RLS）、セキュリティポリシー

### 次回
- Phase 2 - V0でモックアップ作成

### 参考チャット
- https://claude.ai/share/601e9fec-ae0a-4304-b5f7-8fe5178e0e4a

---

## 2026-01-21

### やったこと
- V0でメモアプリUIをデザイン、プロジェクトに取り込み

### 学んだこと
- V0の使い方、AIデザインツールからのコード取得、コンポーネント分割

### 次回
- Supabaseとの連携（メモのCRUD操作）

### 参考チャット
- [このチャットのURL]

---

## 2026-01-22

### やったこと
- メモアプリとSupabase連携、CRUD操作実装、認証連携、コンテキストメニュー機能実装

### 学んだこと
- Supabaseテーブル作成（SQL）、RLSポリシー設定、既存UIへのDB連携方法

### 次回
- Phase 3の残り（検索機能強化、フォルダ管理など）またはPhase 4へ

### 参考チャット
- [このチャットのURL]

---

## 2026-01-23

### やったこと
- Vercelデプロイ、トップページ修正、ToDoアプリ削除してメモアプリ一本化
- 入力バリデーション強化（タイトル100文字、本文10000文字、タグ30文字×10個）
- トースト通知実装（sonner使用、成功/失敗を色分け表示）
- RLSポリシー確認
- デザインシステム適用、ハードコード色をCSS変数に統一、success色・スター色追加
- テスト環境セットアップ（Vitest + React Testing Library）
- ユニットテスト作成（日付フォーマット関数）
- コンポーネントテスト作成（Counterコンポーネント）
- CI/CD設定（GitHub Actions）

### 学んだこと
- Vercelの使い方、GitHubとの自動連携、環境変数の設定、CRUD
- 入力制限の重要性、トースト通知の仕組み、RLSポリシー
- ハードコード色とCSS変数の違い、デザイントークンの重要性
- Vitestの設定方法、React Testing Libraryの使い方、userEventによるインタラクションテスト
- GitHub Actionsワークフロー作成、CI/CDパイプライン構築

### 次回
- Phase 5（ネイティブアプリ）またはPhase 4の追加改善

### 参考チャット
- https://claude.ai/share/e613e4cd-91a9-44a0-a2b9-217de49134c9
