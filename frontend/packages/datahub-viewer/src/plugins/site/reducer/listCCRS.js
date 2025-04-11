// Copyright (c) 2025 NTT InfraNet
// @flow
import { createListReducer, type EntityListState } from 'utils/reducer'

import type { SiteCCRS } from './index'

import {
  SITE_CCRS_LOAD_LIST,
  SITE_CCRS_LOAD_LIST_ERROR,
  SITE_CCRS_LOAD_LIST_SUCCESS
} from '../actions'

export type SiteCCRSListState = EntityListState<SiteCCRS>

export default createListReducer<SiteCCRS>(
  SITE_CCRS_LOAD_LIST,
  SITE_CCRS_LOAD_LIST_ERROR,
  SITE_CCRS_LOAD_LIST_SUCCESS
)
