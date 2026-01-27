# カリキュラム振り返り

## 1. カリキュラム概要

### 目的
AIツール（Claude Code、V0）を活用して、モダンなWebアプリケーション開発の一連のスキルを習得する。環境構築からデプロイ、さらにモバイルアプリ開発まで、実践的なフルスタック開発を体験する。

### 期間
- **開始日:** 2026年1月19日
- **完了日:** 2026年1月27日
- **実質日数:** 約9日間（当初予定: 13週間）

### ゴール
- [x] AIツールを使った効率的な開発ワークフローの習得
- [x] Next.js + Supabaseによるフルスタックアプリ開発
- [x] 商用品質のコード（テスト、CI/CD、セキュリティ）
- [x] Expoによるクロスプラットフォームモバイルアプリ開発

### 成果物
| 種類 | URL/パス |
|------|----------|
| Webアプリ | https://my-memo-app-lovat.vercel.app/ |
| モバイルアプリ | /Users/kengomasuda/projects/my-memo-app-mobile |
| GitHubリポジトリ | （リポジトリURL） |

---

## 2. 各Phaseで学んだこと・作ったもの

### Phase 1: 環境構築とClaude Code習熟

**期間:** 2026/01/19 - 2026/01/20

**作ったもの:**
- 開発環境一式（Homebrew、Node.js、Claude Code）
- Next.js + shadcn/uiプロジェクト
- ToDoアプリ（CRUD機能、認証付き）

**学んだこと:**
- Claude Codeの基本操作とプロンプトの書き方
- Next.jsのプロジェクト構造（App Router）
- shadcn/uiのコンポーネント活用法
- React Hooks（useState、useEffect）
- TypeScript型定義の基礎
- Supabaseの基本（テーブル作成、CRUD、Auth、RLS）

---

### Phase 2: デザイン・モックアップ

**期間:** 2026/01/21

**作ったもの:**
- V0でデザインしたメモアプリUI（複数画面）
- コンポーネント分割されたReactコード

**学んだこと:**
- V0（AIデザインツール）の使い方
- プロンプトからUIを生成する手法
- 生成コードをプロジェクトに取り込む方法
- コンポーネント設計の考え方

---

### Phase 3: フルスタック開発

**期間:** 2026/01/22

**作ったもの:**
- メモアプリ完成版
  - メモのCRUD操作
  - フォルダ・タグ管理
  - 検索・フィルター機能
  - スター（お気に入り）機能
  - コンテキストメニュー

**学んだこと:**
- Supabaseテーブル設計（SQL）
- RLS（Row Level Security）ポリシー設定
- 既存UIへのバックエンド連携
- 状態管理パターン

---

### Phase 4: 商用品質

**期間:** 2026/01/23

**作ったもの:**
- Vercelへのデプロイ環境
- 入力バリデーション機能
- トースト通知システム（sonner）
- デザインシステム（CSS変数）
- テスト環境（Vitest + React Testing Library）
- CI/CDパイプライン（GitHub Actions）

**学んだこと:**
- Vercelデプロイとドメイン設定
- GitHubとVercelの自動連携
- 入力制限とセキュリティの重要性
- トースト通知のUX設計
- CSS変数によるデザイントークン管理
- ユニットテスト・コンポーネントテストの書き方
- GitHub Actionsワークフロー作成

---

### Phase 5: ネイティブアプリ

**期間:** 2026/01/27

**作ったもの:**
- Expoモバイルアプリ
  - ログイン・サインアップ画面
  - メモ一覧画面（Pull to Refresh）
  - メモ詳細・編集画面
  - ダークテーマ対応
  - ハプティックフィードバック

**学んだこと:**
- Expoプロジェクト構成とSDK管理
- React Navigationによる画面遷移
- React NativeでのSupabase Auth連携
- AsyncStorageによるセッション永続化
- useFocusEffectによるデータ再取得
- useRef/useCallbackでstale closure問題解決
- RefreshControlによるPull to Refresh
- expo-hapticsによる振動フィードバック
- keyboardAppearanceによるダークテーマ対応

---

## 3. 習得した技術スタック一覧

