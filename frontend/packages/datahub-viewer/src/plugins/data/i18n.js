// Copyright (c) 2025 NTT InfraNet
const i18n = {
  en: {
    dataAdmin: {
      menu: 'Data management',
      modal: {
        title: 'Data management',
        addFolder: 'Add folder',
        renameFolder: 'Rename folder',
        delete: 'Delete',
        download: 'Download',
        search: 'Search...',
        saveTree: 'Save tree',
        tree: 'Tree',
        top: 'TOP',
        close: 'Close',
        uncategorized: 'Uncategorized',
        add: 'Add',
        save: 'Save',
        cancel: 'Cancel',
        header: {
          name: 'Name',
          createDate: 'Create Date',
          action: 'Action'
        }
      },
      confirmModal: {
        title: 'Edit save confirmation',
        button: {
          save: 'Save',
          notSave: `don't save`,
          cancel: 'Cancel'
        },
        contentText: `Do you want to save your changes?\n(If you select "Don't Save", your changes will be discarded)`
      },
      fileDeleteModal: {
        modalText:
          'Are you sure you want to delete the following files or folders?'
      },
      deleteAreaDescription:
        'Drag and drop the files/folders you want to delete',
      dateFormat: 'yyyy/M/d H:mm:ss',
      deleteModal: {
        confirmFileDeleteMessage: 'Delete this file?',
        confirmFolderDeleteMessage: 'Delete this folder?'
      },
      errors: {
        unableToSaveSite: 'Could not save tree structure',
        duplicateFolderName: 'Duplicate folder name',
        emptyFolderName: 'Please enter the folder name'
      },
      fileType: {
        1: 'Asset',
        2: 'Annotation',
        4: 'Device',
        5: 'Picture'
      },
      subFileType: {
        asset: {
          1: 'Topography',
          2: 'Imagery',
          3: '3D model',
          4: 'Design file',
          5: 'Overlay'
        }
      }
    },
    drawer: {
      unit: 'hour/s',
      displayInterval: 'Display interval: ',
      textRadioLabel: {
        day1: '1 day',
        day3: '3 days',
        week1: '1 week',
        week2: '2 weeks',
        month1: '1 month',
        month6: '6 months',
        year1: '1 year'
      }
    },
    siteMenu: {
      main: {
        header: 'data'
      }
    },
    action: {
      addItem: 'Add Item',
      edit: 'Edit',
      tooltip: 'Sort items and organize folders'
    },
    menuItem: {
      asset: {
        editModal: {
          editAsset: 'Edit Asset',
          cancelButtonLabel: 'Cancel',
          inputLabel: 'Display Name',
          saveButtonLabel: 'Save',
          completeMessage: 'File edit completed',
          timePeriodSelectTitle: 'Select data period',
          editDisplayInfo: {
            label: 'Edit display info',
            addLabel: 'Add icon/color setting',
            property: 'Property',
            value: 'Value',
            icon: 'Icon',
            color: 'Color',
            edge: '(edge)',
            surface: '(surface)',
            labelText: 'Label text',
            visible: 'visible',
            invisible: 'invisible',
            text: 'Text',
            transparency: 'Transparency',
            transparent: 'transparent',
            all: 'All',
            default: 'Default',
            none: 'None',
            connectText1: '`s',
            connectText2: '',
            connectText3: '・',
            connectText4: 'exchange'
          }
        },
        infoContextMenu: {
          displayName: 'Display name: ',
          fileName: 'File name: ',
          createdAtLabel: 'Created at: ',
          updatedAtLabel: 'Updated at: ',
          dateFormat: 'LLL d, yyyy, H:mm',
          userNameLabel: 'Created by: '
        },
        settingContextMenu: {
          onSelect: ' data on select'
        }
      },
      folder: {
        moveFolderSameNameErrMsg:
          'Have same name folder, can not move folder here.'
      },
      camera: {
        label: 'ELMO device',
        settingContextMenu: {
          label: 'ELMO Connect'
        },
        contextMenu: {
          edit: 'Edit ELMO device'
        },
        authModal: {
          label: 'ELMO Authentication settings',
          user: 'ELMO User Name',
          passwd: 'ELMO Password',
          connect: 'Connect',
          disconnect: 'Disconnect',
          update: 'Update',
          cancel: 'cancel'
        },
        cameraModal: {
          header: 'Edit',
          cancelButtonLabel: 'Cancel',
          saveButtonLabel: 'Save',
          editButtonLabel: 'Edit',
          settingLat: 'Latitude(By setting): ',
          settingLon: 'Longitude(By setting): ',
          settingHsl: 'Elevation(By setting): ',
          inputFormat: 'Input Format: ',
          decimal: 'Decimal Type',
          dms: 'DMS type',
          selectInMap: 'Select In Map',
          displayNameInputLabel: 'Display Name: ',
          zoomLabel: 'Zoom: ',
          remarksInputLabel: 'Remarks: ',
          elmoDevice: 'elmo Device: '
        }
      }
    },
    mobileTimelineModal: {
      title: 'Data display date',
      label: 'Date',
      button: {
        close: 'Close',
        apply: 'Apply'
      }
    },
    errorsMessage: {
      badRequestMessage: 'Failed to access',
      tokenErrorMessage: 'Permission required',
      noAccessAuthErrorMessage: 'Permission of the Jobsite Setting required',
      notExistErrorMessage: 'Data does not exist',
      internalServerErrorMessage: 'Failed to access',
      serviceUnavailableErrorMessage: 'Failed to access'
    }
  },
  ja: {
    dataAdmin: {
      menu: 'データ管理',
      modal: {
        title: 'データ管理',
        addFolder: '新規フォルダの作成',
        renameFolder: 'フォルダ名変更',
        delete: '削除',
        download: 'ダウンロード',
        search: '検索...',
        saveTree: '保存',
        tree: 'ツリー',
        top: 'TOP',
        close: '閉じる',
        uncategorized: '未分類',
        add: '追加',
        save: '保存',
        cancel: 'キャンセル',
        header: {
          name: '名称',
          createDate: '登録日時',
          action: '操作'
        }
      },
      confirmModal: {
        title: '編集保存確認',
        button: {
          save: '保存',
          notSave: '保存しない',
          cancel: 'キャンセル'
        },
        contentText:
          '変更内容を保存しますか?\n(「保存しない」を選択すると、変更内容が破棄されます)'
      },
      fileDeleteModal: {
        modalText: '以下のファイルまたはフォルダを削除してよろしいですか？'
      },
      deleteAreaDescription:
        '削除したいファイル/フォルダをドラッグアンドドロップ',
      dateFormat: 'yyyy/M/d H:mm:ss',
      deleteModal: {
        confirmFileDeleteMessage: 'このファイルを削除します',
        confirmFolderDeleteMessage: 'このフォルダを削除します'
      },
      errors: {
        unableToSaveSite: 'ツリー構造を保存できませんでした',
        duplicateFolderName: 'フォルダ名が重複しています',
        emptyFolderName: 'フォルダ名を入力してください'
      },
      fileType: {
        1: 'アセット',
        2: 'アノテーション',
        3: 'デバイス',
        4: '電子黒板',
        5: '写真'
      },
      subFileType: {
        asset: {
          1: '統合地形',
          2: '画像',
          3: '3Dモデル',
          4: '設計ファイル',
          5: 'オーバレイ'
        },
        annotation: {
          1: '点',
          2: '線',
          3: '矢印',
          4: '多角形',
          5: 'テキスト'
        }
      }
    },
    drawer: {
      unit: '時間/秒',
      displayInterval: '表示間隔：',
      textRadioLabel: {
        day1: '1日',
        day3: '3日',
        week1: '1週間',
        week2: '2週間',
        month1: '1か月',
        month6: '6か月',
        year1: '1年'
      }
    },
    siteMenu: {
      main: {
        header: 'データ'
      }
    },
    action: {
      addItem: 'アイテムを追加',
      edit: '編集',
      tooltip: 'アイテムの並べ替えや\nフォルダ整理を行います'
    },
    menuItem: {
      asset: {
        editModal: {
          editAsset: 'アセットの編集',
          cancelButtonLabel: 'キャンセル',
          inputLabel: '表示名',
          saveButtonLabel: '保存',
          completeMessage: 'アセットの保存が完了しました',
          timePeriodSelectTitle: 'データ期間の選択',
          editDisplayInfo: {
            label: '表示情報の変更',
            addLabel: 'アイコン・カラー設定を追加する',
            property: 'プロパティ',
            value: '値',
            icon: 'アイコン',
            color: 'カラー',
            edge: '（境界）',
            surface: '（面）',
            labelText: 'ラベルテキスト',
            visible: 'あり',
            invisible: 'なし',
            text: 'テキスト',
            transparency: '透明度',
            transparent: '透明',
            all: '全て',
            default: '既定',
            none: 'なし',
            connectText1: 'の',
            connectText2: 'を',
            connectText3: '・',
            connectText4: 'に変更'
          }
        },
        infoContextMenu: {
          displayName: '表示名：',
          fileName: 'ファイル名：',
          createdAtLabel: '登録日時：',
          updatedAtLabel: '更新日時：',
          dateFormat: 'yyyy年M月d日H時m分',
          userNameLabel: '登録者：'
        },
        settingContextMenu: {
          onSelect: '個選択中'
        }
      },
      folder: {
        moveFolderSameNameErrMsg:
          '同名フォルダが存在します。\nフォルダ移動することができません。'
      },
      camera: {
        label: 'ELMOデバイス',
        settingContextMenu: {
          label: 'ELMO認証設定'
        },
        contextMenu: {
          edit: 'ELMOデバイスの編集'
        },
        authModal: {
          label: 'ELMO認証設定',
          user: 'ELMOユーザー名',
          passwd: 'ELMOパスワード',
          connect: '認証連係する',
          disconnect: '認証連係解除',
          update: '認証更新',
          cancel: 'キャンセル'
        },
        cameraModal: {
          header: '編集',
          cancelButtonLabel: 'キャンセル',
          saveButtonLabel: '保存',
          editButtonLabel: '編集',
          settingLat: '緯度(設定値)：',
          settingLon: '経度(設定値)：',
          settingHsl: '標高(設定値)：',
          inputFormat: '入力形式：',
          decimal: 'DEG形式',
          dms: 'DMS形式',
          selectInMap: '地図上で選択',
          displayNameInputLabel: '表示名：',
          zoomLabel: 'ズーム：',
          remarksInputLabel: '備考：',
          elmoDevice: 'ELMOデバイス：'
        }
      }
    },
    mobileTimelineModal: {
      title: 'データ表示日',
      label: '日付',
      button: {
        close: '閉じる',
        apply: '適用'
      }
    },
    errorsMessage: {
      badRequestMessage: 'アクセスに失敗しました',
      tokenErrorMessage: 'アクセス権限がありません',
      noAccessAuthErrorMessage: 'Jobsite Settingへのアクセス権限がありません',
      notExistErrorMessage: 'アクセス対象が存在しません',
      internalServerErrorMessage: 'アクセスに失敗しました',
      serviceUnavailableErrorMessage: 'アクセスに失敗しました'
    }
  }
}

export default i18n
