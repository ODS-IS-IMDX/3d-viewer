// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'
import type { RootState } from 'index'
import type { FileReducer } from 'plugins/file/reducer'

const downloadSelector = (state: RootState): FileReducer => state.file.download
// $FlowFixMe
export const getDownloadingFileIdList = createSelector(
  downloadSelector,
  download => download.downloadingFileIdList
)
