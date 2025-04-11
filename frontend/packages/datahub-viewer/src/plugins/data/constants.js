// Copyright (c) 2025 NTT InfraNet
// @flow

export const FILE_TYPE = {
  ASSET: 1
}
export const SUB_FILE_TYPE = {
  ASSET: {
    TOPOGRAPHY: 1,
    DESIGNFILE: 4
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

export const ROOT_ELEMENT = 'elements'
export const TREE_ID = 'rct__main'
export const TREE_ROOT_INDEX = 'root'

export const TIMELINE_MARKER_ID = 'marker'
export const TIMELINE_INFO_LOCAL_STORAGE_KEY = 'TIMELINE_INFO'
export const TIMELINE_ITEMS_LOCAL_STORAGE_KEY = 'TIMELINE_ITEMS'

export const MENU_MODE = {
  EDIT: 'EDIT',
  SHOW: 'SHOW'
}

/** 親子メニューアイテムのインデント(単位px) */
export const RENDER_DEPTH_OFFSET = 20
