// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { FileReducer } from 'plugins/file/reducer'

const UploadStateSelector = (state: RootState): FileReducer => state.file.upload

// $FlowFixMe
export const getUploadFileList = createSelector(
  UploadStateSelector,
  selector => selector.files
)
// $FlowFixMe
export const getSelectedFileIndex = createSelector(
  UploadStateSelector,
  selector => selector.selectedFileIndex
)
// $FlowFixMe
export const getUploadingFilesNumber = createSelector(
  UploadStateSelector,
  selector => selector.uploadingFilesNumber
)
// $FlowFixMe
export const getNeedUploadFilesNumber = createSelector(
  UploadStateSelector,
  selector => (selector ? selector.needUploadFilesNumber : 0)
)
