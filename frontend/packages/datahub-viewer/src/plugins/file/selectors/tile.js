// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'
import type { RootState } from 'index'

import type { FileTileState } from 'plugins/file/reducer'

const fileTilingStateSelector = (state: RootState): FileTileState =>
  state.file.tile

// $FlowFixMe
export const getTilingFilesNumber = createSelector(
  fileTilingStateSelector,
  selector => (selector ? selector.tilingFilesNumber : 0)
)
// $FlowFixMe
export const getErrorFilesNumber = createSelector(
  fileTilingStateSelector,
  selector => (selector ? selector.errorFilesNumber : 0)
)
// $FlowFixMe
export const getTilingFileList = createSelector(
  fileTilingStateSelector,
  selector => (selector ? selector.files : [])
)
