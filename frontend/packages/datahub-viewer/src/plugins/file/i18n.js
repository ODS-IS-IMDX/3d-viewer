// Copyright (c) 2025 NTT InfraNet
export const i18n = {
  en: {
    sideMenuButton: {
      tooltip: 'asset'
    },
    menu: {
      add: 'Add File'
    },
    fileDeleteModal: {
      confirmMessage: 'Delete this file?'
    },
    fileListModal: {
      tooLongNameMessage:
        'This file name is too long (Please change within 100 characters)',
      overSizeWldFileMessage:
        'The image with world file size should be 2GB or less',
      overSizeVideoFileMessage: 'Video file size should be 1GB or less',
      hasTooLongNameMessage: 'Contains file whose name is too long.',
      buttonLabel: {
        cancel: 'Cancel',
        input: 'Input',
        upload: 'Upload',
        multiRegister: 'Batch Input'
      },
      deleteConfirm: {
        message: 'Do you want to delete this file?'
      },
      info: {
        isNotAllowed: 'This file can not be uploaded',
        isNotHaveInfo: 'Not input',
        'blackboard-internal': 'Blackboard',
        designFile: 'Design File',
        imagery: 'Imagery File',
        model3d: '3D Model',
        overlay: 'Overlay',
        picture: 'picture',
        video: 'video',
        topography: 'Topography File',
        projection: 'Coordinate System: ',
        verticalProjection: 'Vertical Coordinate System: ',
        flipXY: 'Coordinate Data Format: ',
        invertXY: 'Invert Coordinate Type: ',
        flipTexture: 'Flip Texture Type: ',
        locationInfo: 'Location Info: ',
        lat: 'Latitude',
        lon: 'Longitude',
        hsl: 'Elevation',
        ellipsoidHeight: 'Ellipsoid height',
        heading: 'Heading',
        pitch: 'Pitch',
        roll: 'Roll',
        startDateTime: 'Data Start Date: ',
        endDateTime: 'Data End Date: ',
        displayName: 'Display name: ',
        remarks: 'remarks: (Have remarks)'
      },
      title: 'Upload File List',
      cautionText:
        'This site is published.\nPlease upload after confirming whether the asset can be shared.'
    },
    fileInputModal: {
      cancelButtonLabel: 'Cancel',
      dropMessage: {
        main: 'Drag and drop files here',
        sub: 'Or',
        selectFile: 'Select files',
        selectFolder: 'Select a folder',
        selectCloud: 'Select from cloud'
      },
      title: 'Upload Files',
      tooltip: 'You can upload files'
    },
    fileRegisterModal: {
      buttonLabel: {
        cancel: 'Cancel',
        input: 'Input'
      },
      optionLabel: {
        extensionDefault: 'Please select a file extension',
        categoryDefault: 'Please select a file category',
        designFile: 'Design File',
        imagery: 'Imagery File',
        model3d: '3D Model',
        overlay: 'Overlay',
        picture: 'picture',
        topography: 'Topography File',
        formatTypeDefault: 'Please select a file format type',
        flipXYDefault: 'Please select a coordinate data format',
        invertXYDefault: 'Please select a invert coordinate type',
        flipTextureDefault: 'Please select a flip texture type ',
        projectionDefault: 'Use the coordinate system set in the asset data',
        verticalProjectionDefault: '-',
        baseTerrainDefault: 'Japan Reference Terrain',
        baseTerrainCWT: 'Cesium World Terrain',
        video: 'Video'
      },
      selectLabel: {
        addTerrain: 'Select whether to register as terrain data',
        extension: 'Select a file extension',
        category: 'Select a file category',
        formatType: 'Select a file format type',
        formatTypeTooltip: {
          prefix: '(If SHAPE file(s) not working properly, please ',
          linkText: 'click here',
          suffix: ' to select the correct coordinate system'
        },
        flipXY: 'Select a coordinate data format',
        invertXY: 'Select whether to invert a coordinate type',
        invertXYNotInvert: 'Not Invert',
        invertXYInvert: 'Invert',
        invertXYTooltip:
          'Select "Invert" when creating data using Autodesk Navisworks(R)',
        flipTexture: 'Select whether to flip a texture type',
        flipTextureFalse: 'Not Flip',
        flipTextureTrue: 'Flip',
        flipTextureTooltip:
          'Please select "Flip" when creating data using Autodesk Infraworks(R). Please refer to the <0>Manual</0> for how to create data',
        projection: 'Select a coordinate system',
        projectionWarning: ' *(Please input a number between 1024-32767)',
        verticalProjection: 'Select a vertical coordinate system',
        timePeriod: 'Select data period',
        baseTerrain: 'Select base terrain'
      },
      addTerrain: {
        options: {
          isNotTerrain: 'Do not register as terrain data',
          isTerrain: 'Register as terrain data'
        }
      },
      cellSpacingInput: {
        label: 'Input search range (m)'
      },
      locationInfoInput: {
        label: {
          title: 'Input Location Info',
          lat: {
            decimal: 'Latitude(Decimal)',
            degree: 'Latitude(Degree)',
            minute: 'Latitude(Minute)',
            second: 'Latitude(Second)'
          },
          lon: {
            decimal: 'Longitude(Decimal)',
            degree: 'Longitude(Degree)',
            minute: 'Longitude(Minute)',
            second: 'Longitude(Second)'
          },
          hsl: 'Elevation(Decimal)',
          ellipsoidHeight: 'Ellipsoid height(Decimal)',
          heading: 'Heading(-180°~180°)',
          pitch: 'Pitch(-180°~180°)',
          roll: 'Roll(-180°~180°)'
        },
        type: {
          decimal: 'Decimal Type',
          dms: 'DMS Type',
          selectInMap: 'Select In Map'
        }
      },
      remarksInput: {
        label: 'Input remarks'
      },
      displayNameInput: {
        label: 'Input display name'
      },
      title: 'Input',
      videoCodecTiipsText:
        'The codec supports at least H.264\nPlease refer to the link below for other codecs.\n',
      codecURL:
        'https://developer.mozilla.org/ja/docs/Web/Media/Formats/Video_codecs',
      jsonPathName: 'Json Path and Name'
    },
    fileFromCloudModal: {
      title: 'Select from Cloud',
      search: {
        placeholder: 'Search'
      },
      buttonLabel: {
        add: 'Add',
        cancel: 'Cancel'
      },
      columns: {
        name: 'name'
      }
    },
    fileNumberPanel: {
      tiling: 'Tiling: ',
      uploading: 'Uploading: ',
      error: 'Error: '
    },
    fileProgressModal: {
      buttonLabel: 'Cancel',
      thisFileIsCancelledUpload: 'This file has been cancelled',
      thisFileIsWaitingUpload: 'Waiting for uploading',
      thisFileIsUploading: 'Uploading',
      thisFileHasFinishedUpload: 'Uploading is finishing',
      thisFileIsTiling: 'Tiling data',
      thisFileIsWaitingTile: 'Waiting for tiling data',
      thisFileIsTilingCancelable:
        'Tiling data (Tiling does not complete even after a long time, delete is enabled)',
      thisFileIsWaitingDelete:
        'A tiling error has occurred. Please check the file',
      title: 'Uploading / Tiling file list'
    },
    mobileFileUploadModal: {
      title: 'Upload Files',
      fileInputLabel: 'Add Files',
      settingLat: 'Latitude(By setting): ',
      settingLon: 'Longitude(By setting): ',
      settingHsl: 'Elevation(By setting): ',
      inputFormat: 'Input Format: ',
      decimal: 'Decimal Type',
      dms: 'DMS type',
      selectInMap: 'Select In Map',
      caution1:
        'If using iPhone,\nplease make this setting change\n[Setting] -> [Camera] -> [Format] -> [Most Compatible]',
      caution2: 'Only image can be upload in mobile version',
      uploadButtonEnableLabel: 'Upload',
      uploadButtonDisableLabel: 'Preparing files...'
    },
    notification: {
      assetUploadValidationFailed: 'Invalid file setting',
      assetUploadNotFound: 'Failed to upload the file\nPlease upload again',
      assetUploadNotFoundBucketId: "Please check the Jobsite Setting's role",
      assetUploadUnSupportedZip: 'Unsupported ZIP file',
      assetUploadNotFoundTilesetJson:
        'Please check the tilesetjson in ZIP file',
      assetUploadLimit: 'The number of assets exceeds the upload limit',
      assetUploadAnotherUser: 'File with the same name already exists',
      assetUploadErrorS3Upload:
        'Failed to upload the file\nPlease upload again',
      assetUploadErrorFileConvert:
        'The uploaded file is incorrect\nPlease upload again',
      assetDeleteErrorPermissionRequired:
        'Failed to delete asset\nJobsite Setting permissions\nrequired for the operation',
      blackboardUploadAnotherUserMessage:
        'File with the same name already exists',
      blackboardUploadFailedMessage: 'Failed to upload',
      videoUploadLimitMessage:
        'The number of video registrations has reached the limit',
      badRequestMessage: 'Failed to access',
      tokenErrorMessage: 'Permission required',
      noAccessAuthErrorMessage: 'Permission of the Jobsite Setting required',
      notExistErrorMessage: 'Data does not exist',
      internalServerErrorMessage: 'Failed to access',
      serviceUnavailableErrorMessage: 'Failed to access',
      assetUpdateErrorMessage:
        'Failed to update the information\n{{assetName}}',
      notGetAssetErrorMessage: 'Failed to get the asset\n{{assetName}}',
      cancelMessage: 'File upload canceled',
      networkDisconnected: 'Failed to upload the file.\nNetwork Disconnected.'
    }
  },
  ja: {
    sideMenuButton: {
      tooltip: 'アイテム'
    },
    menu: {
      add: 'アイテムを追加'
    },
    fileDeleteModal: {
      confirmMessage: 'このファイルを削除します'
    },
    fileListModal: {
      tooLongNameMessage:
        'ファイル名が長すぎます（100文字以内に変更してください）',
      overSizeWldFileMessage:
        'ワールドファイル付画像のファイルサイズは2GB以下としてください',
      overSizeVideoFileMessage:
        '動画ファイルのファイルサイズは1GB以下としてください',
      hasTooLongNameMessage: 'ファイル名が長すぎるデータがあります',
      buttonLabel: {
        cancel: 'キャンセル',
        input: '設定値入力',
        upload: 'アップロード',
        multiRegister: '一括入力'
      },
      deleteConfirm: {
        message: '該当ファイルを削除しますか？'
      },
      info: {
        isNotAllowed: '該当ファイルはアップロード不可',
        isNotHaveInfo: '未入力',
        'blackboard-internal': '電子黒板',
        designFile: '設計ファイル',
        imagery: '画像',
        model3d: '3Dモデル',
        overlay: 'オーバーレイ',
        picture: '写真',
        video: '動画',
        topography: '統合地形',
        projection: '座標系　　　　：',
        verticalProjection: '標高標準　　　：',
        flipXY: '座標データ形式：',
        invertXY: '座標反転形式：',
        flipTexture: 'テクスチャ反転形式：',
        locationInfo: '位置情報　　　：',
        lat: '緯度',
        lon: '経度',
        hsl: '標高',
        ellipsoidHeight: '楕円体高',
        heading: 'ヘディング',
        pitch: 'ピッチ',
        roll: 'ロール',
        startDateTime: 'データ開始日付：',
        endDateTime: 'データ終了日付：',
        displayName: '表示名　　　　：',
        remarks: '備考：（あり）'
      },
      title: 'アップロードファイル一覧',
      cautionText:
        'この現場は公開状態に設定されています。\n公開してよいアイテムかご確認の上アップロードをお願いします。'
    },
    fileInputModal: {
      cancelButtonLabel: 'キャンセル',
      dropMessage: {
        main: 'ファイル/フォルダをこちらにドラッグアンドドロップ',
        sub: 'または',
        selectFile: 'ファイル選択',
        selectFolder: 'フォルダ選択',
        selectCloud: 'クラウドから選択'
      },
      title: 'ファイルアップロード',
      tooltip: '以下のファイルをアップロードできます'
    },
    fileRegisterModal: {
      buttonLabel: {
        cancel: 'キャンセル',
        input: '入力'
      },
      optionLabel: {
        extensionDefault: 'ファイルの拡張子を選択してください',
        categoryDefault: 'ファイルの種別を選択してください',
        designFile: '設計ファイル',
        imagery: '画像',
        model3d: '3Dモデル',
        overlay: 'オーバーレイ',
        picture: '写真',
        topography: '統合地形',
        formatTypeDefault: 'ファイルのフォーマットを選択してください',
        flipXYDefault: '座標データ形式を選択してください',
        invertXYDefault: '座標反転形式を選択してください',
        flipTextureDefault: 'テクスチャ反転形式を選択してください',
        projectionDefault: 'アイテムデータに設定されている座標系を使用する',
        verticalProjectionDefault: '-',
        baseTerrainDefault: '国土地理院基盤地図情報数値標高モデル',
        baseTerrainCWT: 'Cesium World Terrain',
        video: '動画'
      },
      selectLabel: {
        addTerrain: '地形データとしての登録の選択',
        extension: 'ファイルの拡張子の選択',
        category: 'ファイルの種別の選択',
        formatType: 'ファイルのフォーマットの選択',
        formatTypeTooltip: {
          prefix: '(SHAPEファイルは正しく作動しない場合、',
          linkText: 'ここ',
          suffix: 'をクリックして正しい座標系を入力してください)'
        },
        flipXY: '座標データ形式の選択',
        invertXY: '座標データ反転の選択',
        invertXYNotInvert: '反転しない',
        invertXYInvert: '反転する',
        invertXYTooltip:
          'Autodesk Navisworks(R)を用いてデータを\n作成した場合に「反転する」を選択してください。',
        flipTexture: 'テクスチャ反転の選択',
        flipTextureFalse: '反転しない',
        flipTextureTrue: '反転する',
        flipTextureTooltip:
          'Autodesk Infraworks(R)を用いてデータを\n作成した場合に「反転する」を選択してください。\nなお、データ作成方法は<0>マニュアル</0>をご参照ください。',
        projection: '座標系の選択',
        projectionWarning: ' *（1024～32767の数字を入力してください）',
        verticalProjection: '標高標準の選択',
        timePeriod: 'データ期間の選択',
        baseTerrain: '結合元地形の選択'
      },
      addTerrain: {
        options: {
          isNotTerrain: '地形データとして登録しない',
          isTerrain: '地形データとしても登録する'
        }
      },
      cellSpacingInput: {
        label: '検索範囲(m)の入力'
      },
      locationInfoInput: {
        label: {
          title: '位置情報の入力',
          lat: {
            decimal: '緯度（10進）',
            degree: '緯度（度）',
            minute: '緯度（分）',
            second: '緯度（秒）'
          },
          lon: {
            decimal: '経度（10進）',
            degree: '経度（度）',
            minute: '経度（分）',
            second: '経度（秒）'
          },
          hsl: '標高（10進）',
          ellipsoidHeight: '楕円体高（10進）',
          heading: 'ヘディング（-180°~180°）',
          pitch: 'ピッチ（-180°~180°）',
          roll: 'ロール（-180°~180°）'
        },
        type: {
          decimal: 'DEG形式（10進表記）',
          dms: 'DMS形式（度分秒表記）',
          selectInMap: '地図上で選択'
        }
      },
      remarksInput: {
        label: '備考の入力'
      },
      displayNameInput: {
        label: '表示名の入力'
      },
      title: '設定値入力',
      videoCodecTiipsText:
        'コーデックは少なくともH.264に対応しています\nその他コーデックについては下記リンクをご参照ください\n',
      codecURL:
        'https://developer.mozilla.org/ja/docs/Web/Media/Formats/Video_codecs',
      jsonPathName: 'jsonパス（名称含む）'
    },
    fileFromCloudModal: {
      title: 'クラウドから選択',
      search: {
        placeholder: '検索'
      },
      buttonLabel: {
        add: '追加',
        cancel: 'キャンセル'
      },
      columns: {
        name: '名称'
      }
    },
    fileNumberPanel: {
      tiling: 'データ変換：',
      uploading: 'アップロード：',
      error: 'エラー：'
    },
    fileProgressModal: {
      buttonLabel: 'キャンセル',
      thisFileIsCancelledUpload: 'ファイルアップロードキャンセル',
      thisFileIsWaitingUpload: 'ファイルアップロード待機中',
      thisFileIsUploading: 'ファイルアップロード中',
      thisFileHasFinishedUpload: 'ファイルアップロード完了中',
      thisFileIsTiling: 'データ変換中',
      thisFileIsWaitingTile: 'データ変換待機中',
      thisFileIsTilingCancelable:
        'データ変換中（長時間経過しても完了しないため、削除可能）',
      thisFileIsWaitingDelete:
        '変換エラーが発生しました。ファイルをご確認ください',
      title: 'アップロード中 / データ変換中ファイル一覧'
    },
    mobileFileUploadModal: {
      title: 'ファイルアップロード',
      fileInputLabel: '写真を追加',
      settingLat: '緯度(設定値)：',
      settingLon: '経度(設定値)：',
      settingHsl: '標高(設定値)：',
      inputFormat: '入力形式：',
      decimal: 'DEG形式',
      dms: 'DMS形式',
      selectInMap: '地図上で選択',
      caution1:
        'iPhoneをご利用の場合は\n【設定】＞【カメラ】＞【フォーマット】から\n「互換性優先」に変更してください。',
      caution2: 'モバイル版では画像以外のアップロードは\nできません。',
      uploadButtonEnableLabel: 'アップロード',
      uploadButtonDisableLabel: 'ファイル準備中...'
    },
    notification: {
      assetUploadValidationFailed: '不正なファイル設定です',
      assetUploadNotFound:
        'ファイルのアップロードに失敗しました\n再度アップロードしてください',
      assetUploadNotFoundBucketId: 'Jobsite Settingの権限を確認してください',
      assetUploadUnSupportedZip: 'サポートしていないZIPファイルです',
      assetUploadNotFoundTilesetJson: 'ZIPファイル内にtileset.jsonがありません',
      assetUploadLimit: 'アイテム数が登録上限を超えています',
      assetUploadAnotherUser: '同じ名前のファイルが既に登録されています',
      assetUploadErrorS3Upload:
        'ファイルのアップロードに失敗しました\n再度アップロードしてください',
      assetUploadErrorFileConvert:
        'アップロードファイルが正しくありません\n再度アップロードしてください',
      assetDeleteErrorPermissionRequired:
        'アイテムの削除に失敗しました\n指定した操作はJobsite Settingの権限が必要です',
      blackboardUploadAnotherUserMessage:
        '同じ名前のファイルが既に登録されています',
      blackboardUploadFailedMessage: '電子黒板のアップロードに失敗しました',
      videoUploadLimitMessage: '動画の登録数が上限に達しました',
      badRequestMessage: 'アクセスに失敗しました',
      tokenErrorMessage: 'アクセス権限がありません',
      noAccessAuthErrorMessage: 'Jobsite Settingへのアクセス権限がありません',
      notExistErrorMessage: 'アクセス対象が存在しません',
      internalServerErrorMessage: 'アクセスに失敗しました',
      serviceUnavailableErrorMessage: 'アクセスに失敗しました',
      assetUpdateErrorMessage:
        'アイテムの情報の更新に失敗しました\n{{assetName}}',
      notGetAssetErrorMessage: 'アイテムの取得に失敗しました\n{{assetName}}',
      cancelMessage: 'ファイルアップロードをキャンセルしました',
      networkDisconnected:
        'ファイルのアップロードに失敗しました。\nネットワークが切断されました。'
    }
  }
}
