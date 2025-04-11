// Copyright (c) 2025 NTT InfraNet
// @flow
import { eventChannel } from 'redux-saga'

/** An object representing some of the upload states
 * @typedef {Object} UPLOAD_STATES
 */
export const UPLOAD_STATES = {
  QUEUEING: 'queueing',
  PENDING: 'pending',
  STARTED: 'started',
  PAUSED: 'paused',
  PAUSING: 'pausing',
  BLOCKED: 'blocked',
  RESUMED: 'resumed',
  FINISHED: 'finished',
  ABORTING: 'aborting',
  ABORTED: 'aborted',
  ERRORED: 'errored'
}

export const uploadEventList = {
  FILE_ADDED: 'file_added',
  FILE_REMOVE: 'file_remove',
  FILE_STATUS_CHANGED: 'file_status_changed',
  PROGRESS: 'progress',
  UPLOAD_ALL_STARTED: 'upload_all_started',
  UPLOAD_ALL_PAUSED: 'upload_all_paused',
  UPLOAD_ALL_RESUMED: 'upload_all_resumed',
  UPLOAD_ALL_FINISHED: 'upload_all_finished',
  UPLOAD_ALL_ABORTED: 'upload_all_aborted',
  UPLOAD_ALL_ABORTED_STARTED: 'upload_all_aborted_started',
  UPLOAD_ALL_FAILED: 'upload_all_failed'
}

export function uploadFileEventManager (uploadManager: {
  events: { on: (any, any) => void, removeListener: (any, any) => void }
}): any => any => void {
  return eventChannel(emitter => {
    Object.values(uploadEventList).forEach(event => {
      uploadManager.events.on(event, function (data) {
        emitter({ type: event, data })
      })
    })

    return () => {
      Object.values(uploadEventList).forEach(event => {
        uploadManager.events.removeAllListeners(event)
      })
    }
  })
}
