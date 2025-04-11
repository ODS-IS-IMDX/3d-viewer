// Copyright (c) 2025 NTT InfraNet
// @flow

export const HEIGHT_ABOVE_ELLIPSOID: string = 'HEIGHT_ABOVE_ELLIPSOID'
export const TERMS_OF_SERVICE_URL: string =
  process.env.REACT_APP_TERMS_OF_SERVICE_URL || ''

export const SiteMenuFillOrder = {
  ACTION_BUTTONS: 1,
  DATA_MENU_ITEM: 2
}

export const SITE_STATUS = {
  ENABLE_IMPORT: 'ENABLE_IMPORT',
  IS_IMPORTED: 'IS_IMPORTED',
  IS_INVALID: 'IS_INVALID',
  DELETED: 'DELETED'
}

export const MODAL_TYPE = {
  SELECT: 'SELECT',
  IMPORT: 'IMPORT',
  SELECTOR: {
    ASSET_BLACKBOARD: 'ASSET_BLACKBOARD_TYPE_SELECTOR',
    BLACKBOARD: 'BLACKBOARD_TYPE_SELECTOR',
    ASSET: 'ASSET_TYPE_SELECTOR'
  }
}

export const SELECT_MENU_TYPE = {
  DELETE_FILE: 'DELETE_FILE',
  DOWNLOAD_FILE: 'DOWNLOAD_FILE',
  DELETE_FOLDER: 'DELETE_FOLDER',
  RENAME_FOLDER: 'RENAME_FOLDER'
}
export const PANE = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

export const SIDE_BAR_ICON_NAME = {
  LOGO: 'LOGO',
  FILE: 'FILE',
  COG: 'COG',
  USER: 'USER'
}

export const OPEN_VIEW_NAME = {
  MAIN_MENU: 'MAIN_MENU',
  FILE_MENU: 'FILE_MENU',
  ASSET_ITEM_MENU: 'ASSET_ITEM_MENU',
  MOBILE_ITEM_SELECTER: 'MOBILE_ITEM_SELECTER'
}

export const SITE_PERMISSION_TEXT =
  process.env.REACT_APP_GSI_APPROVAL_NUMBER &&
  `測量法に基づく国土地理院長承認（使用）${process.env.REACT_APP_GSI_APPROVAL_NUMBER}`

export const OPEN_STREET_MAP_PERMISSION = {
  TEXT: 'MapQuest, Open Street Map and contributors, CC-BY-SA',
  URL: 'https://www.openstreetmap.org/copyright'
}

/** 通知設定画面の表示モード */
export const SITE_NOTIFICATION_MODAL_DISPLAY_MODE = {
  LIST: 'LIST',
  EDIT: 'EDIT'
}

/** ユーザの通知設定ステータス */
export const SITE_NOTIFICATION_USER_STATUS = {
  ENABLED: 'ENABLED',
  INVALID: 'INVALID'
}
