// Copyright (c) 2025 NTT InfraNet
// @flow
import EventEmitter from 'events'
import { FILE_UPLOAD_PROGRESS_EVENT_NAME } from 'plugins/file/constants'

class FileEvent extends EventEmitter {
  emitFileUploadProgressEvent = ({ progressEvent, tempId }) => {
    const progress = progressEvent.loaded / progressEvent.total
    this.emit(FILE_UPLOAD_PROGRESS_EVENT_NAME, [tempId, progress])
  }
}

export const fileEvent = new FileEvent()
