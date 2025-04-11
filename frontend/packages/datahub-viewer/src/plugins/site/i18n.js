// Copyright (c) 2025 NTT InfraNet
const i18n = {
  en: {
    loadPlugin: 'Load plugin',
    unloadPlugin: 'Unload plugin',
    viewer: 'Viewer',
    done: 'Done',
    next: 'Next',
    cancel: 'Cancel',
    point: 'Point',
    latitude: 'Latitude',
    longitude: 'Longitude',
    height: 'Height',
    northing: 'Northing(Y)',
    easting: 'Easting(X)',
    elevation: 'Elevation(Z)',
    loading: 'Loading...',
    input: 'Input',
    close: 'Close',
    noSiteSidebar: {
      createNewSite: 'Create new site',
      siteUsage:
        'A site will allow you to upload photos, point clouds, design files, etc'
    },
    coordinateSystems: {
      utm: 'UTM (Default)',
      wgs84: 'WGS84',
      geodetic: 'Geodetic (projection + geoid)',
      custom: 'Custom'
    },
    mapMore: {
      tooltip: 'Map settings',
      baseMap: 'Base map',
      defaultMap: 'Default',
      baseTerrain: 'Base terrain',
      satellite: 'Satellite',
      streets: 'Road',
      outdoors: 'Topography',
      newAnalytic: 'New analytic',
      shareLink: 'Share link',
      exportPdf: 'Export view to pdf',
      download: 'Download files',
      units: 'Units',
      intlFt: 'Intl Feet',
      usFt: 'US Feet',
      m: 'm'
    },
    renderQuality: {
      label: 'Render quality',
      low: 'Low',
      standard: 'Standard',
      high: 'High',
      submit: 'Submit'
    },
    mapview: {
      label: 'mapview',
      d3: '3D',
      notD3: '2D terrain',
      real3D: 'Google Photorealistic 3D Tiles [Beta]',
      real3DTooltip:
        'We are providing \nGoogle Photorealistic 3D Tiles, which is the same high-resolution and high-precision 3D map source as Google Earth, on a trial basis. \nIf you enable this function, you will not be able to use some functions.\nYou can use it again by returning the map display to "3D terrain". \nIn addition, this function may be suspended or discontinued without notice.',
      d2: '2D',
      submit: 'Submit'
    },
    globeTranslucency: {
      alpha: 'Alpha',
      fade: 'Fade by distance',
      label: 'Terrain transparency',
      hiddenBelowTerrain: 'Hide the asset that in below terrain'
    },
    lightController: {
      label: 'Sunlight settings',
      show: 'Enable shadow',
      entity: 'Enable shadow of the asset',
      terrain: 'Enable shadow of the terrain',
      datetime: 'Set Datetime'
    },
    globeContour: {
      label: 'Contour',
      show: 'Enable contour lines',
      spacing: 'Spacing',
      color: 'Color'
    },
    mapPointMeasurement: {
      coordinate: 'coordinate',
      latitude: 'lat',
      longitude: 'lon',
      elevation: 'height',
      slope: 'slope',
      copyAll: 'Copy All',
      copiedMessage: 'copied',
      units: {
        length: 'm',
        degree: '°',
        percent: '%',
        ratio: 'tenths'
      }
    },
    cameraConfig: {
      label: 'Control Settings',
      title: 'Control Settings',
      tooltip: 'Control Settings',
      mouse: {
        tab: 'Mouse control settings',
        horizontal: 'Horizontal movement of view',
        rotate: 'Rotation of view',
        zoom: 'Zoom in / out',
        cameraEvents: {
          leftDrag: 'Left click hold and drag',
          rightDrag: 'Right click hold and drag',
          middleDrag: 'Middle click hold and drag',
          wheel: 'Scrolling the middle mouse button'
        },
        errors: {
          duplicate: 'Duplicate assignment operation'
        },
        tooltip: {
          horizontal: 'This setting cannot be changed'
        }
      },
      key: {
        tab: 'Keyboard control settings',
        placeholder: 'Press any key',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        moveUp: 'Viewpoint rise',
        moveDown: 'Viewpoint descent',
        moveFoward: 'Viewpoint advance',
        moveBackward: 'Viewpoint retreat',
        moveLeft: 'Viewpoint move left',
        moveRight: 'Viewpoint move right',
        rotateUp: 'Rotate the viewpoint upward',
        rotateDown: 'Rotate the viewpoint downward',
        rotateLeft: 'Rotate the viewpoint left',
        rotateRight: 'Rotate the viewpoint right',
        twistLeft: 'Viewpoint left twist',
        twistRight: 'Viewpoint right twist',
        errors: {
          duplicate: 'Duplicate assignment key'
        }
      },
      preset: {
        label: 'Select preset',
        default: 'Default',
        arcGis: 'ArcGIS Earth compatible'
      },
      submit: 'Submit'
    },
    menu: {
      newIcon: {
        tooltip: 'FileUpload Asset or BlackBoard'
      },
      siteInfo: 'Site information',
      siteList: 'Switch site',
      timeline: 'Timeline',
      peopleCanAccess: '{{value}} people can access'
    },
    lengthUnit: {
      unit: {
        m: 'm',
        ft: 'ft',
        'ft-us': 'US ft',
        'us-ft': 'US ft',
        'Intl ft': 'Intl ft',
        intlFt: 'Intl ft',
        'US ft': 'US ft',
        usFt: 'US ft',
        usft: 'US ft'
      }
    },
    errors: {
      unableToDeleteSite: 'Unable to delete site\nPlease try again',
      unableToLoadSite:
        'Unable to load site\nPlease try again or choose a different site',
      unableToLoadSites: 'Unable to load sites\nPlease try again',
      unableToImportSite: 'Unable to import site\nPlease try again',
      siteArchived:
        '{{siteName}} has been archived and\ncannot be loaded until it is unarchived'
    },
    modals: {
      title: {
        fileUpload: 'Select the target of file upload',
        import: 'Import site',
        select: 'Site selection'
      },
      button: {
        cancel: 'Cancel',
        create: 'Create job site',
        import: 'Import site',
        importAction: 'Import',
        onArchiveSite: 'Show Archive Site',
        offArchiveSite: 'Hide Archive Site'
      },
      fileUploadTarget: {
        blackboard: 'Blackboard',
        asset: 'Asset'
      },
      deleteConfirmMessage: 'Delete this site?',
      importConfirmMessage: 'Import this site?',
      noSiteMessage: 'There are no sites available for viewing',
      siteIsInvalidMessage: 'This site is invalid in JobSiteSettings',
      siteSettings: {
        siteName: 'Site name',
        siteLocation:
          'Location (Zoom to place your site’s location where the white cross is)',
        coordinateSystem: 'Coordinate System',
        submitCreateSiteSuccess: 'The site {{name}} has been created',
        submitCreateSiteError: 'Creating Site failed, please try again',
        submitCreateSuccess: 'Site Coordinate System has been created',
        submitUpdateSuccess: 'Site Coordinate System has been updated',
        submitCreateError:
          'Creating Site Coordinate System failed, please try again',
        siteNameExists: 'A Site with this name already exists',
        minLength: 'Site name must be at least 3 characters',
        maxLength: "Site name mustn't be more than 255 characters",
        required: 'Required',
        projection: 'Projection',
        geoidModel: 'GEOID model',
        geoid: 'GEOID: {{value}}',
        units: 'Units: {{value}}',
        epsg: 'EPSG: {{value}}',
        datumValue: 'Datum: {{value}}',
        timezone: 'Time Zone',
        timezoneExample: 'Example: Asia/Tokyo (+9h)',
        unit: 'Unit',
        datum: 'Datum',
        custom: {
          dragLabel: 'Drag and drop calibration file (.tp3, .gc3) or ',
          browseLabel: 'browse from your device',
          customDatum: 'World Geodetic System 1984',
          units: {
            m: 'm',
            mm: 'mm',
            cm: 'cm',
            km: 'km',
            in: 'in',
            yd: 'yd',
            'us-ft': 'us-ft',
            ft: 'ft',
            fathom: 'fathom',
            mi: 'mi',
            nMi: 'nMi'
          },
          invalidFileExtension:
            'The calibration file {{fileName}} is incorrect\nOnly .tp3 or .gc3 file formats are accepted',
          tooManyFiles: 'Only one calibration file can be uploaded at a time',
          noControlPoints:
            'The calibration file {{fileName}} is incorrect\nIt does not contain any control points'
        }
      }
    },
    newSite: 'New site',
    search: 'Search...',
    logout: 'Logout',
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
          blackBoardFlag: 'Is blackboard',
          action: 'Action'
        }
      },
      deleteModal: {
        confirmFileDeleteMessage: 'Delete this file?',
        confirmFolderDeleteMessage: 'Delete this folder?'
      },
      errors: {
        unableToSaveElmo: 'ELMO credentials could not be saved',
        unableToSaveSite: 'Could not save tree structure',
        duplicateFolderName: 'Duplicate folder name',
        emptyFolderName: 'Please enter the folder name'
      }
    },
    drawer: {
      header: {
        close: 'close'
      },
      table: {
        noData: 'no data'
      },
      title: {
        annotation: 'Annotation',
        image: 'Image',
        video: 'Video'
      }
    },
    termsOfService: 'Terms of Service',
    currentLocation: {
      errors: {
        permissionDenied: 'You are not allowed to get your current location',
        positionUnavailable: 'Failed to get the current location',
        timeout: 'Current location acquisition timed out',
        default: 'Failed to get the current location'
      }
    },
    logoMenu: {
      productInfo: 'Product Info',
      userManual: 'User manual',
      releaseNotes: 'Release notes',
      notice: 'Notice',
      verInfo: 'Version info'
    },
    sideBarToolTip: {
      file: 'Site File',
      camera: 'View Setting',
      share: 'Publish Setting',
      device: 'Devices Linkage',
      report: 'Output Report',
      config: 'Control Settings',
      user: 'User Infomation'
    },
    notificationsConfig: {
      label: 'Notifications setting',
      modal: {
        list: {
          header: 'Notifications setting - Notification list',
          button: {
            edit: 'Edit Notifications'
          }
        },
        edit: {
          header: 'Notifications setting - Notification edit',
          button: {
            regist: 'Register new email address',
            save: 'Save',
            cancel: 'Cancel'
          }
        },
        searchPlaceholder: 'Serch...',
        noExistNotifications: 'Notification destination is not registered.'
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
    loadPlugin: 'プラグインをロード',
    unloadPlugin: 'プラグインを削除します',
    viewer: 'ビューアー',
    done: '完了',
    next: '次へ',
    cancel: 'キャンセル',
    point: 'ポイント',
    latitude: '緯度',
    longitude: '経度',
    height: '高さ',
    northing: '北距（Y）',
    easting: '東距（X）',
    elevation: '標高（Z）',
    loading: '読込中…',
    input: '入力',
    close: '閉じる',
    coordinateSystems: {
      utm: 'UTM（デフォルト）',
      wgs84: 'WGS84',
      geodetic: '測地（投影法＋ジオイド）',
      custom: 'カスタム'
    },
    mapMore: {
      tooltip: '地図設定',
      baseMap: '地図の種類',
      defaultMap: 'デフォルト',
      baseTerrain: 'ベース地形',
      satellite: '衛星',
      streets: '道路',
      outdoors: '地形図',
      newAnalytic: '新規分析',
      shareLink: 'リンクをシェア',
      exportPdf: 'PDF出力',
      download: 'ファイルをダウンロード',
      units: '単位',
      intlFt: 'Intl Feet',
      usFt: 'US Feet',
      m: 'm'
    },
    renderQuality: {
      label: 'レンダリング品質',
      low: '低',
      standard: '標準',
      high: '高',
      submit: '適用'
    },
    mapview: {
      label: 'マップ表示',
      d3: '3D地形',
      notD3: '2D地形',
      real3D: 'Google Photorealistic 3D Tiles [Beta]',
      real3DTooltip:
        'Google Earthと同じ高解像度・高精度な3Dマップソースである\nGoogle Photorealistic 3D Tilesを試行的に提供しています。\n本機能を有効にすると、一部の機能が利用できなくなりますが、\nマップ表示を「3D地形」に戻すことで再度利用できます。\nなお、本機能は予告なく提供を停止・中止することがございます。\n',
      d2: '2D',
      submit: '適用'
    },
    globeTranslucency: {
      alpha: '透明度',
      fade: '透明度のフェード',
      label: '地形透明度',
      hiddenBelowTerrain: '地形の下にあるアセットを透過表示しない'
    },
    lightController: {
      label: '日照設定',
      show: '日照設定',
      entity: 'アセットの影',
      terrain: '地形の影',
      datetime: '日付時間設定'
    },
    globeContour: {
      label: '等高線',
      show: '等高線表示',
      spacing: '間隔',
      color: '色'
    },
    lengthUnit: {
      unit: {
        m: 'm (メートル)',
        ft: 'ft (フィート)',
        'ft-us': 'US ft (米国測量フィート)',
        'us-ft': 'US ft (米国測量フィート)',
        'Intl ft': 'Intl ft (国際フィート)',
        intlFt: 'Intl ft (国際フィート)',
        'US ft': 'US ft (米国測量フィート)',
        usFt: 'US ft (米国測量フィート)',
        usft: 'US ft (米国測量フィート)'
      }
    },
    mapPointMeasurement: {
      coordinate: '座標',
      latitude: '緯度',
      longitude: '経度',
      elevation: '標高',
      slope: '勾配',
      copyAll: '全てコピー',
      copiedMessage: 'コピーしました',
      units: {
        length: 'm',
        degree: '°',
        percent: '%',
        ratio: '割'
      }
    },
    cameraConfig: {
      label: '操作設定',
      title: '操作設定',
      tooltip: '操作設定',
      mouse: {
        tab: 'マウス操作',
        horizontal: 'ビューの水平移動',
        rotate: 'ビューの回転',
        zoom: 'ズームイン・アウト',
        cameraEvents: {
          leftDrag: '左クリックホールド・ドラッグ',
          rightDrag: '右クリックホールド・ドラッグ',
          middleDrag: '中央クリックホールド・ドラッグ',
          wheel: 'スクロール'
        },
        errors: {
          duplicate: '割り当てが重複しています'
        },
        tooltip: {
          horizontal: 'この設定は変更できません'
        }
      },
      key: {
        tab: 'キー操作',
        placeholder: '任意のキーを押してください',
        zoomIn: 'ズームイン',
        zoomOut: 'ズームアウト',
        moveUp: '視点上昇',
        moveDown: '視点下降',
        moveFoward: '視点前進',
        moveBackward: '視点後退',
        moveLeft: '視点左移動',
        moveRight: '視点右移動',
        rotateUp: '視点上回転',
        rotateDown: '視点下回転',
        rotateLeft: '視点左回転',
        rotateRight: '視点右回転',
        twistLeft: '視点左ひねり',
        twistRight: '視点右ひねり',
        errors: {
          duplicate: '割り当てが重複しています'
        }
      },
      preset: {
        label: 'プリセットの選択',
        default: 'デフォルト',
        arcGis: 'ArcGIS Earth互換'
      },
      submit: '適用'
    },
    menu: {
      newIcon: {
        tooltip: 'アセットか電子黒板のファイルアップロード'
      },
      siteInfo: '現場情報',
      siteList: '現場切り替え',
      timeline: 'タイムライナー',
      peopleCanAccess: '{{value}} 名がアクセスできます'
    },
    errors: {
      unableToDeleteSite: '現場を削除できませんでした',
      unableToLoadSite: '現場情報を取得できませんでした',
      unableToLoadSites: '現場一覧を取得できませんでした',
      unableToImportSite: '現場情報をインポートできませんでした',
      siteArchived:
        '{{siteName}} はアーカイブされました\nアーカイブ解除されるまで読み込まれません'
    },
    modals: {
      title: {
        fileUpload: 'アップロード対象を選択してください',
        import: '現場のインポート',
        select: '現場選択'
      },
      button: {
        cancel: 'キャンセル',
        create: '新規作成',
        import: '現場のインポート',
        importAction: 'インポート',
        onArchiveSite: 'アーカイブ現場 表示',
        offArchiveSite: 'アーカイブ現場 非表示'
      },
      fileUploadTarget: {
        asset: 'アセットのアップロード',
        blackboard: '電子黒板データのアップロード'
      },
      deleteConfirmMessage: 'この現場を削除します',
      importConfirmMessage: 'この現場をインポートします',
      noSiteMessage: '閲覧可能な現場はありません',
      siteIsInvalidMessage: '※JobSiteSettingsに存在しない現場です',
      siteSettings: {
        siteName: '現場名',
        siteLocation: '位置（白のクロス部分にズームしてサイト位置を指定）',
        coordinateSystem: '座標系',
        submitCreateSiteSuccess: 'サイト {{name}} が作成されました',
        submitCreateSiteError: 'サイトの作成に失敗、再試行してください',
        submitCreateSuccess: 'サイトの座標系を作成しました',
        submitUpdateSuccess: 'サイトの座標系をアップデートしました',
        submitCreateError:
          'サイトの座標系を作成できませんでした\n再度お試しください',
        siteNameExists: '同じ名前のサイトが既にあります',
        minLength: 'サイトの名前は3文字以上にしてください',
        maxLength: 'サイトの名前は255文字以内にしてください',
        required: '必須項目',
        projection: '投影法',
        geoidModel: 'ジオイドモデル',
        units: '単位： {{value}}',
        epsg: 'EPSG： {{value}}',
        datumValue: 'データム： {{value}}',
        timezone: 'タイムゾーン',
        timezoneExample: '例： アジア／東京（+9h）',
        unit: '単位',
        datum: 'データム',
        custom: {
          dragLabel:
            'キャリブレーションファイル（.tp3, .gc3）をドラッグ＆ドロップするか',
          browseLabel: 'デバイスから閲覧してください',
          customDatum: '1984 年度世界測地系',
          units: {
            m: 'm',
            mm: 'mm',
            cm: 'cm',
            km: 'km',
            in: 'in',
            yd: 'yd',
            'us-ft': 'us-ft',
            ft: 'ft',
            fathom: 'fathom',
            mi: 'mi',
            nMi: 'nMi'
          },
          invalidFileExtension:
            'キャリブレーションファイル {{fileName}} は正しくありません\n使用できるのは「.tp3」か「.gc3」ファイル形式のみです',
          tooManyFiles:
            'アップロードできるキャリブレーションファイルは 1 度に 1 つのみです',
          noControlPoints:
            'キャリブレーションファイル {{fileName}} は正しくありません\nコントロールポイントが含まれていません'
        }
      }
    },
    newSite: '新しいサイト',
    search: '検索...',
    logout: 'ログアウト',
    dataAdmin: {
      menu: 'データ管理',
      modal: {
        title: 'データ管理',
        addFolder: 'フォルダの追加',
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
          blackBoardFlag: '電子黒板アプリ',
          action: '操作'
        }
      },
      deleteModal: {
        confirmFileDeleteMessage: 'このファイルを削除します',
        confirmFolderDeleteMessage: 'このフォルダを削除します'
      },
      errors: {
        unableToSaveElmo: 'ELMO認証情報を保存できませんでした',
        unableToSaveSite: 'ツリー構造を保存できませんでした',
        duplicateFolderName: 'フォルダ名が重複しています',
        emptyFolderName: 'フォルダ名を入力してください'
      }
    },
    drawer: {
      header: {
        close: '閉じる'
      },
      table: {
        noData: 'データがありません'
      },
      title: {
        annotation: '注釈',
        image: '画像',
        video: '動画'
      }
    },
    termsOfService: '利用規約',
    currentLocation: {
      errors: {
        permissionDenied: '現在地の取得が許可されていません',
        positionUnavailable: '現在地の取得に失敗しました',
        timeout: '現在地取得がタイムアウトしました',
        default: '現在地の取得に失敗しました'
      }
    },
    logoMenu: {
      productInfo: '製品情報',
      userManual: 'ユーザーマニュアル',
      releaseNotes: 'リリースノート',
      notice: 'お知らせ',
      verInfo: 'バージョン情報'
    },
    sideBarToolTip: {
      file: 'アイテム一覧',
      camera: 'ビュー設定',
      share: '公開設定',
      device: 'デバイス連携',
      report: 'レポート出力',
      config: '設定',
      user: 'ユーザー情報'
    },
    notificationsConfig: {
      label: '通知設定',
      modal: {
        list: {
          header: '通知設定 - 通知先一覧',
          button: {
            edit: '通知先の編集'
          }
        },
        edit: {
          header: '通知設定 - 通知先の編集',
          button: {
            regist: '新規メールアドレスの登録',
            save: '保存',
            cancel: 'キャンセル'
          }
        },
        searchPlaceholder: '検索...',
        noExistNotifications: '通知先が登録されていません。'
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
  },
  zh: {
    loadPlugin: '加载插件',
    unloadPlugin: '卸载插件',
    viewer: '查看程序',
    done: '完成',
    next: '下一步',
    cancel: '取消',
    point: '点',
    latitude: '纬度',
    longitude: '经度',
    height: '高度',
    northing: '北向(Y)',
    easting: '东向(X)',
    elevation: '海拔(Z)',
    loading: '正在加载...',
    coordinateSystems: {
      utm: 'UTM（默认）',
      wgs84: 'WGS84',
      geodetic: '测地（投影 + 大地水准面）',
      custom: '定制'
    },
    mapMore: {
      baseMap: '工作草图',
      satellite: '卫星',
      streets: '道路',
      outdoors: '地形',
      submit: '提交',
      newAnalytic: '新分析',
      shareLink: '共享链接',
      exportPdf: '将视图导出成 pdf',
      download: '下载文件',
      units: '单位',
      intlFt: 'Intl Feet',
      usFt: 'US Feet',
      m: 'm'
    },
    renderQuality: {
      label: '渲染质量',
      low: '低',
      standard: '标准',
      high: '高',
      submit: '提交'
    },
    globeTranslucency: {
      alpha: '透明度',
      fade: '透明度褪色',
      label: '地形透明度'
    },
    menu: {
      siteInfo: '站点信息',
      peopleCanAccess: '{{value}}人可以访问'
    },
    errors: {
      unableToLoadSite: '无法加载站点。请重试或选择其他站点。',
      unableToLoadSites: '无法加载站点。请重试。',
      siteArchived: '{{siteName}} 已存档，在取消存档之前无法加载。'
    },
    modals: {
      header: {
        title: '网站清单'
      },
      noSiteMessage: '没有可供查看的网站',
      siteSettings: {
        siteName: '站点名',
        siteLocation: '位置（缩放以把您场地的位置设在白十字所在位置）',
        coordinateSystem: '坐标系',
        submitCreateSiteSuccess: '场地{{name}}已创建。',
        submitCreateSiteError: '创建场地失败，请重试。',
        submitCreateSuccess: '站点坐标系已创建。',
        submitUpdateSuccess: '站点坐标系已更新。',
        submitCreateError: '创建站点坐标系失败，请重试。',
        siteNameExists: '具有该名称的站点已存在',
        minLength: '站点名称必须至少包含 3 个字符',
        maxLength: '站点名称不得超过 255 个字符',
        required: '必填项',
        projection: '投影',
        geoidModel: '大地水准面模型',
        units: '单位：{{value}}',
        epsg: 'EPSG：{{value}}',
        datumValue: '数据：{{value}}',
        timezone: '时区',
        timezoneExample: '示例：亚洲/东京（+9小时）',
        unit: '单位',
        datum: '数据',
        custom: {
          dragLabel: '拖放校准文件（.tp3、.gc3）或',
          browseLabel: '从您的设备浏览',
          customDatum: '1984 年世界大地测量系统',
          units: {
            m: 'm',
            mm: 'mm',
            cm: 'cm',
            km: 'km',
            in: 'in',
            yd: 'yd',
            'us-ft': 'us-ft',
            ft: 'ft',
            fathom: 'fathom',
            mi: 'mi',
            nMi: 'nMi'
          },
          invalidFileExtension:
            '校准文件{{fileName}}不正确。\n仅接受 .tp3 或 .gc3 文件格式。',
          tooManyFiles: '一次只能上传一个校准文件',
          noControlPoints: '校准文件{{fileName}}不正确。\n未包含任何控制点。'
        }
      }
    },
    newSite: '新场地',
    search: '搜索...',
    logout: '登出'
  }
}

export default i18n
