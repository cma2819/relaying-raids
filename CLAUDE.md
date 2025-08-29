# Relaying Raids

Twitchリレー企画管理システム。React Router v7 + Cloudflare Workers + D1で構築。

## プロジェクト構成

```
├── app/                   # React Router アプリケーション
│   ├── .server/           # サーバーサイドロジック (React Router v7 Server module)
│   ├── routes/            # Route Modules
│   ├── common/            # 共通コンポーネント・ユーティリティ
│   ├── events/            # イベント関連コンポーネント
│   ├── menu/              # メニューコンポーネント
│   ├── twitch/            # Twitch UI コンポーネント
├── shared/                # 共通型定義
│   ├── services/          # 外部API連携
│   └── types/             # TypeScript型定義
├── workers/               # Cloudflare Workers エントリーポイント
├── database/              # データベーススキーマ
├── migrations/            # データベースマイグレーション
└── drizzle/               # Drizzle ORM生成ファイル
```

## ユビキタス言語

|和名|英名|説明|
|:--|:--|:--|
|リレーイベント|Relay Event|レイドで配信をつなぐイベントのこと。短く「リレー」とも。|
|スラグ|slug|識別子になる判読可能な文字列。アプリケーション内では和名での表現はしない。スラグの入力においては、URLに使われる識別子として入力させること。|

## 主な技術スタック

- **フロントエンド**: React 19, React Router v7
- **バックエンド**: Cloudflare Workers
- **データベース**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **認証**: Twitch OAuth (remix-auth)
- **スタイリング**: Tailwind CSS, Mantine UI
- **言語**: TypeScript

## 開発コマンド

### 開発サーバーの起動

```bash
npm run dev
```

### デプロイ

手動で実行されるべきコマンドです。Claude は絶対に実行しないでください。

```bash
npm run build

npm run deploy

```

### Drizzle 生成

`database/schema.ts` を変更した場合は常に実行してください。

```bash
npm run db:generate
```

### linter / 型チェック

.ts, .tsx ファイルを変更した場合は、以下のコマンドを最後に実行してください。 lint エラーがあるときは修正してください。

```bash
# 型チェック
npm run typecheck

# linter
npm run lint:fix
```

修正可能なエラーは修正してください。


## 認証システム

- Twitch OAuthを使用したユーザー認証
- セッション管理はCookieベース
- `.server/auth/` でAuthenticatorとTwitchStrategyを管理

## データベース

- Cloudflare D1 (SQLite)を使用
- Drizzle ORMでスキーマ管理
- リレー企画とその参加者情報を管理

## 環境変数

```
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
TWITCH_REDIRECT_URI=
APPLICATION_SECRET=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_D1_ID=
CLOUDFLARE_TOKEN=
```

## コーディングルール

### TypeScript

- any型を使うことは禁止です。必要な型を定義するか、依存関係を表現するために型を参照してください。新しく型を定義するか、既存の型を参照するか悩んだときは指示を仰いでください。
- 不要なインポートは必ず消してください。

### React Router Framework

- React Router の標準に従い、基本は `Form` の submit による server action を利用してください。
- Action が成功した場合は結果をフィードバックできるページへのリダイレクトを行ってください。
- Action が失敗した場合はエラーを表現する JSON を返してください。ページ側では返ってきた ActionData 内のエラーに基づいてエラー表示するように実装してください。

#### Route Modules

Routes Modules の実装では以下を遵守してください。

- 関数の引数の型定義には、React Router が生成する型定義 `Route.*` を使ってください。
- Route Modules 内のコンポーネントの引数にも `Route.ComponentProps` を必ず使ってください。

### Styling

- 原則、 `styles` プロパティを指定することによるスタイリングは禁止です。Tailwind CSS を用いた、class によるスタイルで実装してください。
- Tailwind では要件を実現できない場合は、計画を提出して指示を仰いでください。

### コメント

- コードコメントは指示があった場合のみ残してください。我々のレビューのためにコメントを一時的に生成することは許容しますが、最終的に生成したコードコメントを消してください。
- 既存のコードコメントを許可なく消さないでください。
