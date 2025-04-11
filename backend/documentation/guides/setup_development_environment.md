# backend 開発環境構築手順

### 手順

1. DB稼働・初期化
    1. DB起動
        ```bash
        docker-compose -f docker-compose.db.yml up mysql -d
        ```

    1. 起動確認後、DB初期化
        ```bash
        docker-compose -f docker-compose.db.yml up initdb
        ```

1. API稼働
    1. `env` ファイル準備
        - `.env.local` を `.env` としてコピーした後、必要な値を変更する
            | 変数名                                  | 詳細                                                                    | 使用環境   |
            | --------------------------------------- | ----------------------------------------------------------------------- | -------- |
            | FASTIFY_LOG_LEVEL                       | Fastify ログレベル                                                      |          |
            | FASTIFY_WATCH                           | ディレクトリの変更が発生すると、プロセスは自動的にリロードされます。          |         |
            | FASTIFY_IGNORE_WATCH                    | 指定されたファイルまたはディレクトリへの変更を無視します。                   |          |
            | FRONTEND_ADDR                           | frontend の URL                                                         |          |
            | EHV_CORE_SERVER_PUBLIC_URL              | API の URL                                                              |          |
            | EHV_CORE_SERVER_PORT                    | API ポート番号                                                          |          |
            | EHV_CORE_SERVER_HOST                    | API ホスト                                                              |          |
            | EHV_CORE_DB_ADAPTER                     | DB Adapter                                                              |          |
            | EHV_CORE_MYSQL_DATABASE                 | DB データベース名                                                       |          |
            | EHV_CORE_MYSQL_USER                     | DB ユーザー名                                                           | ローカル |
            | EHV_CORE_MYSQL_PASSWORD                 | DB パスワード                                                           | ローカル |
            | EHV_CORE_MYSQL_HOST                     | DB ホスト                                                               |          |
            | EHV_CORE_MYSQL_PORT                     | DB ポート番号                                                           |          |
            | VAULT_ADDR                              | vault の接続 URL                                                        | クラウド |
            | VAULT_ROLE_ARN                          | vault の RoleArn                                                        | クラウド |
            | VAULT_SKIP_VERIFY                       | 証明書の検証を行わない                                                    | クラウド |
            | VAULT_DB_CREDENTIALS_PATH               | vault の DB クレデンシャルのパス                                        | クラウド |
            | CESIUM_ION_API_URL                      | Cesium ION の REST API URL                                              |          |
            | CESIUM_ION_ACCESS_TOKEN                 | Cesium ION のアクセストークン                                           |          |
            | WEBSOCKET_URL                           | Websocket の URL                                                        |          |
            | WEBSOCKET_TIMEOUT                       | Websocket のタイムアウト時間(秒)                                        |          |
            | GEOSPACE_URL                            | GEOSPACE CDS の URL                                                     |          |
            | GEOSPACE_ADDRESS                        | GEOSPACE CDS 住所検索の URL                                             |          |
            | GEOSPACE_ID                             | GEOSPACE CDS のユーザ ID                                                |          |
            | GEOSPACE_PASSWORD                       | GEOSPACE CDS のユーザパスワード                                         |          |
            | GEOSPACE_CRYPTO_KEY                     | GEOSPACE 向け暗号キー（ランダム 32 文字を BASE64 化）                   |          |
            | LOCAL_TOKEN                             | ダミーの認証用 Cognito ID トークン                                      | ローカル |
            | ASSET_REGISTERABLE_NUM                  | 一企業が登アセット登録可能な上限数                                       |          |
            | ASSET_AVAILABLE_TIME                    | CesiumIonアセット変換が失敗したと判断するための経過時間をUnixTimeで指定    |          |
            | ASSET_SYSTEM_USER_ID                    | バッチでDB更新した場合に更新者へセットするユーザー名                       |          |
            | FILE_UPLOAD_MAX_SIZE                    | アップロード可能なファイルの最大サイズ                                  |          |
            | S3_ACCESS_KEY_ID_B2                     | B2 向け S3 バケットの IAM ユーザーのアクセスキー                        |          |
            | S3_SECRET_ACCESS_KEY_B2                 | B2 向け S3 バケットの IAM ユーザーのシークレットキー                    |          |
            | S3_SESSION_TOKEN_B2                     | B2 向け S3 バケットの IAM ユーザーのセッショントークン                  |          |
            | S3_BUCKET_B2                            | B2 向け S3 バケット名                                                 |          |
            | S3_PREFIX_B2_CONVERT_TOOL_OUTPUT        | B2 向け セグメント変換ツール出力プレフィックス                           |          |
            | S3_PREFIX_B2_TILE_AFTER_APPROVAL        | B2 向け CityGML連携入力プレフィックス                                   |          |
            | S3_PREFIX_B2_SPACE_BEFORE_APPROVAL      | B2 向け 承認前空間ID連携入力プレフィックス                               |          |
            | S3_PREFIX_B2_SPACE_AFTER_APPROVAL       | B2 向け 承認後空間ID連携入力プレフィックス                               |          |
            | S3_ACCESS_KEY_ID_EHV                    | EHV 向け S3 バケットの IAM ユーザーのアクセスキー                       |          |
            | S3_SECRET_ACCESS_KEY_EHV                | EHV 向け S3 バケットの IAM ユーザーのシークレットキー                   |          |
            | S3_SESSION_TOKEN_EHV                    | EHV 向け S3 バケットの IAM ユーザーのセッショントークン                 |          |
            | S3_BUCKET_EHV                           | EHV 向け S3 バケット名                                                |          |
            | S3_PREFIX_EHV_CONVERT_TOOL_INPUT        | 3DV 向け セグメント変換ツール入力プレフィックス                          |          |
            | S3_PREFIX_EHV_CONVERT_TOOL_ERROR        | 3DV 向け セグメント変換ツールエラー出力プレフィックス                    |          |
            | S3_PREFIX_EHV_LAS_INPUT                 | 3DV 向け LAS入力プレフィックス                                         |          |
            | S3_PREFIX_EHV_LAS_ERROR                 | 3DV 向け LAS CesiumIon 変換エラー出力プレフィックス                     |          |
            | S3_PREFIX_EHV_CITY_GML_INPUT            | 3DV 向け CityGML入力プレフィックス                                     |          |
            | S3_PREFIX_EHV_CITY_GML_ERROR            | 3DV 向け CityGML CesiumIon 変換エラー出力プレフィックス                 |          |
            | S3_PREFIX_EHV_SPACE_INFO_BE_INPUT       | 3DV 向け 承認前空間ID入力プレフィックス                                 |          |
            | S3_PREFIX_EHV_SPACE_INFO_AF_INPUT       | 3DV 向け 承認後空間ID入力プレフィックス                                 |          |
            | S3_PREFIX_EHV_SPACE_INFO_BE_ERROR       | 3DV 向け 承認前空間ID CesiumIon 変換エラー出力プレフィックス             |          |
            | S3_PREFIX_EHV_SPACE_INFO_AF_ERROR       | 3DV 向け 承認後空間ID CesiumIon 変換エラー出力プレフィックス             |          |
            | S3_ACCESS_KEY_ID_VS_INPUT               | ウイルスチェック入力向け S3 バケットの IAM ユーザーのアクセスキー         |          |
            | S3_SECRET_ACCESS_KEY_VS_INPUT           | ウイルスチェック入力向け S3 バケットの IAM ユーザーのシークレットキー     |          |
            | S3_SESSION_TOKEN_VS_INPUT               | ウイルスチェック入力向け S3 バケットの IAM ユーザーのセッショントークン   |          |
            | S3_BUCKET_VS_INPUT                      | ウイルスチェック入力向け S3 バケット名                                 |          |
            | S3_PREFIX_VS_INPUT                      | ウイルスチェック入力向け LASアップロードファイル入力プレフィックス       |          |
            | S3_ACCESS_KEY_ID_VS_RESULT_OK           | ウイルスチェック OK 向け S3 バケットの IAM ユーザーのアクセスキー       |          |
            | S3_SECRET_ACCESS_KEY_VS_RESULT_OK       | ウイルスチェック OK 向け S3 バケットの IAM ユーザーのシークレットキー   |          |
            | S3_SESSION_TOKEN_VS_RESULT_OK           | ウイルスチェック OK 向け S3 バケットの IAM ユーザーのセッショントークン |          |
            | S3_BUCKET_VS_RESULT_OK                  | ウイルスチェック OK 向け S3 バケット名                               |          |
            | S3_PREFIX_VS_RESULT_OK                  | ウィルスチェック OK 向け LASファイル出力プレフィックス                |          |
            | S3_ACCESS_KEY_ID_VS_RESULT_NG           | ウイルスチェック NG 向け S3 バケットの IAM ユーザーのアクセスキー       |          |
            | S3_SECRET_ACCESS_KEY_VS_RESULT_NG       | ウイルスチェック NG 向け S3 バケットの IAM ユーザーのシークレットキー   |          |
            | S3_SESSION_TOKEN_VS_RESULT_NG           | ウイルスチェック NG 向け S3 バケットの IAM ユーザーのセッショントークン |          |
            | S3_BUCKET_VS_RESULT_NG                  | ウイルスチェック NG 向け S3 バケット名                               |          |
            | S3_PREFIX_VS_RESULT_NG                  | ウィルスチェック NG 向け LASファイル出力プレフィックス                 |          |
            | STS_REGION                              | S3 向けの STS リージョン                                                |          |
            | STS_ROLE_ARN                            | S3 向けの STS RoleArn                                                   |          |
            | STS_DURATION                            | S3 向けの認証期限(秒)                                                   |          |
            | VIEW_API_DOCUMENT                       | Swagger ドキュメントを公開するか否か                                      |          |
            | SITE_MULTIPLE_DATA_DELETE_REQUEST_LIMIT | 一企業がアセット一括削除を行える上限数                                     |          |

    1. API起動
        - コンテナ起動
          ```bash
          docker-compose up -d
          ```

        - ブラウザ上で以下確認
          ```bash
          http://localhost:3001/status
          ```
        - `{"status":"OK"}` と表示されることを確認

    1. コンテナ内へのアクセス
        ```
        docker exec -it ehv-api bash
        ```

