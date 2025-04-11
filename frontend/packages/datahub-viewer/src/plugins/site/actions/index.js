// Copyright (c) 2025 NTT InfraNet
// @flow
import type {
  LoadListAction,
  LoadListErrorAction,
  LoadListSuccessAction
} from 'utils/actions'
import type { TIMEZONES } from 'utils/types'
import { createLoadListActions } from 'utils/actions'

import type { Site, SiteID } from '../reducer'

import type { SiteViewerAction } from './viewer'

// Actions
export const SITE_SELECT = 'SITE_SELECT'
export const SITE_LOAD_SELECTED = 'SITE_LOAD_SELECTED'
export const SITE_LOAD_SELECTED_ERROR = 'SITE_LOAD_SELECTED_ERROR'
export const SITE_LOAD_SELECTED_SUCCESS = 'SITE_LOAD_SELECTED_SUCCESS'
export const SITE_LOAD_SELECTED_RESET = 'SITE_LOAD_SELECTED_RESET'
export const SITE_CCRS_LOAD_LIST = 'SITE_CCRS_LOAD_LIST'
export const SITE_CCRS_LOAD_LIST_ERROR = 'SITE_CCRS_LOAD_LIST_ERROR'
export const SITE_CCRS_LOAD_LIST_SUCCESS = 'SITE_CCRS_LOAD_LIST_SUCCESS'
export const SITE_REDIRECT_TO_CREATE_NEW_SITE =
  'SITE_REDIRECT_TO_CREATE_NEW_SITE'
export const SITE_OPEN_DATA_ADMIN_MODAL = 'SITE_OPEN_DATA_ADMIN_MODAL'
export const SITE_SET_IS_OPEN_VIEWER = 'SITE_SET_IS_OPEN_VIEWER'
export const SITE_CLOSE_DATA_ADMIN_MODAL = 'SITE_CLOSE_DATA_ADMIN_MODAL'
export const SITE_SET_CLUSTER_LIST = 'SITE_SET_CLUSTER_LIST'
export const SITE_SET_VIEW_STRUCTURE = 'SITE_SET_VIEW_STRUCTURE'
export const SITE_CHECK = 'SITE_CHECK'
export const SITE_MODE_CHANGE = 'SITE_MODE_CHANGE'
export const SITE_FLY_TO_CURRENT_LOCATION = 'SITE_FLY_TO_CURRENT_LOCATION'
export const SITE_SET_ACTIVE_SIDE_BAR_ICON_NAME =
  'SITE_SET_ACTIVE_SIDE_BAR_ICON_NAME'
export const SITE_SET_OPEN_SIDE_CONTEXT_MENU = 'SITE_SET_OPEN_SIDE_CONTEXT_MENU'
export const SITE_SET_IS_MOBILE = 'SITE_SET_IS_MOBILE'
export const SITE_SET_IS_MAP_SETTING = 'SITE_SET_IS_MAP_SETTING'
export const SITE_SET_OPEN_VIEW_NAME = 'SITE_SET_OPEN_VIEW_NAME'

// Types

export type UpdateSiteBody = {
  name?: string,
  timezone?: TIMEZONES,
  polygonArea?: {},
  location?: {},
  settings?: {},
  ccrsId?: string
}

export type CalibrationFileData = {
  controlPoints: ?[],
  matrix: ?{}
}

export type SiteSelectAction = {
  type: 'SITE_SELECT',
  payload: {
    siteId: SiteID
  }
}

export type SiteLoadSelectedAction = {
  type: 'SITE_LOAD_SELECTED',
  payload: {
    siteId: SiteID
  }
}

export type SiteLoadSelectedErrorAction = {
  type: 'SITE_LOAD_SELECTED_ERROR',
  payload: { error: Error }
}

export type SiteLoadSelectedSuccessAction = {
  type: 'SITE_LOAD_SELECTED_SUCCESS',
  payload: { data: Site, siteId: SiteID }
}

export type SiteLoadSelectedResetAction = {
  type: 'SITE_LOAD_SELECTED_RESET'
}

export type SiteRedirectToCreateNewSiteAction = {
  type: 'SITE_REDIRECT_TO_CREATE_NEW_SITE',
  payload: {}
}

export type SiteCheckAction = {
  type: 'SITE_CHECK',
  payload: {
    siteId: SiteID
  }
}

export type SiteModeChangeAction = {
  type: 'SITE_MODE_CHANGE',
  payload: {
    mode: number
  }
}

export type SiteOpenDataAadminModal = {
  type: 'SITE_OPEN_DATA_ADMIN_MODAL'
}
export type SiteSetIsOpenViewer = {
  type: 'SITE_SET_IS_OPEN_VIEWER',
  payload: { data: any }
}
export type SiteCloseDataAadminModal = {
  type: 'SITE_CLOSE_DATA_ADMIN_MODAL'
}
export type SiteSetClusterListAction = {
  type: 'SITE_SET_CLUSTER_LIST',
  payload: { data: any }
}
export type SiteSetViewStructureAction = {
  type: 'SITE_SET_VIEW_STRUCTURE',
  payload: {
    viewStructure: any
  }
}

export type SiteSetActiveSideBarIconNameAction = {
  type: 'SITE_SET_ACTIVE_SIDE_BAR_ICON_NAME',
  payload: { iconName: string | null }
}

export type SiteSetOpenSideContextMenuAction = {
  type: typeof SITE_SET_OPEN_SIDE_CONTEXT_MENU,
  payload: { close: (() => void) | null }
}

export type SiteCCRSLoadListAction = LoadListAction<SITE_CCRS_LOAD_LIST>
export type SiteCCRSLoadListErrorAction = LoadListErrorAction<SITE_CCRS_LOAD_LIST_ERROR>
export type SiteCCRSLoadListSuccessAction = LoadListSuccessAction<SITE_CCRS_LOAD_LIST_SUCCESS>

