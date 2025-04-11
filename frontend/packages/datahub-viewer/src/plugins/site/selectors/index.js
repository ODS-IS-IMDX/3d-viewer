// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'
import { get } from 'lodash'

import type { RootState } from 'index'
import type { SiteState, Site, SiteID } from 'plugins/site/reducer'
import type { MeasurementUnit } from 'plugins/site/types'

import routes from '../routes'

const siteStateSelector = (state: RootState): SiteState => state.site

export * from './viewer'
export * from './sideBar'
export * from './mobile'

// $FlowFixMe
export const isLoading: RootState => boolean = createSelector(
  siteStateSelector,
  ({ selected }) => selected.isLoading
)

export const getSiteId: RootState => SiteID = createSelector(
  routes.site.selector,
  params => (params ? params.siteId : undefined)
)

// $FlowFixMe
export const getSite: RootState => Site = createSelector(
  siteStateSelector,
  ({ selected }: RootState): Site => selected && selected.data
)

// $FlowFixMe
export const getError: RootState => ErrorResult = createSelector(
  siteStateSelector,
  state => state.error
)

// $FlowFixMe
// TODO This selector implementation is temporary, it requires the CCRS integration to get the actual unit
// the switch is made only for demo pourpose, the "Treasure island" site uses the imperial unit system,
// the others sites use the metric unit system

// 現場マネージャで管理されている単位情報。
export const getUnit: RootState => MeasurementSystem = createSelector(
  getSite,
  state => get(state, 'ccrs.measurementSystem')
)

// 計測結果の表示で使用する単位。
// 現場マネージャで管理されている単位情報は現状では計測結果表示には使用できないため、getUnitとは別でgetSiteUnitを定義。
// TODO 現場マネージャの値を使用できるようになったらgetUnitに統合する。
type GetSiteUnitType = RootState => MeasurementUnit
export const getSiteUnit: GetSiteUnitType = createSelector(getSite, site =>
  get(site, 'measurementUnit')
)
const dummyCcrs = {
  measurementSystem: {
    system: 'metric',
    position: 'm',
    length: 'm',
    mass: 'tonne',
    area: 'm2',
    volume: 'm3',
    density: 'tonne/m3'
  }
}

export const getSiteCCRS: RootState => SiteCCRS = createSelector(
  getSite,
  state => (state ? dummyCcrs : null)
)

export const siteCCRSListStateSelector: RootState => SiteCCRSListState = createSelector(
  siteStateSelector,
  state => state.ccrsList
)

export const siteGeoidModelsStateSelector: RootState => SiteGeoidModelsListState = createSelector(
  siteStateSelector,
  state => state.geoidModelsList
)

export const siteProjectionsStateSelector: RootState => SiteProjectionsListState = createSelector(
  siteStateSelector,
  state => state.projectionsList
)

export const getSiteTimezone: RootState => string = createSelector(
  getSite,
  site => get(site, 'timezone') || 'Etc/GMT'
)

// $FlowFixMe
export const getSites: RootState => Sites = createSelector(
  siteStateSelector,
  state => state.sites.items
)

export const getSiteOpen: RootState => Sites = createSelector(
  siteStateSelector,
  state => state.site.open
)

type GetSiteBucketIdType = RootState => string
export const getSiteBucketId: GetSiteBucketIdType = createSelector(
  getSite,
  site => site.bucketId
)

// $FlowFixMe
export const getViewStructure: RootState => Site = createSelector(
  siteStateSelector,
  ({ selected }: RootState): Site => {
    return selected && selected.data && selected.data.viewStructure
      ? selected.data.viewStructure
      : {}
  }
)

// $FlowFixMe
export const getSelectedSite: RootState => Site = createSelector(
  siteStateSelector,
  (state: RootState): Site => state && state.selected && state.selected.data
)

// $FlowFixMe
export const getIsMapSetting: RootState => boolean = createSelector(
  siteStateSelector,
  ({ site }) => site && site.isMapSetting
)

// $FlowFixMe
export const getExternalServices: RootState => Sites = createSelector(
  getSite,
  site => site && site.externalServices
)
