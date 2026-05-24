# ADR-001: データ層と永続化の技術選定

## ステータス

Accepted — 2026-05-24

## 決定 / 結論

**Zustand + persist middleware** を採用する。永続化先は **AsyncStorage**（`@react-native-async-storage/async-storage`）。

採用理由の要約:

1. アプリ規模に対する適切なオーバーヘッド（Redux 系はオーバーキル、AsyncStorage 直接は不便）
2. `persist` middleware で永続化処理が 1 オプション（自前 I/O コード不要）
3. `migrate` サポートで将来のスキーマ変更（PR-6 で写真メタデータ追加など）に強い
4. TypeScript の型推論が綺麗（`create<State>()` のみで全箇所推論）
5. 学習コスト低・コード量最少
6. 軽量（~1KB gzipped）かつ active メンテナンス

## コンテキスト

「ひとさじ」アプリは、人生の残り食事回数を可視化し、しおり（一言メッセージ + 将来的に写真）を時系列に記録するアプリ。PR-2 でフォーム画面が完成し、PR-3 で以下を実装する段階に来た:

- フォーム入力 → アルバム画面への反映
- 端末ローカルストレージへの永続化（再起動・スマホ再起動でデータが残る）
- 将来的に写真追加（PR-6）も視野に入れる

このタイミングでデータ層と永続化の技術選定を決定する必要がある。

### 制約・前提

- Expo Managed Workflow（React Native）
- TypeScript（`strict: true`）
- アプリ規模: 小〜中（現状画面数 4、将来的に 10 程度を想定）
- データ規模: 数百〜数千件のしおり（テキスト + 将来は写真メタデータ）
- クラウド同期は当面なし（ローカルのみ）
- チーム: 小規模
- 「依存はミニマムに保ちたい」志向あり、ただしペイバックが明確なら追加可

### 議論の経緯

`docs/projects/001-album.md` §9 Q11/Q12 で、当初分けていた PR-3（インメモリ状態管理）と PR-4（AsyncStorage 永続化）を統合し、「データ層の設計」として一括で扱う方針に切り替えた。本 ADR はその統合スコープでの技術選定。

## 検討した選択肢

### カテゴリ A: 状態管理 + 永続化を組み合わせる方式

#### A-1. Context API + AsyncStorage（標準機能のみで自前実装）

- ✅ 依存ゼロ、React 標準のみ
- ✅ 完全に挙動を制御できる
- ❌ 初期ロード処理を自前で書く必要（loading state、JSON パース、エラー処理）
- ❌ 書き込み連動を自前（state 更新時に AsyncStorage 書き込みを忘れずに）
- ❌ マイグレーション処理を完全自前
- ❌ Provider が大きくなる、再描画範囲の管理を意識する必要

#### A-2. Zustand + persist middleware ← **採用**

- ✅ 軽量（~1KB gzipped）
- ✅ `persist` で永続化が 1 オプション、自前 I/O 不要
- ✅ `migrate` でスキーマバージョン管理可能
- ✅ TypeScript 型推論◎
- ✅ Provider 不要（store を直接 import）
- ✅ React 外（Plain JS）からもアクセス可能
- ✅ active メンテナンス、コミュニティ大
- ❌ 依存 1 つ追加

#### A-3. Jotai + atomWithStorage

- ✅ 細粒度の再描画（atom 単位）
- ✅ atomWithStorage で 1 行
- ✅ 型推論◎、active メンテナンス
- ❌ atom 設計の学習コスト
- ❌ 複数 atom を跨ぐ操作が煩雑になりがち
- ❌ 本アプリは単一エンティティ（しおりリスト）なので atom 分割の利点が薄い

#### A-4. Recoil + recoil-persist

- ✅ Meta 製、atom ベース
- ❌ 2023 以降メンテ停滞気味、Meta 内部でも縮小傾向
- ❌ 新規プロジェクトでは Jotai が代替推奨

#### A-5. Redux Toolkit + redux-persist

- ✅ エコシステム最大、Redux DevTools、ミドルウェア豊富
- ✅ 大規模アプリの定番
- ❌ アプリ規模に対して明確にオーバーキル
- ❌ ボイラープレート多（slice / action / reducer / selector）
- ❌ 学習コスト高
- ❌ バンドルサイズ大

#### A-6. MobX + mobx-persist-store

- ✅ リアクティブ、observable で自然な書き味
- ❌ OOP 寄り、関数型志向の React コミュニティでは少数派
- ❌ TypeScript 設定がやや煩雑（デコレーター等）
- ❌ 学習コスト高

