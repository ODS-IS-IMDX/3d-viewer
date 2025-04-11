// Copyright (c) 2025 NTT InfraNet
// @flow
import { combineReducers } from 'redux'

import type { SiteAction, SiteCCRSAction } from '../actions'
import selected, { type SiteSelectedState } from './selected'
import listCCRS, { type SiteCCRSListState } from './listCCRS'
import viewer from './viewer'
import site from './site'
import material, { type SiteMaterialState } from './material'
import { sideBarReducer as sideBar, type SiteSideBarState } from './sideBar'
import mobile, { type SiteMobileState } from './mobile'
import notificationsReducer from './notifications'

export * from './sideBar'
export * from './viewer'
// import { any } from 'prop-types'

// Types

export type SiteID = string
export type SiteBucketID = string

export type ConfirmSiteInfo = {
  siteId: SiteID,
  siteName: string
}

export type MeasurementSystem = {
  area: string,
  density: string,
  length: string,
  mass: string,
  position: string,
  system: string,
  volume: string
}

export type SiteCCRS = {
  createdAt: string,
  id: string,
  measurementSystem: MeasurementSystem,
  geoidHeight: ?number,
  name: string,
  type: string,
  parameters: {
    geoid?: string,
    projection?: {
      proj4?: string,
      epsgCode?: string,
      params?: {
        datum?: string,
        projection?: string,
        ellps?: string,
        latFirstParallel?: string,
        latSecondParallel?: string,
        latOrigin?: string,
        lonOrigin?: string,
        falseEasting?: number,
        falseNorthing?: number,
        scaleFactor?: number,
        falseOriginUseFeet?: boolean,
        useFeet?: boolean
      }
    },
    translation?: {
      offsetEasting?: number,
      offsetNorthing?: number,
      offsetUseFeet?: boolean,
      inputUseFeet?: boolean
    },
    rotation?: {
      rotation?: number,
      rotationOriginEasting?: number,
      rotationOriginNorthing?: number,
      rotationOriginUseFeet?: boolean,
      rotationUseFeet?: boolean
    },
    verticalShift?: {
      verticalOffset?: number,
      verticalOriginEasting?: number,
      verticalOriginNorthing?: number,
      verticalInclineEast?: number,
      verticalInclineNorth?: number,
      verticalOffsetOriginUseFeet?: boolean,
      verticalOffsetUseFeet?: boolean
    }
  },
  transform: {
    multi?: boolean,
    proj4?: string,
    unitName?: string,
    utm2local?: Array<string> | string,

    local2utm?: Array<string> | string
  },
  rawControlPoints?: [],
  version: number
}

type Model = {
  cols: number,
  maxlat: number,
  maxlon: number,
  minlat: number,
  minlon: number,
  name: string,
  rows: number,
  spacingLat: number,
  spacingLon: number
}

export type GEOIDModel = {
  [key: string]: {
    models: $ReadOnlyArray<Model>
  }
}

export type Projection = {
  id: number,
  name: string,
  proj4: string,
  units: string,
  bbox: $ReadOnlyArray<number>,
  datum: {
    code: string,
    ellps: string,
    name: string
  }
}

export type Site = {
  id: SiteID,
  name: string,
  status: string,
  timezone: string,
  ccrs: SiteCCRS,
  archive: boolean
}

export type SiteState = $ReadOnly<{|
  ccrsList: SiteCCRSListState,
  geoidModelsList: SiteGeoidModelsListState,
  projectionsList: SiteProjectionsListState,
  selected: SiteSelectedState,
  clusterList: any,
  siteOpen: any,
  material: SiteMaterialState,
  siteBar: SiteSideBarState,
  mobile: SiteMobileState
|}>

export type SiteReducer = (
  state: SiteState,
  action: SiteAction & SiteCCRSAction
) => SiteState

// State & Reducer

// $FlowFixMe
const reducer: SiteReducer = combineReducers({
  ccrsList: listCCRS,
  selected,
  viewer,
  site,
  material,
  sideBar,
  mobile,
  notifications: notificationsReducer
})

export default reducer
