// Copyright (c) 2025 NTT InfraNet
const i18n = {
  en: {
    common: {
      dateFormat: 'LLL d, yyyy, H:mm',
      unexpectedError: 'An unexpected error occurred'
    },
    asset: {
      assetUploadStart: 'Asset convert started',
      assetUploadErrorLLFSDownload:
        'Failed to convert asset\nPlease upload again',
      assetUploadErrorLLFSUpload:
        'Failed to linking to the file storage\nPlease upload again',
      assetUploadError: 'Failed to convert asset\nPlease upload again',
      assetConvertSuccess: 'Asset convert completed',
      assetConvertErrorData: 'Failed to convert asset\nUnsupported file format',
      assetConvertError: 'Failed to convert asset\nPlease upload again',
      assetDeleteComplete: 'Asset delete completed',
      assetDeleteError: 'Failed to delete asset\nPlease delete again'
    },
    data: {
      fileDeleteComplete: 'File/folder delete completed'
    },
    measurement: {
      measurementCreateComplete: 'Measurement registration completed',
      measurementUpdateComplete: 'Measurement update completed',
      measurementDeleteComplete: 'Measurement delete completed',
      horizontalDistance: 'Horizontal distance',
      horizontalArea: 'Horizontal area',
      cutAndFill: 'Cut and fill'
    },
    image: {
      imageCreateComplete: 'Image create completed',
      imageUploadSuccess: 'Image upload completed',
      imageUploadError: 'Failed to upload image',
      imageDeleteComplete: 'Image delete completed',
      imageUpdateComplete: 'Image update completed'
    },
    site: {
      siteUpdateSuccess: 'Site update completed'
    },
    video: {
      videoCreateComplete: 'Video create completed',
      videoUploadComplete: 'Video upload completed',
      videoUpdateComplete: 'Video update completed',
      videoDeleteComplete: 'Video delete completed'
    },
    viewpoint: {
      viewpointCreateComplete: 'Viewpoint create completed',
      viewpointUploadComplete: 'Viewpoint upload completed',
      viewpointDeleteComplete: 'Viewpoint delete completed',
      viewpointAnimationUploadComplete: 'Animation upload completed',
      viewpointAnimationDeleteComplete: 'Animation delete completed',
      viewpointViewsettingCreateComplete: 'View setting create completed',
      viewpointViewsettingUpdateComplete: 'View setting upload completed',
      viewpointViewsettingDeleteComplete: 'View setting delete completed'
    },
    wmts: {
      wmtsCreateComplete: 'WMTS create completed',
      wmtsUpdateComplete: 'WMTS update completed',
      wmtsDeleteComplete: 'WMTS delete completed'
    },
    monitor: {
      monitorTriggerOn: 'The value of {1} set to {0} has became {2} or {3}',
      condition: {
        above: 'higher',
        below: 'less'
      }
    }
  },
  ja: {
    common: {
      dateFormat: 'yyyy年M月d日H時m分',
      unexpectedError:
        'システムでエラーが発生しました\nシステム管理者に連絡してください'
    },
    asset: {
      assetUploadStart: 'アイテムの変換を開始しました',
      assetUploadErrorLLFSDownload:
        'アイテムの変換に失敗しました\n再度アップロードしてください\n改善されないようでしたらシステム管理者に連絡してください',
      assetUploadErrorLLFSUpload:
        'ファイルストレージとの連携に失敗しました\n再度アップロードしてください',
      assetUploadError:
        'アイテムの変換に失敗しました\n再度アップロードしてください\n改善されないようでしたらシステム管理者に連絡してください',
      assetConvertSuccess: 'アイテムの変換が完了しました',
      assetConvertErrorData:
        'アイテムの変換に失敗しました\nサポートしていないファイル形式です',
      assetConvertError: 'アイテムの変換に失敗しました\n再度登録してください',
      assetDeleteComplete: 'アイテムの削除が完了しました',
      assetDeleteError: 'アイテムの削除に失敗しました\n再度削除してください'
    },
    data: {
      fileDeleteComplete: 'ファイル・フォルダの削除が完了しました'
    },
    measurement: {
      measurementCreateComplete: '計測の登録が完了しました',
      measurementUpdateComplete: '計測の更新が完了しました',
      measurementDeleteComplete: '計測の削除が完了しました',
      horizontalDistance: '水平距離',
      horizontalArea: '水平面積',
      cutAndFill: '切盛土量'
    },
    image: {
      imageCreateComplete: '画像の作成が完了しました',
      imageUploadSuccess: '画像のファイルアップロードが完了しました',
      imageUploadError: '画像のファイルアップロードが失敗しました',
      imageDeleteComplete: '画像の削除が完了しました',
      imageUpdateComplete: '画像の更新が完了しました'
    },
    site: {
      siteUpdateSuccess: '現場の更新が完了しました'
    },
    video: {
      videoCreateComplete: '動画の作成が完了しました',
      videoUploadComplete: '動画のファイルアップロードが完了しました',
      videoUpdateComplete: '動画の更新が完了しました',
      videoDeleteComplete: '動画の削除が完了しました'
    },
    viewpoint: {
      viewpointCreateComplete: 'ビューポイントの作成が完了しました',
      viewpointUploadComplete: 'ビューポイントの更新が完了しました',
      viewpointDeleteComplete: 'ビューポイントの削除が完了しました',
      viewpointAnimationUploadComplete: 'アニメーションの更新が完了しました',
      viewpointAnimationDeleteComplete: 'アニメーションの削除が完了しました',
      viewpointViewsettingCreateComplete:
        'アイテム表示設定の作成が完了しました',
      viewpointViewsettingUpdateComplete:
        'アイテム表示設定の更新が完了しました',
      viewpointViewsettingDeleteComplete: 'アイテム表示設定の削除が完了しました'
    },
    wmts: {
      wmtsCreateComplete: 'WMTSの作成が完了しました',
      wmtsUpdateComplete: 'WMTSの更新が完了しました',
      wmtsDeleteComplete: 'WMTSの削除が完了しました'
    },
    monitor: {
      monitorTriggerOn: '{0}に設定していた{1}の値が{2}を{3}回りました',
      condition: {
        above: '上',
        below: '下'
      }
    }
  }
}

export default i18n