### フロントエンド
| 技術 | 用途 |
|------|------|
| React | UIライブラリ |
| Next.js (App Router) | Reactフレームワーク |
| TypeScript | 型安全な開発 |
| Tailwind CSS | スタイリング |
| shadcn/ui | UIコンポーネント |
| sonner | トースト通知 |

### バックエンド・インフラ
| 技術 | 用途 |
|------|------|
| Supabase | BaaS（DB、Auth、Storage） |
| PostgreSQL | データベース |
| RLS | 行レベルセキュリティ |
| Vercel | ホスティング・デプロイ |

### モバイル
| 技術 | 用途 |
|------|------|
| Expo (SDK 54) | React Nativeフレームワーク |
| React Navigation | 画面遷移 |
| AsyncStorage | ローカルストレージ |
| expo-haptics | 振動フィードバック |

### 開発ツール・CI/CD
| 技術 | 用途 |
|------|------|
| Claude Code | AIペアプログラミング |
| V0 | AIデザインツール |
| Git / GitHub | バージョン管理 |
| GitHub Actions | CI/CD |
| Vitest | テストフレームワーク |
| React Testing Library | コンポーネントテスト |

---

## 4. 苦労した点・解決方法

### 1. React Native のバージョン互換性エラー
**問題:** `react-native-screens`のバージョン不一致で "expected dynamic type 'boolean', but had type 'string'" エラー

**解決:** Expo SDKに合った正しいバージョンを`npx expo install`でインストール

**学び:** Expoでは`npm install`ではなく`npx expo install`を使うことでバージョン互換性が保たれる

---

### 2. react-native-url-polyfill のインポートエラー
**問題:** `import "react-native-url-polyfill/dist/setup"` でモジュールが見つからない

**解決:** 正しいパス `import "react-native-url-polyfill/auto"` に変更

**学び:** ライブラリのドキュメントを確認し、正しいインポートパスを使用する

---

### 3. Stale Closure問題（メモが保存されない）
**問題:** ヘッダーの保存ボタンが古いstate値を参照し、入力内容が保存されない

**解決:** `useRef`で最新の値を保持し、`useCallback`で関数をメモ化

**学び:** React Navigationのヘッダーコンポーネントでは、クロージャの問題に注意が必要

---

### 4. Pull to Refreshのスピナーが見えない
**問題:** ダーク背景でスピナーが同化して見えない

**解決:** `tintColor`と`titleColor`を白（#fff）に変更

**学び:** ダークテーマでは、すべてのUI要素の可視性を確認する必要がある

---

### 5. 無効なRefresh Tokenエラー
**問題:** セッション期限切れ時に `AuthApiError: Invalid Refresh Token` が発生

**解決:** `getSession()`のエラーハンドリングを追加し、無効なセッションを自動クリア

**学び:** 認証エラーは適切にハンドリングし、ユーザーを正しい状態に導く

---

## 5. 今後の発展案（やってみたいこと）

### 短期（すぐできそう）
- [ ] メモの検索機能（モバイル版）
- [ ] フォルダ・タグ管理（モバイル版）
- [ ] オフライン対応（AsyncStorageでローカルキャッシュ）
- [ ] プッシュ通知（expo-notifications）

### 中期（少し調査が必要）
- [ ] 画像添付機能（Supabase Storage）
- [ ] マークダウンエディタ
- [ ] メモの共有機能
- [ ] ダークモード/ライトモード切り替え

### 長期（新しい技術習得が必要）
- [ ] リアルタイム同期（Supabase Realtime）
- [ ] AI要約機能（Claude API連携）
- [ ] 音声入力（Whisper API）
- [ ] App Store / Google Play公開

---

## 6. 感想・所感

> **ここに自分の感想を記入してください**

### カリキュラム全体を通して

（記入欄）




### 特に印象に残ったこと

（記入欄）




### AIツール（Claude Code、V0）を使った開発について

（記入欄）




### 今後の目標

（記入欄）




---

## 付録: 参考リンク

### 公式ドキュメント
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 参考チャット
- Phase 1-2: https://claude.ai/share/601e9fec-ae0a-4304-b5f7-8fe5178e0e4a
- Phase 4: https://claude.ai/share/e613e4cd-91a9-44a0-a2b9-217de49134c9

---

*作成日: 2026年1月27日*
