# YouTubeチャンネルデータ分析ツール

キーワードから競合チャンネルをリサーチしてデータを抽出するツールです。

🔗 **公開URL**: https://eaval-youtube-channel-datareserch.vercel.app/

## 機能

- キーワード検索による関連チャンネルの一括取得
- 日本（JP）・韓国（KR）・アメリカ（US）の3リージョン別表示
- 登録者数・合計視聴数・動画総数・長尺/ショート比率を一覧表示
- 登録者数・視聴数・動画数でのソート＆フィルタ
- 「次の10件を取得」ページネーション

## APIキーについて

- [Google Cloud Console](https://console.cloud.google.com/) で YouTube Data API v3 を有効化し、APIキーを取得してください
- サイト内の「APIキー設定」欄に入力して保存します
- キーはブラウザの SessionStorage にのみ保存され、サーバーには送信されません

## ローカル開発

```bash
npm install
npm run dev
```

## 技術スタック

- React + Vite
- Tailwind CSS
- YouTube Data API v3