#### A-7. Valtio

- ✅ proxy ベースで `state.foo = bar` の自然な書き味
- ✅ 軽量
- ❌ 永続化サポートは別途（自前で実装）
- ❌ Zustand よりコミュニティ小さい

#### A-8. TanStack Query (React Query) + persistQueryClient

- ✅ サーバー状態管理の定番、cache 永続化サポート
- ❌ 本来はサーバー API のキャッシュ用途、ローカルファースト用途には不適
- ❌ クエリキー設計など過剰な抽象化

### カテゴリ B: ストレージのみ（状態管理は React 標準 / 自前）

#### B-1. AsyncStorage 直接（各画面で `useFocusEffect` 等で読み込み）

- ✅ 依存ゼロ（AsyncStorage パッケージのみ）
- ❌ 画面ごとに loading state / JSON パース / エラー処理が重複
- ❌ 書き込み後の再読み込みトリガを各画面で書く必要
- ❌ 集約レイヤーがなく、複数画面で同じデータを参照すると整合性管理が手間
- ❌ コード量多

#### B-2. MMKV（`react-native-mmkv`）を直接

- ✅ AsyncStorage より 30 倍高速（同期 API）
- ✅ 容量無制限
- ❌ Native module（Expo Managed では config plugin が必要、セットアップ複雑）
- ❌ 本アプリのデータ量・操作頻度では速度差を体感できない
- ❌ 状態管理は別途必要

#### B-3. expo-securestore

- ✅ 暗号化保存（iOS Keychain / Android Keystore）
- ❌ しおり程度のデータには過剰、容量制限あり（iOS で約 2KB / key）

### カテゴリ C: データベース系

#### C-1. expo-sqlite

- ✅ SQL でクエリ可能、複雑なリレーションに強い、Expo 標準
- ❌ マイグレーション SQL を書く必要
- ❌ 単一エンティティ（Bookmark）のフラットなデータには明確にオーバー
- ❌ React 状態との接続レイヤー（query → state）を自前で書く必要

#### C-2. WatermelonDB

- ✅ 大規模データに強い、reactive、同期サポート
- ❌ セットアップ重い、設定ファイル多数
- ❌ Expo Managed では部分的対応のみ
- ❌ 本アプリ規模に対して明確にオーバーキル

#### C-3. Realm（MongoDB Realm / Atlas Device SDK）

- ✅ オブジェクト DB、複雑な構造に向く、同期サポート
- ❌ Expo Managed では使えない（Bare workflow 必要）
- ❌ サイズ大、本アプリ規模に対してオーバーキル

#### C-4. Drizzle ORM + expo-sqlite

- ✅ TypeScript-first ORM、型安全
- ❌ ORM 学習コスト
- ❌ 本アプリのフラットなデータ構造には不要

## 比較表

| # | 選択肢 | 依存 | 学習 | コード量 | 型安全 | 永続化 | migrate | RN/Expo | メンテ | 本アプリ規模適合 |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| A-1 | Context + AsyncStorage | なし | 低 | 多 | ○ | 自前 | 自前 | ◎ | - | ○ |
| **A-2** | **Zustand + persist** | **軽量** | **低** | **少** | **◎** | **1 オプション** | **サポート** | **◎** | **◎** | **◎** |
| A-3 | Jotai + atomWithStorage | 軽量 | 中 | 少 | ◎ | atom 単位 | △ | ◎ | ◎ | ○ |
| A-4 | Recoil + recoil-persist | 中 | 中 | 中 | ○ | サポート | △ | ○ | △ 停滞 | △ |
| A-5 | Redux Toolkit + redux-persist | 大 | 高 | 多 | ◎ | サポート | サポート | ◎ | ◎ | × オーバー |
| A-6 | MobX + persist-store | 中 | 高 | 中 | ○ | サポート | 自前 | ◎ | ○ | △ |
| A-7 | Valtio | 軽量 | 中 | 少 | ○ | 別途 | 自前 | ◎ | ○ | ○ |
| A-8 | TanStack Query + persistQueryClient | 中 | 中 | 中 | ◎ | サポート | 自前 | ◎ | ◎ | × 用途違い |
| B-1 | AsyncStorage 直接 | なし | 低 | 多 | △ | - | 自前 | ◎ | ◎ | △ |
| B-2 | MMKV 直接 | native | 中 | 多 | △ | - | 自前 | △ Bare 寄り | ◎ | △ |
| B-3 | expo-securestore | 軽量 | 低 | 多 | △ | - | 自前 | ◎ | ◎ | × 容量・用途違い |
| C-1 | expo-sqlite | なし | 中 | 多 | ○ | SQL | SQL | ◎ | ◎ | × オーバー |
| C-2 | WatermelonDB | 大 | 高 | 多 | ◎ | サポート | サポート | △ | ◎ | × オーバー |
| C-3 | Realm | 大 | 高 | 多 | ◎ | サポート | サポート | × Bare | ◎ | × Expo Managed 不可 |
| C-4 | Drizzle + expo-sqlite | 中 | 中 | 多 | ◎ | SQL | サポート | ◎ | ◎ | × オーバー |