export type SiteFlyToCurrentLocationAction = {
  type: typeof SITE_FLY_TO_CURRENT_LOCATION
}

export type SiteSetIsMobileAction = {
  type: typeof SITE_SET_IS_MOBILE,
  payload: {
    isMobile: boolean
  }
}

export type SiteSetIsMapSetting = {
  type: typeof SITE_SET_IS_MAP_SETTING
}

export type SiteSetOpenViewNameAction = {
  type: typeof SITE_SET_OPEN_VIEW_NAME,
  payload: {
    openViewName: string
  }
}

export type SiteAction =
  | SiteDeleteAction
  | SiteImportAction
  | SiteLoadSelectedAction
  | SiteLoadSelectedErrorAction
  | SiteLoadSelectedSuccessAction
  | SiteStoreSelectedAction
  | SiteLoadSelectedResetAction
  | SiteSelectAction
  | SiteUpdateAction
  | SiteUpdateErrorAction
  | SiteUpdateSuccessAction
  | SiteCreateNewSiteAction
  | SiteSetIsOpenViewer
  | SiteRedirectToCreateNewSiteAction
  | SiteViewerAction
  | SiteUpdateSitesAction
  | SiteOpenDataAadminModal
  | SiteCloseDataAadminModal
  | SiteSetClusterListAction
  | SiteSetViewStructureAction
  | SiteSetElmoAuthAction
  | SiteCheckAction
  | SiteModeChangeAction
  | SiteFlyToCurrentLocationAction
  | SiteSetOpenSideContextMenuAction
  | SiteSetIsMobileAction
  | SiteSetIsMapSetting
  | SiteSetOpenViewNameAction

export type SiteCCRSAction =
  | SiteCCRSCreateAction
  | SiteCCRSCreateErrorAction
  | SiteCCRSCreateSuccessAction
  | SiteCCRSLoadListAction
  | SiteCCRSLoadListErrorAction
  | SiteCCRSLoadListSuccessAction
  | SiteGeoidModelsLoadListAction
  | SiteGeoidModelsLoadListErrorAction
  | SiteGeoidModelsLoadListSuccessAction
  | SiteProjectionsLoadListAction
  | SiteProjectionsLoadListErrorAction
  | SiteProjectionsLoadListSuccessAction
  | SiteSiteCCRSAddCalibrationFileAction
  | SiteSiteCCRSAddCalibrationFileSuccessAction
  | SiteSiteCCRSAddCalibrationFileErrorAction
  | SiteSiteCCRSSetCustomUnitsAction
  | SiteCreateNewSiteAndSiteCCRS
  | SiteCreateNewSiteAndSiteCCRSSuccess
  | SiteCreateNewSiteAndSiteCCRSError

// Action creators

export * from './viewer'
export * from './material'

export const select = (siteId: SiteID): SiteSelectAction => ({
  type: SITE_SELECT,
  payload: { siteId }
})

export const loadSelected = (siteId: SiteID): SiteLoadSelectedAction => ({
  type: SITE_LOAD_SELECTED,
  payload: { siteId }
})

export const loadSelectedError = (
  error: Error
): SiteLoadSelectedErrorAction => ({
  type: SITE_LOAD_SELECTED_ERROR,
  payload: { error }
})

export const loadSelectedSuccess = (
  siteId: SiteID,
  site: Site
): SiteLoadSelectedSuccessAction => ({
  type: SITE_LOAD_SELECTED_SUCCESS,
  payload: { siteId, data: site }
})

export const loadSelectedReset = (): SiteLoadSelectedResetAction => ({
  type: SITE_LOAD_SELECTED_RESET
})

export const checkSite = (siteId: SiteID): SiteCheckAction => ({
  type: SITE_CHECK,
  payload: { siteId }
})

export const changeSceneMode = (mode: number): SiteModeChangeAction => ({
  type: SITE_MODE_CHANGE,
  payload: { mode }
})

export const {
  loadList: loadCCRSList,
  loadListError: loadCCRSListError,
  loadListSuccess: loadCCRSListSuccess
} = createLoadListActions(
  SITE_CCRS_LOAD_LIST,
  SITE_CCRS_LOAD_LIST_ERROR,
  SITE_CCRS_LOAD_LIST_SUCCESS
)

export const setIsViewerOpen = (data: any): SiteSetIsOpenViewer => ({
  type: SITE_SET_IS_OPEN_VIEWER,
  payload: data
})

export const setClusterList = (data: any): SiteSetClusterListAction => ({
  type: SITE_SET_CLUSTER_LIST,
  payload: data
})
export const setViewStructure = (data: any): SiteSetViewStructureAction => ({
  type: SITE_SET_VIEW_STRUCTURE,
  payload: { viewStructure: data }
})

export const flyToCurrentLocation = (): SiteFlyToCurrentLocationAction => ({
  type: SITE_FLY_TO_CURRENT_LOCATION
})

export const setActiveSideBarIconName = (iconName: string | null) => ({
  type: SITE_SET_ACTIVE_SIDE_BAR_ICON_NAME,
  payload: { iconName }
})

export const setOpenSideContextMenu = (close: (() => void) | null) => ({
  type: SITE_SET_OPEN_SIDE_CONTEXT_MENU,
  payload: { close }
})

export const setIsMobile = (isMobile: boolean) => ({
  type: SITE_SET_IS_MOBILE,
  payload: { isMobile }
})

export const setIsMapSetting = () => ({
  type: SITE_SET_IS_MAP_SETTING
})

export const setOpenViewName = (openViewName: string | null) => ({
  type: SITE_SET_OPEN_VIEW_NAME,
  payload: { openViewName }
})
