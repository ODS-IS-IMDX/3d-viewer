# frontend 開発環境構築手順

3Dビューア のフロントエンド部分のローカル開発環境を準備するための手順です。開発環境を構築した Docker コンテナを実行し、そのコンテナ内でビルドを行います。

## 事前の準備

### WSL2 環境の構築

本環境を Windows 上で快適に動作させるには、WSL2 上で動作させることを強く推奨します。WSL 環境は Ubuntu の使用を推奨します。
Docker に関しては、すでに Docker Desktop がインストールされているのであれば、Docker Desktop を使用しても問題ありません。

### Docker の使用メモリ上限設定

Docker Desktop や WSL2 上で Docker を使用する際、メモリを使用しすぎて PC の動作が重くなることがあります。これを回避するために、WSL2 で使用するメモリ上限を設定します。

`C:\Users\ユーザ名\`直下に以下の内容の`.wslconfig`を作成し、Docker Desktop もしくは WSL2 の再起動を行います。

```
[wsl2]
memory=8GB # 自身のPCのメモリの50%を指定
swap=0
```

### VSCode の設定

推奨拡張機能をインストールします。

- VSCode で StandardJS、Flow Language Support が動作しない原因
  - StandardJS、Flow Language Support は npm のパッケージに依存しているため

### Chrome の設定

1. 拡張機能をインストールする
   - [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ja)
   - [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=ja)

## 開発環境の構築とビルドの手順

### API のビルドと起動

以下リンクに記載してある手順で 3Dビューア の API を起動します。

[backend 開発環境構築手順](../../../backend/documentation/guides/setup_development_environment.md)

### フロントエンドのビルドと起動

1. 作業フォルダに各種ファイルを作成する

   1. ソースコードを作業フォルダに保存する
   2. 環境変数ファイルを作成する
      - `.env.development.local` を `.env.dev.local` にコピーする
      - 状況に応じて値を変更する
        | 変数名 | 詳細 |
        | ---- | ------------------------------ |
        | NODE_PATH | フロント資源のノードパス |
        | REACT_APP_PUBLIC_URL | 本アプリの URL |
        | REACT_APP_DATAHUB_SERVER_URL | API サーバーの URL |
        | REACT_APP_DATAHUB_WEB_SOCKET_SERVER_URL | WEB SOCKET サーバーの URL |
        | REACT_APP_CESIUM_ION_SERVER | Cesium Ion の URL |
        | REACT_APP_TERMS_OF_SERVICE_URL | 利用規約の URL (空欄時は利用規約のリンク非表示) |
        | REACT_APP_BASE_TERRAIN_CWT_ID | 地形データ Cesium World Terrain の assetID |
        | REACT_APP_BASE_TERRAIN_GIS_ID | 地形データ 国土地理院地形 の assetID |
        | REACT_APP_GSI_APPROVAL_NUMBER | 国土地理院承認番号 (空欄時は国土地理院承認番号非表示) |
        | REACT_APP_DEBUG | コンソールログにデバッグ用ログを出力するためのフラグ |

2. Docker イメージをビルドし、コンテナを起動する

   ```bash
   $ docker-compose up
   ```

3. 完了するまでしばらく待つ（約 5 分）

   以下のメッセージが表示されればビルド完了

   ```bash
   ・・・
   dev_1       | @ehv/datahub-viewer: You can now view @ehv/datahub-viewer in the browser.
   dev_1       | @ehv/datahub-viewer:   Local:            http://localhost:3000/
   dev_1       | @ehv/datahub-viewer:   On Your Network:  http://172.28.0.2:3000/
   dev_1       | @ehv/datahub-viewer: Note that the development build is not optimized.
   dev_1       | @ehv/datahub-viewer: To create a production build, use npm run build.
   dev_1       | @ehv/datahub-viewer: Compiling...
   dev_1       | @ehv/datahub-viewer: Compiled successfully!
   ```

4. ブラウザで 3Dビューア を起動する

   1. 各企業ページの URL を直接入力する http://localhost:3000/site/xxxx

※ npm モジュールを追加した場合などで再ビルドが必要な場合は以下の手順で実施する

```bash
$ docker-compose down -v
$ docker-compose up --build
```
