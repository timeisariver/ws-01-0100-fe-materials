# Express Web API Black-box Tests

学習者が実装した Express Web API に対して HTTP リクエストを送り、レスポンスが課題仕様を満たしているか検証する Vitest プロジェクトです。

## 参照仕様

テストは次の OpenAPI 仕様を参考にしています。

https://vws-api-spec-host.netlify.app//specs/yml?id=express-web-api

ただし、参照仕様内で Task ID の定義に不整合があります。このテストでは Task ID を UUID として扱います。

## 実行手順

学習者サーバ側で次を実行してください。

```bash
npm run db:seed
npm run dev
```

サーバが `http://localhost:3000` で起動している状態で、このテストプロジェクト側から次を実行します。

```bash
npm install
npm run test
```

テスト対象 URL はデフォルトで `http://localhost:3000/api/v1` です。別 URL を使う場合は `API_BASE_URL` で上書きできます。

```bash
API_BASE_URL=http://localhost:3001/api/v1 npm run test
```

## Seed データ契約

テストコードを正として、学習者は `npm run db:seed` で以下のデータを投入してください。

- ログイン可能なユーザー
  - email: `test@example.com`
  - password: `password`
  - username: `Test User`
  - status: `active`
- 取得可能なプロジェクト
  - slug: `programming`
  - id: UUID
- タスク一覧確認用のタスク
  - status: `scheduled` のタスクが 1 件以上

CRUD の検証対象タスクは、テスト実行中に API から作成します。
