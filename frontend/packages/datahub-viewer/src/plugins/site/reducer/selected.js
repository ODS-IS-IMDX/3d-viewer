// Copyright (c) 2025 NTT InfraNet
// @flow
import { createEntityReducer, type EntityState } from 'utils/reducer'
import type { SiteID, Site } from './index'

import {
  SITE_LOAD_SELECTED,
  SITE_LOAD_SELECTED_ERROR,
  SITE_LOAD_SELECTED_SUCCESS,
  SITE_LOAD_SELECTED_RESET
} from '../actions'

import type { AdditionalReducers } from 'utils/reducer'

export type SiteSelectedState = EntityState<SiteID, Site>

const additionalSiteSelectedReducers: AdditionalReducers<Site> = {
  [SITE_LOAD_SELECTED_RESET]: () => ({
    id: undefined,
    data: undefined,
    isLoading: false
  })
}

export default createEntityReducer<SiteID, Site>(
  SITE_LOAD_SELECTED,
  SITE_LOAD_SELECTED_ERROR,
  SITE_LOAD_SELECTED_SUCCESS,
  undefined,
  additionalSiteSelectedReducers
)
