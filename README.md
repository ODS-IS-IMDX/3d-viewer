# 概要

本リポジトリでは、下記の機能を提供します。

| 機能名                 | 機能概要                                                                    |
| ---------------------- | --------------------------------------------------------------------------- |
| 認証認可機能           | AWS の Cognito 認証によりログインし、アクセス権管理を行う。                 |
| データアップロード機能 | データ（点群データ）のアップロードを行う。                                  |
| データ変換確認機能     | データ変換に関する機能。                                                    |
| ビューア機能           | 点群データ、3D データ、空間 ID データの可視化と、データの検索、計測を行う。 |
| マップ設定機能         | GeoSpace CDS の設定機能、住所検索機能と地形表示機能を設定する。             |

# リポジトリ概要

本リポジトリは **frontend**, **backend**, **tools** に分かれています。
それぞれのリポジトリの概要を記載します。

## frontend

3Dビューアのフロントエンド部分を担っています。

### 利用 OSS 一覧

本アプリケーションを利用するにあたり、OSS をインストールする必要があります。
インストールされる OSS は package.json に記述され、自動でインストールされます。
代表的な OSS を下記に記載します。

| ライブラリ名 | バージョン | ライセンス  |
| ------------ | ---------- | ----------- |
| Node.js      | v20.17.0   | MIT License |
| React.js     | 16.14.0    | MIT License |
| Redux        | 4.2.1      | MIT License |
| CesiumJS     | 1.126.0    | Apache License, Version 2.0 |

### 再配布 OSS 一覧

本アプリケーション内に内包され、再配布されるアプリケーション一覧を下記に記載します。

| ライブラリ名   | バージョン | ライセンス  |
| -------------- | ---------- | ----------- |
| react-scripts  | 3.4.4      | MIT License |
| unit-converter | 1.0.7      | ISC License |
| geo-util       | 1.1.8      | ISC License |

### ビルド方法

ビルド方法は以下の手順で実施してください。  
[frontend 開発環境構築手順](./frontend/documentation/manuals/manual-local-dev.md)

## backend

3Dビューアの API 部分を担っています。

### 利用 OSS 一覧

本アプリケーションを利用するにあたり、OSS をインストールする必要があります。
インストールされる OSS は package.json に記述され、自動でインストールされます。
代表的な OSS を下記に記載します。

| ライブラリ名       | バージョン | ライセンス  |
| ------------------ | ---------- | ----------- |
| Node.js            | v20.17.0   | MIT License |
| Fastify            | 4.28.1     | MIT License |
| MySQL              | 2.18.1     | MIT License |
| jwks-rsa           | 1.12.3     | MIT License |
| jwt-decode         | 4.0.0      | MIT License |
| @aws-sdk/client-s3 | 3.651.1    | Apache License, Version 2.0  |
| websocket          | 1.0.35     | Apache License, Version 2.0  |

### ビルド方法

ビルド方法は以下の手順で実施してください。  
[backend 開発環境構築手順](./backend/documentation/guides/setup_development_environment.md)

## tools

3Dビューアの機能には含まれないが、運用上必要なものを tools 配下に保存しています。

| tool 名          | 概要                                                           |
| ---------------- | -------------------------------------------------------------- |
| default-location | 3Dビューアの初期座標を緯度経度から必要な形式に変換するツール。 |
