// Copyright (c) 2025 NTT InfraNet
const i18n = {
  en: {
    common: {
      assetCreationModal: {
        typeSelectorModal: {
          title: 'Select a file type',
          topographyButtonLabel: 'Topography {{extensionsLabel}}',
          imageryButtonLabel: 'Imagery {{extensionsLabel}}',
          designFileButtonLabel: 'Design file {{extensionsLabel}}',
          overlayButtonLabel: 'Overlay {{extensionsLabel}}',
          model3dButtonLabel: '3D model {{extensionsLabel}}',
          cancelButtonLabel: 'Cancel'
        },
        fileRegisterModal: {
          cancelButtonLabel: 'Cancel',
          cancelMessage: 'File upload canceled',
          closeButtonLabel: 'Close',
          completeMessage: 'File upload completed',
          dragLabel: 'Drag and drop a file,',
          errorMessages: {
            assetUploadValidationFailed: 'Invalid file setting',
            assetUploadNotFound:
              'Failed to upload the file\nPlease upload again',
            assetUploadNotFoundBucketId:
              "Please check the Jobsite Setting's role",
            assetUploadUnSupportedZip: 'Unsupported ZIP file',
            assetUploadNotFoundTilesetJson:
              'Please check the tilesetjson in ZIP file',
            assetUploadLimit: 'The number of assets exceeds the upload limit',
            assetUploadAnotherUser: 'File with the same name already exists',
            assetUploadErrorS3Upload:
              'Failed to upload the file\nPlease upload again',
            assetUploadErrorFileConvert:
              'The uploaded file is incorrect\nPlease upload again'
          },
          finalizeMessage: 'Uploading file',
          modalTitle: {
            designFile: 'Design file',
            imagery: 'Imagery file',
            topography: 'Topography file',
            overlay: 'Overlay',
            model3d: '3D model'
          },
          modalTitleAdditionalInfo: {
            designFile:
              '＊If you want to upload some related files, please compress them into zip and upload it',
            imagery: '',
            topography: '',
            overlay:
              '＊If you want to upload some related files, please compress them into zip and upload it',
            model3d:
              '＊If you want to upload some related files, please compress them into zip and upload it'
          },
          progressMessage: 'Uploading file({{progress}}%)',
          selectTitle: 'Select upload file',
          selectLabel: 'or select',
          formatTypeSelectTitle: 'Select kind of file',
          formatTypeSelectNullLabel: 'Please select kind of file',
          timePeriodSelectTitle: 'Select data period',
          uploadButtonLabel: 'Start upload'
        }
      },
      contextMenu: {
        clampToSurface: 'Clamp to surface',
        editAsset: 'Edit Asset',
        download: 'Download',
        delete: 'Delete',
        detailInfo: 'Detail Info',
        reset: 'Reset'
      },
      assetStyleContextMenu: {
        selectorLabel: 'Select color',
        defaultValueLabel: 'Default'
      },
      fileDeleteModal: {
        confirmMessage: 'Delete this asset?'
      },
      notification: {
        assetDeleteErrorPermissionRequired:
          'Failed to delete asset\nJobsite Setting permissions\nrequired for the operation',
        badRequestMessage: 'Failed to access',
        tokenErrorMessage: 'Permission required',
        noAccessAuthErrorMessage: 'Permission of the Jobsite Setting required',
        notExistErrorMessage: 'Data does not exist',
        internalServerErrorMessage: 'Failed to access',
        serviceUnavailableErrorMessage: 'Failed to access',
        assetUpdateErrorMessage:
          'Failed to update the information\n{{assetName}}',
        notGetAssetErrorMessage: 'Failed to get the asset\n{{assetName}}'
      },
      tiling: {
        panelText: 'Number of tiling assets：{{tilingFilesNumber}}',
        modalWindow: {
          title: 'Tiling assets list',
          getProgressFailedMessage: 'Failed to get tiling progress',
          getProgressWaitingMessage: 'Waiting for tiling',
          closeButtonLabel: 'close'
        }
      },
      unnamed: 'Unnamed Feature'
    },
    menu: {
      newIcon: {
        asset: {
          tooltip: 'asset'
        }
      },
      edit: {
        asset: {
          tooltip: 'This asset has its display position edited'
        }
      }
    },
    slider: {
      pointSize: 'Point size',
      transparency: 'Transparency',
      textureBrightness: 'Texture Brightness',
      modelBrightness: 'Model Brightness'
    },
    drawer: {
      header: {
        cancel: 'Cancel',
        close: 'Close',
        save: 'Save'
      },
      panel: {
        name: {
          errors: {
            required: 'Required field',
            maxlength: 'Exceeds 255 characters'
          },
          label: 'Display Name',
          placeholder: 'Please input display name'
        },
        coordinate: {
          errors: {
            default: 'Invalid input value',
            required: 'Input value',
            hasCrossLines: 'This polygon has intersecting lines',
            inputTwoPoint: 'Input at least two points',
            inputThreePoint: 'Input at least three points'
          },
          label: 'Coordinate',
          longitude: 'Longitude(°)',
          latitude: 'Latitude(°)',
          height: 'Height(m)',
          placeholder: 'Please edit asset on the map or input coordinate',
          reset: 'Reset'
        },
        rotate: {
          label: 'Rotate',
          heading: 'Heading',
          pitch: 'Pitch',
          roll: 'Roll'
        },
        datetime: {
          errors: {
            default: 'Invalid input value',
            required:
              'The start dateTime and the end datetime are both required'
          },
          label: 'Select data period'
        }
      }
    },
    topography: {
      menu: {
        label: 'Topography'
      }
    },
    imagery: {
      menu: {
        label: 'Imagery'
      }
    },
    model3d: {
      menu: {
        label: '3D model'
      }
    },
    designfile: {
      menu: {
        label: 'Design file'
      }
    },
    overlay: {
      menu: {
        label: 'Overlay'
      }
    },
    graph: {
      latestText: 'LatestValue'
    }
  },
  ja: {
    common: {
      assetCreationModal: {
        typeSelectorModal: {
          title: 'ファイルの種別を選択してください',
          topographyButtonLabel: '統合地形 {{extensionsLabel}}',
          imageryButtonLabel: '画像 {{extensionsLabel}}',
          designFileButtonLabel: '設計ファイル {{extensionsLabel}}',
          overlayButtonLabel: 'オーバーレイ {{extensionsLabel}}',
          model3dButtonLabel: '3Dモデル {{extensionsLabel}}',
          cancelButtonLabel: 'キャンセル'
        },
        fileRegisterModal: {
          cancelButtonLabel: 'キャンセル',
          cancelMessage: 'ファイルアップロードをキャンセルしました',
          closeButtonLabel: '閉じる',
          completeMessage: 'ファイルのアップロードが完了しました',
          dragLabel: 'ファイルをドラッグアンドドロップするか、',
          errorMessages: {
            assetUploadValidationFailed: '不正なファイル設定です',
            assetUploadNotFound:
              'ファイルのアップロードに失敗しました\n再度アップロードしてください',
            assetUploadNotFoundBucketId:
              'Jobsite Settingの権限を確認してください',
            assetUploadUnSupportedZip: 'サポートしていないZIPファイルです',
            assetUploadNotFoundTilesetJson:
              'ZIPファイル内にtileset.jsonがありません',
            assetUploadLimit: 'アイテム数が登録上限を超えています',
            assetUploadAnotherUser: '同じ名前のファイルが既に登録されています',
            assetUploadErrorS3Upload:
              'ファイルのアップロードに失敗しました\n再度アップロードしてください',
            assetUploadErrorFileConvert:
              'アップロードファイルが正しくありません\n再度アップロードしてください'
          },
          finalizeMessage: 'ファイルをアップロードしています',
          modalTitle: {
            designFile: '設計ファイル',
            imagery: '画像',
            topography: '統合地形',
            overlay: 'オーバーレイ',
            model3d: '3Dモデル'
          },
          modalTitleAdditionalInfo: {
            designFile:
              '※関連ファイルをアップロードする場合はZIP圧縮してください',
            imagery: '',
            topography: '',
            overlay: '※関連ファイルをアップロードする場合はZIP圧縮してください',
            model3d: ''
          },
          progressMessage: 'ファイルをアップロードしています({{progress}}%)',
          selectTitle: 'ファイルのアップロード',
          selectLabel: '選択してください',
          formatTypeSelectTitle: 'ファイル種別の選択',
          formatTypeSelectNullLabel: 'ファイル種別を選択してください',
          timePeriodSelectTitle: 'データ期間の選択',
          uploadButtonLabel: 'アップロードを開始'
        }
      },
      contextMenu: {
        clampToSurface: '表面固定',
        editAsset: 'アイテムの編集',
        download: 'ダウンロード',
        delete: '削除',
        detailInfo: '詳細情報',
        reset: 'リセット'
      },
      assetStyleContextMenu: {
        selectorLabel: '色変更',
        defaultValueLabel: '既定'
      },
      fileDeleteModal: {
        confirmMessage: 'このアイテムを削除します'
      },
      notification: {
        assetDeleteErrorPermissionRequired:
          'アイテムの削除に失敗しました\n指定した操作はJobsite Settingの権限が必要です',
        badRequestMessage: 'アクセスに失敗しました',
        tokenErrorMessage: 'アクセス権限がありません',
        noAccessAuthErrorMessage: 'Jobsite Settingへのアクセス権限がありません',
        notExistErrorMessage: 'アクセス対象が存在しません',
        internalServerErrorMessage: 'アクセスに失敗しました',
        serviceUnavailableErrorMessage: 'アクセスに失敗しました',
        assetUpdateErrorMessage:
          'アイテムの情報の更新に失敗しました\n{{assetName}}',
        notGetAssetErrorMessage: 'アイテムの取得に失敗しました\n{{assetName}}'
      },
      tiling: {
        panelText: 'タイリング中のアイテム数：{{tilingFilesNumber}}',
        modalWindow: {
          title: 'タイリング中のアイテム一覧',
          getProgressFailedMessage: '進捗を取得できませんでした',
          getProgressWaitingMessage: 'タイリング待機中',
          closeButtonLabel: '閉じる'
        }
      },
      unnamed: '名称未設定の地物'
    },
    menu: {
      newIcon: {
        asset: {
          tooltip: 'アイテム'
        }
      },
      edit: {
        asset: {
          tooltip: 'このアイテムは表示位置が編集されています'
        }
      }
    },
    slider: {
      pointSize: '点のサイズ',
      transparency: '透明度',
      textureBrightness: 'テクスチャ明度',
      modelBrightness: 'モデル明度'
    },
    drawer: {
      header: {
        cancel: 'キャンセル',
        close: '閉じる',
        save: '保存'
      },
      panel: {
        name: {
          errors: {
            required: '必須入力項目です',
            maxlength: '255文字以内で入力してください'
          },
          label: '表示名',
          placeholder: '表示名を入力'
        },
        coordinate: {
          errors: {
            default: '不正な入力値です',
            required: '数値を入力してください',
            hasCrossLines: '交差している線があります',
            inputTwoPoint: '2点以上を入力してください',
            inputThreePoint: '3点以上を入力してください'
          },
          label: '座標',
          longitude: '経度(°)',
          latitude: '緯度(°)',
          height: '楕円体高(m)',
          placeholder: '地図上でアイテムを編集もしくは座標を入力',
          reset: 'リセット'
        },
        rotate: {
          label: '回転',
          heading: 'ヘディング',
          pitch: 'ピッチ',
          roll: 'ロール'
        },
        datetime: {
          errors: {
            default: '不正な入力値です',
            required: 'データの開始日付時間と終了日付時間両方が必要です'
          },
          label: 'データ期間の選択'
        }
      }
    },
    topography: {
      menu: {
        label: '統合地形'
      }
    },
    imagery: {
      menu: {
        label: '画像'
      }
    },
    model3d: {
      menu: {
        label: '3Dモデル'
      }
    },
    designfile: {
      menu: {
        label: '設計ファイル'
      }
    },
    overlay: {
      menu: {
        label: 'オーバーレイ'
      }
    },
    graph: {
      latestText: '最新値'
    },
    popup: {
      id: 'ID',
      placeNumber: '区域番号',
      placeName: '区域名',
      cityName: '都市名',
      municipalitiesName: '区町村名'
    }
  }
}

export default i18n