## 結論の根拠

### A-2 Zustand + persist を選んだ詳細

1. **アプリ規模との整合**: 小〜中規模で「データ層 1 つ」の設計には最も適している。Redux 系のボイラープレートが不要で、Context の自前 I/O コードも不要
2. **永続化のシンプルさ**: `persist(initializer, { storage })` で完結。AsyncStorage を storage として渡すだけ
3. **マイグレーション**: `version` と `migrate` オプションで明示的にスキーマ管理。PR-6 で `Bookmark.photoUri?` を追加する時、v1 → v2 を 1 関数で記述可能
4. **TypeScript 型推論**: `create<State>()` のジェネリックを 1 回書くだけで、以降の selector や set/get の型が全自動推論
5. **学習コスト**: API がシンプル（create + selector + set）。新規メンバーが短時間で読める
6. **メンテナンス**: GitHub stars 50k+、頻繁なリリース、React Native 公式対応
7. **将来拡張**: 別エンティティ（設定、写真メタデータ）が増えても同じパターンで store を追加できる
8. **テスト容易性**: store は React 外でも import 可能、ユニットテストが書きやすい

### 代替案を採用しなかった理由

#### Context + AsyncStorage（A-1）

- 永続化 I/O（初期ロード・書き込み・loading・エラー）を自前で書く必要
- マイグレーションも完全自前。PR-6 で写真追加時に複雑化する懸念
- 「依存ゼロ」の利点は、Zustand の ~1KB を惜しむ価値なし

#### Jotai（A-3）

- atom ベースの柔軟性は魅力だが、本アプリの単一エンティティ（`Bookmark[]`）には細かすぎる
- 「リストを atom にする」と複数 atom を跨ぐ操作が煩雑

#### 重厚なライブラリ（Redux, MobX, Realm, WatermelonDB）

- アプリ規模に対して明確にオーバーキル
- データ構造はフラットなリストで、リレーショナル / オブジェクト DB の機能を必要としない
- レビュー負荷・ボイラープレートが増えるデメリットが大きい

#### MMKV（B-2）

- 速度メリットは本アプリのデータ量では体感できない
- Expo Managed でのセットアップが複雑（config plugin 必要）

#### AsyncStorage 直接（B-1）

- 画面ごとに loading / JSON パース / エラー処理を書く重複
- 書き込み後の再読み込みトリガ管理が煩雑
- 「データ層」という集約レイヤーがなく、画面間の整合性管理が分散する

## 影響

### 直接的な影響（PR-3 で発生）

- `lib/store/bookmarks.ts`（仮）に Zustand store を定義
- `useBookmarks()` のような hook で各画面（フォーム/アルバム）からアクセス
- AsyncStorage 経由で再起動後もデータ保持
- `Bookmark` 型を共通モジュール（`lib/types.ts` 等）に切り出す

### 依存追加

- `zustand`（~1KB gzipped）
- `@react-native-async-storage/async-storage`（AsyncStorage の公式 React Native 実装、Expo SDK と互換）

### バンドルサイズへの影響

- 数 KB 程度の増加（影響軽微）

### 将来への影響

- **PR-6 写真追加時**: `Bookmark.photoUri?: string` を追加し、`persist` の `migrate` で v1 → v2 移行
- **データ規模が大きくなった場合**（数万件以上の想定外シナリオ）: SQLite + Drizzle 等への移行余地あり。Zustand store の API を維持したまま内部実装を差し替え可能
- **クラウド同期が必要になった場合**: Zustand store を維持しつつ、同期レイヤー（Firestore / TanStack Query / 自前 sync）を追加可能。データ層と同期層を分離できる

## 参考

- [Zustand 公式](https://github.com/pmndrs/zustand)
- [Zustand persist middleware](https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md)
- [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)
- [docs/projects/001-album.md §9 Q11/Q12](../../projects/001-album.md)（本決定に至る議論の経緯）