1. 開発データ投入
    1. 以下のコマンドを実行
        ```bash
        docker-compose exec api npm run db:init
        ``` 
        ※`backend\fixtures\initial-data`配下のデータが投入される

### [補足] DBの初期化
- DB初期化
  ```bash
  docker-compose -f docker-compose.db.yml up initdb
  ```

- 開発データを投入
  ```bash
  docker-compose exec api npm run db:init
  ``` 

### [補足] 再ビルドについて
- dockerイメージの再ビルドが必要な場合は下記コマンドを実行
  ```bash
  docker-compose up -d --build
  ```

## [補足] ユニットテスト(specファイル)実行方法
1. 事前準備
    1. コンテナ内へのアクセス
        ```
        docker exec -it ehv-api bash
        ```

    1. cross-env をインストール
        ```bash
        npm install -g cross-env
        ```

    1. 一時的に`.env`のDB名を変更
        ```
        EHV_CORE_MYSQL_DATABASE=ut_ehv_api
        ```

    1. テスト向け DB 作成
        ```bash
        npm run mysql:init
        ```

    1. `.env`のDB名を元に戻す
        ```
        EHV_CORE_MYSQL_DATABASE=ehv_api
        ```

1. specファイルを実行する
    ```bash
    docker-compose exec api npm run test.cross
    ```  
    ※全specが実行される

1. specファイルを単一実行するための設定  
    - 設定例を参考にコマンドを追加する
        - 設定例
          ```
          "test.create": "cross-env NODE_NO_WARNINGS=1 NODE_ENV=test tap --timeout=180 --jobs=1 app/assets/routes/create.cloud.spec.js --no-cov"
          ```

        - 実行
          ```
          npm run test.create
          ```

    - タイムアウト設定
      ```
      -t<n> --timeout=<n>
      ```  
      ※timeout制限をしない場合、「--timeout=0」を設定する

以上。